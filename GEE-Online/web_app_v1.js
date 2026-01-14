/**
 * This app follows the template below created by Google Earth 
 * https://medium.com/google-earth/tips-tricks-for-building-earth-engine-apps-f12b46786ae7
 * 
 */

/*******************************************************************************
 * Model *
 ******************************************************************************/

var m = {};

// Import Krusenstern Polygon
m.krusensternLagoon = ee.FeatureCollection("projects/ee-jlzamary/assets/krusenstern_pkg");

// Sentinel Collection 
m.Sentinel2 = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED");

// Cloud Mask
m.maskS2clouds = function(image) {
  var qa = image.select('QA60');
  var cloudBitMask = 1 << 10;
  var cirrusBitMask = 1 << 11;
  var mask = qa.bitwiseAnd(cloudBitMask).eq(0)
      .and(qa.bitwiseAnd(cirrusBitMask).eq(0));
  return image.updateMask(mask).divide(10000);
};

// NDCI Index 
m.addNDCI = function(image) {
  var ndci = image.normalizedDifference(['B5', 'B4']).rename('NDCI');
  return image.addBands(ndci);
};

// Store current images for layer toggling
m.currentTrueColorImage = null;
m.currentNDCIImage = null;
m.currentGrayScaleImage = null;


/*******************************************************************************
 * Styling *
 ******************************************************************************/

// Define a JSON object for defining CSS-like class style properties.
var s = {};

s.panelLeft = {
  width: '400px',
  padding: '8px',
  position: 'top-left'
  // height: '100%'
};

s.titleLabel = {
  fontSize: '22px',
  fontWeight: 'bold',
  margin: '0px 0px 10px 0px'
};

s.selectorStyle = {
  stretch: 'horizontal',
  margin: '0px 0px 10px 0px'
};

s.layerPanel = {
  border: '2px solid #000000',
  padding: '8px',
  margin: '0px 0px 8px 0px'
};

s.layerPanelName = {
  fontWeight: 'bold',
  margin: '0px 0px 5px 0px'
};

s.layerPanelDescription = {
  color: 'grey',
  fontSize: '11px'
};

s.infoPanel = {
  border: '2px solid #000000',
  padding: '8px',
  backgroundColor: '#f8f8f8'
};

s.dateLabel = {
  margin: '5px 0px 0px 0px'
};

s.textboxStyle = {
  stretch: 'horizontal'
};

s.buttonStyle = {
  stretch: 'horizontal',
  margin: '8px 0px 0px 0px'
};

s.checkboxStyle = {
  margin: '2px 0px'
};

s.imageCountStyle = {
  fontSize: '11px',
  color: 'gray',
  margin: '5px 0px 0px 0px'
};


/*******************************************************************************
 * Components *
 ******************************************************************************/

// Define a JSON object for storing UI components.
var c = {};

// Main panel (left side)
c.panelLeft = ui.Panel({style: s.panelLeft});

// Title
c.title = ui.Label({
  value: 'Krusenstern Lagoon Analysis',
  style: s.titleLabel
});

// Analysis type selector
c.analysisSelector = ui.Select({
  items: ['NDCI Analysis', 'Ice Coverage'],
  value: 'NDCI Analysis',
  placeholder: 'Choose analysis type',
  style: s.selectorStyle
});

// ========== NDCI PANEL ==========

c.ndciPanel = ui.Panel({style: s.layerPanel});

c.dateRangeLabel = ui.Label({
  value: 'Date Range',
  style: s.layerPanelName
});

c.startDateLabel = ui.Label('Start Date (YYYY-MM-DD):');
c.startDateBox = ui.Textbox({
  placeholder: 'YYYY-MM-DD',
  value: '2024-06-20',
  style: s.textboxStyle
});

c.endDateLabel = ui.Label('End Date (YYYY-MM-DD):', s.dateLabel);
c.endDateBox = ui.Textbox({
  placeholder: 'YYYY-MM-DD',
  value: '2024-06-22',
  style: s.textboxStyle
});

c.updateButton = ui.Button({
  label: 'Update Map',
  style: s.buttonStyle
});

c.imageCountLabel = ui.Label({
  value: 'Click "Update Map" to load imagery',
  style: s.imageCountStyle
});

// Add date components to NDCI panel
c.ndciPanel.add(c.dateRangeLabel);
c.ndciPanel.add(c.startDateLabel);
c.ndciPanel.add(c.startDateBox);
c.ndciPanel.add(c.endDateLabel);
c.ndciPanel.add(c.endDateBox);
c.ndciPanel.add(c.updateButton);
c.ndciPanel.add(c.imageCountLabel);

// ========== LAYERS SECTION ==========

c.layersPanel = ui.Panel({style: s.layerPanel});

c.layersTitle = ui.Label({
  value: 'Layers',
  style: s.layerPanelName
});

c.showTrueColorCheck = ui.Checkbox({
  label: 'True Color',
  value: false,
  style: s.checkboxStyle
});

c.showNDCICheck = ui.Checkbox({
  label: 'NDCI',
  value: true,
  style: s.checkboxStyle
});

c.showGrayScaleCheck = ui.Checkbox({
  label: 'Gray Scale',
  value: false,
  style: s.checkboxStyle
});

c.layersPanel.add(c.layersTitle);
c.layersPanel.add(c.showTrueColorCheck);
c.layersPanel.add(c.showNDCICheck);
c.layersPanel.add(c.showGrayScaleCheck);

// ========== ICE COVERAGE PANEL ==========

c.icePanel = ui.Panel({style: s.layerPanel});

c.iceTitle = ui.Label({
  value: 'Ice Coverage Analysis',
  style: s.layerPanelName
});

c.icePlaceholder = ui.Label({
  value: 'Ice coverage functionality coming soon...',
  style: s.layerPanelDescription
});

c.icePanel.add(c.iceTitle);
c.icePanel.add(c.icePlaceholder);

// ========== INFO PANEL ==========

c.infoPanel = ui.Panel({style: s.infoPanel});

c.infoTitle = ui.Label({
  value: 'About',
  style: s.layerPanelName
});

c.infoText = ui.Label({
  value: 'Remote sensing web-app to monitor ecological and temporal changes in coastal Chukchi Sea lagoons.',
  style: {fontSize: '11px', whiteSpace: 'pre-wrap', backgroundColor: '#f8f8f8'}
});

c.infoPanel.add(c.infoTitle);
c.infoPanel.add(c.infoText);


/*******************************************************************************
 * Behaviors *
 ******************************************************************************/

// Function to update NDCI based on selected dates
function updateNDCI(startDateStr, endDateStr) {
  // Validate dates
  var start = ee.Date(startDateStr);
  var end = ee.Date(endDateStr);
  
  // Count available images
  var imageCount = m.Sentinel2
    .filterBounds(m.krusensternLagoon)
    .filterDate(start, end)
    .size();
  
  imageCount.evaluate(function(count) {
    c.imageCountLabel.setValue('Available images: ' + count);
  });
  
  // Clear previous layers
  Map.layers().reset();
  
  // Add lagoon boundary
  Map.addLayer(m.krusensternLagoon, {color: "9CAB84"}, 'Krusenstern Lagoon', true, 0.5);
  
  // Get imagery for selected date range
  m.currentTrueColorImage = m.Sentinel2
    .filterBounds(m.krusensternLagoon)
    .filterDate(start, end)
    .map(m.maskS2clouds)
    .median() 
    .clip(m.krusensternLagoon);
  
  m.currentNDCIImage = m.Sentinel2
    .filterBounds(m.krusensternLagoon)
    .filterDate(start, end)
    .map(m.maskS2clouds)
    .map(m.addNDCI)
    .select('NDCI')
    .median()
    .clip(m.krusensternLagoon);
  
  m.currentGrayScaleImage = m.currentNDCIImage;
  
  // Add layers based on checkbox state
  if (c.showTrueColorCheck.getValue()) {
    Map.addLayer(m.currentTrueColorImage, 
                 {bands: ['B4', 'B3', 'B2'], min: 0, max: 0.3}, 
                 'True Color');
  }
  
  if (c.showNDCICheck.getValue()) {
    Map.addLayer(m.currentNDCIImage, 
                 {min: -0.3, max: 0.4, palette: ['blue', 'green', 'red']}, 
                 'NDCI');
  }
  
  if (c.showGrayScaleCheck.getValue()) {
    Map.addLayer(m.currentGrayScaleImage, 
                 {min: -0.3, max: 0.4, palette: ['white', 'black']}, 
                 'Gray Scale');
  }
  
  // Center map on lagoon
  Map.centerObject(m.krusensternLagoon, 11);
}

// Function to toggle layer visibility
function toggleLayer(layerName, checked, image, vizParams) {
  var layers = Map.layers();
  for (var i = 0; i < layers.length(); i++) {
    var layer = layers.get(i);
    if (layer.getName() === layerName) {
      layer.setShown(checked);
      return;
    }
  }
  // If layer doesn't exist and checkbox is checked, add it
  if (checked && image) {
    Map.layers().add(ui.Map.Layer(image, vizParams, layerName));
  }
}

// Panel switching functions
function showNDCIPanel() {
  c.panelLeft.clear();
  c.panelLeft.add(c.title);
  c.panelLeft.add(c.analysisSelector);
  c.panelLeft.add(c.ndciPanel);
  c.panelLeft.add(c.layersPanel);
  c.panelLeft.add(c.infoPanel);
  
  // Load initial data if not already loaded
  if (!m.currentNDCIImage) {
    updateNDCI('2024-06-20', '2024-06-22');
  }
}

function showIcePanel() {
  c.panelLeft.clear();
  c.panelLeft.add(c.title);
  c.panelLeft.add(c.analysisSelector);
  c.panelLeft.add(c.icePanel);
  c.panelLeft.add(c.infoPanel);
  
  // Clear map layers when switching to ice panel
  Map.layers().reset();
  Map.addLayer(m.krusensternLagoon, {color: "9CAB84"}, 'Krusenstern Lagoon');
}

// Assign callbacks - Update button
c.updateButton.onClick(function() {
  var start = c.startDateBox.getValue();
  var end = c.endDateBox.getValue();
  updateNDCI(start, end);
});

// Assign callbacks - Analysis selector
c.analysisSelector.onChange(function(value) {
  if (value === 'NDCI Analysis') {
    showNDCIPanel();
  } else if (value === 'Ice Coverage') {
    showIcePanel();
  }
});

// Assign callbacks - Layer checkboxes
c.showTrueColorCheck.onChange(function(checked) {
  toggleLayer('True Color', checked, m.currentTrueColorImage, 
              {bands: ['B4', 'B3', 'B2'], min: 0, max: 0.3});
});

c.showNDCICheck.onChange(function(checked) {
  toggleLayer('NDCI', checked, m.currentNDCIImage,
              {min: -0.3, max: 0.4, palette: ['blue', 'green', 'red']});
});

c.showGrayScaleCheck.onChange(function(checked) {
  toggleLayer('Gray Scale', checked, m.currentGrayScaleImage,
              {min: -0.3, max: 0.4, palette: ['white', 'black']});
});


/*******************************************************************************
 * Initialize *
 ******************************************************************************/
 
Map.add(c.panelLeft);
showNDCIPanel();
Map.centerObject(m.krusensternLagoon, 11);