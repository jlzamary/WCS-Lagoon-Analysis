// Basic NDCI visualization script for GEE Online 


/**
 * 
 *    All GeoJson files must be converted and zipped into .shp files
 *    to run the following. Additionally, it's important that the
 *    Krusenstern geojson file (Data/lagoon_polygons/krusenstern.geojson)
 *    is used. ** It does need to be zipped.
 **/


// GeoJSON Conversion to .shp file using https://mygeodata.cloud/conversion#result

// Import Krusenstern Polygon (insert directory to .shp file)
var krusensternLagoon = ee.FeatureCollection("projects/ee-jlzamary/assets/krusenstern_pkg");
Map.addLayer(krusensternLagoon, {color: "9CAB84"}, 'Krusenstern Lagoon');

// Sentinel Collection 
var Sentinel2 = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED");

// Cloud Mask 
function maskS2clouds(image) {
  var qa = image.select('QA60');

  // Bits 10 and 11 are clouds and cirrus, respectively.
  var cloudBitMask = 1 << 10;
  var cirrusBitMask = 1 << 11;

  // Both flags should be set to zero, indicating clear conditions.
  var mask = qa.bitwiseAnd(cloudBitMask).eq(0)
      .and(qa.bitwiseAnd(cirrusBitMask).eq(0));

  return image.updateMask(mask).divide(10000);
}

// Create NDCI Index
var addNDCI = function(image) {
  var ndci = image.normalizedDifference(['B5', 'B4']).rename('NDCI');
  return image.addBands(ndci);
};

// Test Dates start_date = '2024-06-20'
//            end_date = '2024-06-22'

// True Color Image 
var trueColorImage = Sentinel2
  .filterBounds(krusensternLagoon)
  .filterDate('2024-06-20', '2024-06-22')
  .map(maskS2clouds)
  .median() 
  .clip(krusensternLagoon);

// NDCI Composite
var ndciImage = Sentinel2
  .filterBounds(krusensternLagoon)
  .filterDate('2024-06-20', '2024-06-22')
  .map(maskS2clouds)
  .map(addNDCI)
  .select('NDCI')
  .median()
  .clip(krusensternLagoon);

// Add to Map
Map.addLayer(trueColorImage, {bands: ['B4', 'B3', 'B2'], min: 0, max: 0.3}, 'True Color');
Map.addLayer(ndciImage, {min: -0.3, max: 0.4, palette: ['blue', 'green', 'red']}, 'NDCI');

Map.addLayer(ndciImage, {min: -0.3, max: 0.4, palette: ['white', 'black']}, 'Gray Scale');
Map.addLayer(ndciImage, {min: -1, max: 1, palette: ['blue', 'white', 'red']}, 'NDCIv2');
