document.addEventListener('DOMContentLoaded', function() {
  const plantImage = document.getElementById('plant-image');
  const growthBar = document.getElementById('growth');
  const waterBar = document.getElementById('water');
  const waterBtn = document.getElementById('water-btn');
  const fertilizeBtn = document.getElementById('fertilize-btn');

  // Load saved plant data or initialize
  chrome.storage.local.get(['plantData'], function(result) {
    const plantData = result.plantData || {
      growth: 10,
      water: 50,
      lastWatered: Date.now(),
      lastUpdated: Date.now(),
      stage: 1
    };
    
    updatePlant(plantData);
    startGrowthCycle(plantData);
  });

  // Water plant
  waterBtn.addEventListener('click', function() {
    chrome.storage.local.get(['plantData'], function(result) {
      const plantData = result.plantData;
      plantData.water = Math.min(100, plantData.water + 30);
      plantData.lastWatered = Date.now();
      chrome.storage.local.set({ plantData }, function() {
        updatePlant(plantData);
      });
    });
  });

  // Fertilize plant (boosts growth)
  fertilizeBtn.addEventListener('click', function() {
    chrome.storage.local.get(['plantData'], function(result) {
      const plantData = result.plantData;
      plantData.growth = Math.min(100, plantData.growth + 15);
      chrome.storage.local.set({ plantData }, function() {
        updatePlant(plantData);
      });
    });
  });

  function updatePlant(plantData) {
    // Update plant image based on growth stage
    let stage = 1;
    if (plantData.growth >= 75) stage = 4;
    else if (plantData.growth >= 50) stage = 3;
    else if (plantData.growth >= 25) stage = 2;
    else if (plantData.growth >= 100) stage = 5;
    else if (plantData.growth >= 125) stage = 6;
    
    plantData.stage = stage;
    plantImage.src = `images/plant${stage}.jpg`;
    growthBar.value = plantData.growth;
    waterBar.value = plantData.water;
    
    // Disable buttons if plant is fully grown
    if (plantData.growth >= 100) {
      waterBtn.disabled = true;
      fertilizeBtn.disabled = true;
    }
  }

  function startGrowthCycle(plantData) {
    setInterval(() => {
      const now = Date.now();
      const hoursSinceWatered = (now - plantData.lastWatered) / (1000 * 60 * 60);
      
      // Decrease water over time
      plantData.water = Math.max(0, plantData.water - (hoursSinceWatered * 5));
      
      // Growth depends on water level
      if (plantData.water > 30) {
        const growthRate = plantData.water / 100;
        plantData.growth = Math.min(100, plantData.growth + growthRate);
      }
      
      plantData.lastWatered = now;
      plantData.lastUpdated = now;
      
      chrome.storage.local.set({ plantData }, function() {
        updatePlant(plantData);
      });
    }, 5000); // Update every 5 seconds
  }
});