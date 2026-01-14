// Usefull UI tips: https://developers.google.com/earth-engine/guides/ui_panels
// GeoJSON Conversion to .shp file using https://mygeodata.cloud/conversion#result

// Import Krusenstern Polygon
var krusensternLagoon = ee.FeatureCollection("projects/ee-jlzamary/assets/krusenstern_pkg");

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

// Messing around with headers to document 

//  ################################### 
//  #                                 #  
//  #           UI COMPONENTS         #    
//  #                                 #   
//  ################################### 

// Create main panel (left side)
var mainPanel = ui.Panel({
  style: {
    width: '400px',
    padding: '8px',
    position: 'top-left'
  }
});

// Title
var title = ui.Label({
  value: 'Krusenstern Lagoon Analysis',
  style: {
    fontWeight: 'bold',
    fontSize: '18px',
    margin: '0px 0px 10px 0px'
  }
});

// Analysis type selector
var analysisSelector = ui.Select({
  items: ['NDCI Analysis', 'Ice Coverage'],
  value: 'NDCI Analysis',
  placeholder: 'Choose analysis type',
  style: {stretch: 'horizontal', margin: '0px 0px 10px 0px'},
  onChange: function(value) {
    if (value === 'NDCI Analysis') {
      showNDCIPanel();
    } else if (value === 'Ice Coverage') {
      showIcePanel();
    }
  }
});

// ========== NDCI PANEL ==========

var ndciPanel = ui.Panel({
  style: {
    border: '2px solid #000000',
    padding: '8px',
    margin: '0px 0px 8px 0px'
  }
});

// Date Range Section
var dateRangeLabel = ui.Label({
  value: 'Date Range',
  style: {fontWeight: 'bold', margin: '0px 0px 5px 0px'}
});

// Start date input
var startDateLabel = ui.Label('Start Date (YYYY-MM-DD):');
var startDateBox = ui.Textbox({
  placeholder: 'YYYY-MM-DD',
  value: '2024-06-20',
  style: {stretch: 'horizontal'}
});

// End date input
var endDateLabel = ui.Label('End Date (YYYY-MM-DD):', {margin: '5px 0px 0px 0px'});
var endDateBox = ui.Textbox({
  placeholder: 'YYYY-MM-DD',
  value: '2024-06-22',
  style: {stretch: 'horizontal'}
});

// Update button
var updateButton = ui.Button({
  label: 'Update Map',
  style: {stretch: 'horizontal', margin: '8px 0px 0px 0px'},
  onClick: function() {
    var start = startDateBox.getValue();
    var end = endDateBox.getValue();
    updateNDCI(start, end);
  }
});

// Image count label
var imageCountLabel = ui.Label({
  value: 'Click "Update Map" to load imagery',
  style: {fontSize: '11px', color: 'gray', margin: '5px 0px 0px 0px'}
});

// Add date components to NDCI panel
ndciPanel.add(dateRangeLabel);
ndciPanel.add(startDateLabel);
ndciPanel.add(startDateBox);
ndciPanel.add(endDateLabel);
ndciPanel.add(endDateBox);
ndciPanel.add(updateButton);
ndciPanel.add(imageCountLabel);

// ========== LAYERS SECTION ==========

var layersPanel = ui.Panel({
  style: {
    border: '2px solid #000000',
    padding: '8px',
    margin: '0px 0px 8px 0px'
  }
});

var layersTitle = ui.Label({
  value: 'Layers',
  style: {fontWeight: 'bold', margin: '0px 0px 5px 0px'}
});

// Layer visibility checkboxes
var showTrueColorCheck = ui.Checkbox({
  label: 'True Color',
  value: true,
  style: {margin: '2px 0px'}
});

var showNDCICheck = ui.Checkbox({
  label: 'NDCI',
  value: true,
  style: {margin: '2px 0px'}
});

var showGrayScaleCheck = ui.Checkbox({
  label: 'Gray Scale',
  value: false,
  style: {margin: '2px 0px'}
});

layersPanel.add(layersTitle);
layersPanel.add(showTrueColorCheck);
layersPanel.add(showNDCICheck);
layersPanel.add(showGrayScaleCheck);

// ========== ICE COVERAGE PANEL ==========

var icePanel = ui.Panel({
  style: {
    border: '1px solid #ddd',
    padding: '8px',
    margin: '0px 0px 8px 0px'
  }
});

var iceTitle = ui.Label({
  value: 'Ice Coverage Analysis',
  style: {fontWeight: 'bold', margin: '0px 0px 5px 0px'}
});

var icePlaceholder = ui.Label({
  value: 'Ice coverage functionality coming soon...',
  style: {color: 'gray', fontStyle: 'italic'}
});

icePanel.add(iceTitle);
icePanel.add(icePlaceholder);

// ========== INFO PANEL (bottom) ==========

var infoPanel = ui.Panel({
  style: {
    border: '2px solid #000000',
    padding: '8px',
    backgroundColor: '#f8f8f8'
  }
});

var infoTitle = ui.Label({
  value: 'About',
  style: {fontWeight: 'bold', margin: '0px 0px 5px 0px'}
});

var infoText = ui.Label({
  value: 'Remote sensing web-app to monitor ecological and temporal changes in coastal Chukchi Sea lagoons.',
  style: {fontSize: '11px', whiteSpace: 'pre-wrap', backgroundColor: '#f8f8f8'}
});

infoPanel.add(infoTitle);
infoPanel.add(infoText);

// ========== UPDATE FUNCTIONS ==========

// Store current images for layer toggling
var currentTrueColorImage;
var currentNDCIImage;
var currentGrayScaleImage;

// Function to update NDCI based on selected dates
function updateNDCI(startDateStr, endDateStr) {
  // Validate dates
  var start = ee.Date(startDateStr);
  var end = ee.Date(endDateStr);
  
  // Count available images
  var imageCount = Sentinel2
    .filterBounds(krusensternLagoon)
    .filterDate(start, end)
    .size();
  
  imageCount.evaluate(function(count) {
    imageCountLabel.setValue('Available images: ' + count);
  });
  
  // Clear previous layers
  Map.layers().reset();
  
  // Add lagoon boundary
  Map.addLayer(krusensternLagoon, {color: "9CAB84"}, 'Krusenstern Lagoon', true, 0.5);
  
  // Get imagery for selected date range
  currentTrueColorImage = Sentinel2
    .filterBounds(krusensternLagoon)
    .filterDate(start, end)
    .map(maskS2clouds)
    .median() 
    .clip(krusensternLagoon);
  
  currentNDCIImage = Sentinel2
    .filterBounds(krusensternLagoon)
    .filterDate(start, end)
    .map(maskS2clouds)
    .map(addNDCI)
    .select('NDCI')
    .median()
    .clip(krusensternLagoon);
  
  currentGrayScaleImage = currentNDCIImage;
  
  // Add layers based on checkbox state
  if (showTrueColorCheck.getValue()) {
    Map.addLayer(currentTrueColorImage, 
                 {bands: ['B4', 'B3', 'B2'], min: 0, max: 0.3}, 
                 'True Color');
  }
  
  if (showNDCICheck.getValue()) {
    Map.addLayer(currentNDCIImage, 
                 {min: -0.3, max: 0.4, palette: ['blue', 'green', 'red']}, 
                 'NDCI');
  }
  
  if (showGrayScaleCheck.getValue()) {
    Map.addLayer(currentGrayScaleImage, 
                 {min: -0.3, max: 0.4, palette: ['white', 'black']}, 
                 'Gray Scale');
  }
  
  // Center map on lagoon
  Map.centerObject(krusensternLagoon, 10);
}

// Add callbacks for checkboxes to toggle layer visibility
showTrueColorCheck.onChange(function(checked) {
  // Find and toggle True Color layer
  var layers = Map.layers();
  for (var i = 0; i < layers.length(); i++) {
    var layer = layers.get(i);
    if (layer.getName() === 'True Color') {
      layer.setShown(checked);
      return;
    }
  }
  // If layer doesn't exist and checkbox is checked, add it
  if (checked && currentTrueColorImage) {
    Map.layers().add(ui.Map.Layer(currentTrueColorImage, 
                     {bands: ['B4', 'B3', 'B2'], min: 0, max: 0.3}, 
                     'True Color'));
  }
});

showNDCICheck.onChange(function(checked) {
  var layers = Map.layers();
  for (var i = 0; i < layers.length(); i++) {
    var layer = layers.get(i);
    if (layer.getName() === 'NDCI') {
      layer.setShown(checked);
      return;
    }
  }
  if (checked && currentNDCIImage) {
    Map.layers().add(ui.Map.Layer(currentNDCIImage, 
                     {min: -0.3, max: 0.4, palette: ['blue', 'green', 'red']}, 
                     'NDCI'));
  }
});

showGrayScaleCheck.onChange(function(checked) {
  var layers = Map.layers();
  for (var i = 0; i < layers.length(); i++) {
    var layer = layers.get(i);
    if (layer.getName() === 'Gray Scale') {
      layer.setShown(checked);
      return;
    }
  }
  if (checked && currentGrayScaleImage) {
    Map.layers().add(ui.Map.Layer(currentGrayScaleImage, 
                     {min: -0.3, max: 0.4, palette: ['white', 'black']}, 
                     'Gray Scale'));
  }
});

// ========== PANEL SWITCHING ==========

function showNDCIPanel() {
  mainPanel.clear();
  mainPanel.add(title);
  mainPanel.add(analysisSelector);
  mainPanel.add(ndciPanel);
  mainPanel.add(layersPanel);
  mainPanel.add(infoPanel);
  
  // Load initial data if not already loaded
  if (!currentNDCIImage) {
    updateNDCI('2024-06-20', '2024-06-22');
  }
}

function showIcePanel() {
  mainPanel.clear();
  mainPanel.add(title);
  mainPanel.add(analysisSelector);
  mainPanel.add(icePanel);
  mainPanel.add(infoPanel);
  
  // Clear map layers when switching to ice panel
  Map.layers().reset();
  Map.addLayer(krusensternLagoon, {color: "9CAB84"}, 'Krusenstern Lagoon');
}

// ========== INITIALIZE APP ==========

// Add main panel to map
Map.add(mainPanel);

// Initialize with NDCI panel
showNDCIPanel();

// Set initial map view
Map.centerObject(krusensternLagoon, 11);