	/*!
 * Fierce Planet - Resource types
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */

var ResourceTypes = ResourceTypes || {};

(function() {
	// Economic resources
	this.FARM_RESOURCE_TYPE = new ResourceType("Farm", "farm", "/images/icons/truck.png", 10, 20, 100, 20);
	this.SHOP_RESOURCE_TYPE = new ResourceType("Shop", "shop", "/images/icons/basket.png", 15, 25, 150, 30);
	this.BANK_RESOURCE_TYPE = new ResourceType("Bank", "bank", "/images/icons/dollars.png", 20, 30, 200, 50);
	this.FACTORY_RESOURCE_TYPE = new ResourceType("Factory", "factory", "/images/icons/factory-2.png", 25, 40, 250, 70);
	this.STOCKMARKET_RESOURCE_TYPE = new ResourceType("Stockmarket", "stockmarket", "/images/icons/stockmarket.png", 30, 50, 300, 90);


	// Environmental resources
	this.FRESH_WATER_RESOURCE_TYPE = new ResourceType("Fresh Water", "water", "/images/icons/recycled-water.png", 10, 20, 100, 10);
	this.WILDLIFE_PARK_RESOURCE_TYPE = new ResourceType("Wildlife Park", "park", "/images/icons/butterfly.png", 15, 25, 150, 15);
	this.CLEAN_AIR_RESOURCE_TYPE = new ResourceType("Clear Air", "air", "/images/icons/renewable.png", 20, 30, 200, 25);
	this.GREEN_ENERGY_RESOURCE_TYPE = new ResourceType("Green Energy", "energy", "/images/icons/eco-power.png", 25, 40, 250, 35);
	this.BIODIVERSITY_RESOURCE_TYPE = new ResourceType("Biodiversity", "biodiversity", "/images/icons/biodiversity.png", 30, 300, 100, 45);


	// Social resources
	this.CLINIC_RESOURCE_TYPE = new ResourceType("Clinic", "clinic", "/images/icons/bandaid.png", 10, 20, 100, 5);
	this.SCHOOL_RESOURCE_TYPE = new ResourceType("School", "school", "/images/icons/abc.png", 15, 25, 150, 8);
	this.LEGAL_SYSTEM_RESOURCE_TYPE = new ResourceType("Legal System", "legal", "/images/icons/scales.png", 20, 30, 200, 15);
	this.DEMOCRACY_RESOURCE_TYPE = new ResourceType("Democracy", "democracy", "/images/icons/microphone.png", 25, 40, 250, 20);
	this.FESTIVAL_RESOURCE_TYPE = new ResourceType("Festival", "festival", "/images/icons/martini.png", 30, 50, 300, 25);

    this.WASTE_RESOURCE_TYPE = new ResourceType("Waste", "waste", "/images/icons/liquid-waste.png", 10, 20, 100, 5);


	// Additional resources - uncategorised
	this.AEROPLANE = new ResourceType("Aeroplane", "aeroplane", "/images/icons/aeroplane.png", 30, 50, 300, 25);
	this.TRAVEL_RESOURCE_TYPE = new ResourceType("Travel", "travel", "/images/icons/van.png", 30, 50, 300, 25);



	/**
	 * Resources assigned to profile class capabilities (@link Profile)
	 *
	 * TODO: Use actual resource types instead
	 */
	this.NOVICE_CAPABILITIES = ["farm", "water", "clinic"];
	this.PLANNER_CAPABILITIES = this.NOVICE_CAPABILITIES.concat(["shop", "park", "school"]);
	this.EXPERT_CAPABILITIES = this.PLANNER_CAPABILITIES.concat(["bank", "air", "legal"]);
	this.VISIONARY_CAPABILITIES = this.EXPERT_CAPABILITIES.concat(["factory", "energy", "democracy"]);
	this.GENIUS_CAPABILITIES = this.VISIONARY_CAPABILITIES.concat(["stockmarket", "biodiversity", "festival"]);
	
}).apply(ResourceTypes);

if (typeof exports !== "undefined")
	exports.ResourceTypes = ResourceTypes;
