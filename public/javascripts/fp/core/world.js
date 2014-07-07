/*!
 * Fierce Planet - World
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */

Distance = {
    CHEBYSHEV_DISTANCE: 0,
    MINKOWSKI_DISTANCE: 1,
    TAXICAB_DISTANCE: 2
};


/**
 * World class definition
 *
 * @constructor
 */
function World() {

    this.initWorld = function() {

        // Initialise the set of current and expired agents
        this.setCurrentAgents([]);
        this.expiredAgents = [];

        // Initialise cells
        this.initialiseCells();

        // Generate a path, based on cells that can be moved to
        this.generatePath();

        this.waves = undefined;

        // Reset any resources
        this.resetResources();

        // Initialise a catastrophe if one exists
        if (this.catastrophe != undefined)
            this.catastrophe.struck = false;

        // Set up world
        if (this.setup)
            this.setup();

        this.initialiseWaves(this.waveNumber);
    };

    /**
     * Gets a tile at the given co-ordinate
     * @param x
     * @param y
     */
    this.areAgentsAllowed = function(x, y) {
        var world = this;
        return world.getCell(x, y).agentsAllowed;
    };

    /**
     *
     * @param cellPositions
     */
    this.allowAgentsOnCellPositions = function(cellPositions) {
        var world = this;
        var liveCellPositions = _.compact(cellPositions);
        liveCellPositions.forEach(function(cellPosition) {
            var cell = world.getCell(cellPosition.x, cellPosition.y);
            if (!_.isUndefined(cell)) {
                cell.agentsAllowed = false;
            }
        })
        this.generatePath();
    };

    this.forbidAgentOnCell = function(x, y) {
        var cell = this.getCell(x, y);
        if (!_.isUndefined(cell)) {
            cell.agentsAllowed = false;
            cell.isEntryPoint = false;
            cell.isExitPoint = false;
        }
    };

    this.forbidAgentsOnAllCells = function() {
        this.cells.forEach(function(cell) { cell.agentsAllowed = false;})
        this.generatePath();
    };

    this.allowAgentsOnAllCells = function() {
        this.cells.forEach(function(cell) { cell.agentsAllowed = true;})
        this.generatePath();
    };
    this.allowAgentsOnCellRange = function(start, number) {
        for (var i = start; i < start + number; i++) {
            var cell = this.cells[i];
            cell.agentsAllowed = true;
        }
        this.generatePath();
    };
    this.forbidAgentsOnCellRange = function(start, number) {
        for (var i = start; i < start + number; i++) {
            var cell = this.cells[i];
            cell.agentsAllowed = false;
        }
        this.generatePath();
    };

    /**
     * Generates a computed path based on the absence of tiles
     */
    this.generatePath = function() {
        var pathCells = [];
        // New
        this.cells.forEach(function(cell) {
            if (cell.agentsAllowed) {
                pathCells.push([cell.x, cell.y]);
            }
        })
        this.pathway = pathCells;
        return pathCells;
    };


    /**
     * Retrieves the index of the co-ordinate in the path variable
     */
    this.isInPath = function(x, y) {
        for (var i = 0; i < this.pathway.length; i++) {
            var coord = this.pathway[i];
            if (coord[0] == x && coord[1] == y)
                return i;
        }
        return -1;
    };
    /**
     * Remove cell from path
     */
    this.removeFromPath = function(x, y) {
        if (this.getCell(x, y).agentsAllowed)
            this.pathway.splice(index, 1);
    };
    /**
     * Adds a particular terrain to all parts of the path
     */
    this.addTerrainToPath = function(terrain) {
        this.cells.forEach(function(cell) {
            if (cell.agentsAllowed) {
                cell.terrain = terrain;
            }
        })
    };
    /**
     * Adds a particular terrain to the background
     */
    this.addTerrainToBackground = function(terrain) {
        this.backgroundTerrain = terrain;
    };


// Cell functions
    this.indexify = function(x, y) {
        return y * this.cellsAcross + x;
    };
    this.deindexify = function(num) {
        return [num % this.cellsAcross, Math.floor(num / this.cellsAcross)];
    };
    this.getCell = function(x, y) {
        return this.cells[this.indexify(x, y)];
    };
    this.initialiseCells = function() {
        for (var i = 0; i < this.cellsAcross; i++) {
            for (var j = 0; j < this.cellsDown; j++) {
                this.cells[this.indexify(i, j)] = new Cell(i, j);
            }
        }
        this.updateCells();
    };

    this.addCellAtPoint = function(x, y) {
        this.cells[this.indexify(x, y)] = new Cell(x, y);
    }

    this.updateCells = function() {
        var i, x, y, cell;
        for (i = 0; i < this.resources.length; i++) {
            var resource = this.resources[i];
            x = resource.x, y = resource.y;
            cell = this.cells[this.indexify(x, y)];
            if (!_.isUndefined(cell))
                cell.resources.push(resource);
        }
        for (var i = 0; i < this.currentAgents.length; i++) {
            var agent = this.currentAgents[i];
            x = agent.x, y = agent.y;
            cell = this.cells[this.indexify(x, y)];
            if (!_.isUndefined(cell))
                cell.agents.push(agent);
        }
    };

    this.addAgentToCell = function(agent) {
        var x = agent.x, y = agent.y;
        var cell = this.cells[this.indexify(x, y)];
        if (!_.isUndefined(cell))
            cell.agents.push(agent);
    };

    this.removeAgentFromCell = function(agent) {
        var x = agent.x, y = agent.y;
        var cell = this.getCell(x, y);
        var index = _.indexOf(cell.agents, agent);
        if (!_.isUndefined(cell))
            cell.agents.splice(index, 1);
    };
    this.changeAgentInCell = function(agent, lastX, lastY) {
        var x = agent.x, y = agent.y;
        if (!_.isUndefined(lastX) && !_.isUndefined(lastY)) {
            var cell = this.getCell(lastX, lastY);
            var index = _.indexOf(cell.agents, agent);
            if (!_.isUndefined(cell))
                cell.agents.splice(index, 1);
        }

        this.addAgentToCell(agent);
    };
    this.removeAllAgentsFromCells = function() {
        this.cells.forEach(function(cell) { cell.agents = []});
    };
    this.getAgentsAtCell = function(x, y) {
        return this.cells[this.indexify(x, y)].agents;
    };

    this.getFirstAgentAtCell = function(x, y) {
        var agents = this.getAgentsAtCell(x, y);
        return (agents && agents.length > 0) ? agents[0] : void 0;
    };


// Entry point functions
    /**
     *
     * @param x
     * @param y
     */
    this.addEntryPoint = function(x, y) {
        var cell = this.getCell(x, y);
        if (!_.isUndefined(cell))
            cell.isEntryPoint = true;
    };
    this.getEntryPoints = function() {
        return _.compact(_.map(this.cells, function(cell) { if (cell.isEntryPoint) return cell;}));
    };
    /**
     * Resets the entry point collection, leaving only one entry point at co-ordinate (0. 0)
     */
    this.resetEntryPoints = function() {
        this.cells.forEach(function(cell) {
            cell.isEntryPoint = false;
        });
    };
    /**
     * Removes an entry point at the given co-ordinate
     * @param x
     * @param y
     */
    this.removeEntryPoint = function(x, y) {
        this.getCell(x, y).isEntryPoint = false;
    };

// Exit point functions

    this.isExitPoint = function(x, y) {
        return this.getCell(x, y).isExitPoint;
    }

    /**
     *
     * @param x
     * @param y
     */
    this.addExitPoint = function(x, y) {
        var cell = this.getCell(x, y);
        if (!_.isUndefined(cell))
            cell.isExitPoint = true;
    };
    /**
     *
     */
    this.resetExitPoints = function() {
        this.cells.forEach(function(cell) {
            cell.isExitPoint = false;
        });
    };
    /**
     *
     * @param x
     * @param y
     */
    this.removeExitPoint = function(x, y) {
        this.getCell(x, y).isExitPoint = false;
    };
    this.getExitPoints = function() {
        return _.compact(_.map(this.cells, function(cell) { if (cell.isExitPoint) return cell;}));
    };

    /**
     * Determines whether a cell at a given co-ordinate is either an entry or an exit point
     * @param x
     * @param y
     */
    this.isEntryOrExitPoint = function(x, y) {
        var cell = this.getCell(x, y);
        if (!_.isUndefined(cell))
            return (cell.isEntryPoint || cell.isExitPoint);
        return false;
    };


// Agent functions

    /**
     * Retrieves current agents - will filter if a filter agent is available (requires Underscore to be loaded)
     */
    this.getCurrentAgents = function() {
        if (typeof(_) === 'undefined' || _.isUndefined(this.currentAgentsFunction))
            return this.currentAgents;
        else
            return _.filter(this.currentAgents, this.currentAgentsFunction);
    };

    /**
     * Sets the current agent collection, and adds agents to a map
     * @param currentAgents
     */
    this.setCurrentAgents = function(currentAgents) {
        this.currentAgents = currentAgents;
        for (var i = 0; i < this.currentAgents.length; i++) {
            var agent = this.currentAgents[i];
            this.currentAgentsMap[[agent.x, agent.y]] = agent;
            this.addAgentToCell(agent);
        }
    };

    /**
     * Add expired agent
     */
    this.addExpiredAgent = function(agent, time) {
        agent.alive = false;
        agent.diedAt = time;
        this.expiredAgents.push(agent);
    };


    /**
     * Add saved agent
     */
    this.addSavedAgent = function(agent, time) {
        agent.alive = false;
        agent.savedAt = time;
        agent.diedAt = time;
        this.savedAgents.push(agent);

        // Adjust resources
        var resourceBonus = (this.currentWaveNumber < 5 ? 4 : (this.currentWaveNumber < 10 ? 3 : (this.currentWaveNumber < 20 ? 2 : 1)));
        this.currentResourceStore += resourceBonus;
    };


    /**
     *
     * @param culture
     * @param number
     */
    this.generateAgents = function(culture, number) {
        var agents = [],
            world = this;
        if (this.randomiseAgents) {
            // Get pathway length
            var pl = this.cells.length;
            for (var i = 0; i < number; i ++) {
                // Generate a random tile position
                var positionFound = false;
                while (!positionFound) {
                    var ci = Math.floor(Math.random() * pl);
                    var cell = this.cells[ci];
                    if (cell.agents == 0 && cell.agentsAllowed) {
                        var positions = this.getMooreNeighbourhood(cell.x, cell.y, false);
                        var counter = 0;
                        var agent = world.generateAgentAtPoint(culture, cell.x, cell.y);
                        agents.push(agent);
                        positionFound = true;
                    }
                }
            }
        }
        else if (this.placeAgentsOnAllCells) {
            // Get pathway length
            for (var i = 0, pl = this.pathway.length; i < pl; i ++) {
                // Generate a random tile position
                var tile = this.pathway[i];
                var agent = this.generateAgentAtPoint(culture, tile[0], tile[1]);
                agents.push(agent);
            }
        }
        else {
            var entryPoints = this.getEntryPoints();
            for (var j = 0; j < entryPoints.length; j++) {
                var point = entryPoints[j];
                var x = point.x;
                var y = point.y;
                for (var i = 0; i < number; i ++) {
                    var agent = this.generateAgentAtPoint(culture, x, y, j);
                    agents.push(agent);
                }
            }
        }
        this.setCurrentAgents(agents);
        return agents;
    };


    /**
     * Generate agents at a point
     * @param culture
     * @param x
     * @param y
     * @param j
     * @return {Agent}
     */
    this.generateAgentAtPoint = function(culture, x, y, j) {
        var agent = new Agent(culture, x, y);
        var colorSeed = j % 3;
        var colorScheme = (colorSeed == 0 ? "000" : (colorSeed == 1 ? "0f0" : "00f"));
        // TODO: Make this option configurable
//            agent.setColor(colorScheme);
        agent.delay = parseInt(Math.random() * agent.culture.initialSpeed * 5);
        agent.bornAt = (Lifecycle.worldCounter);

        // Reduce health of a random category
        /**
         * TODO: Replace with more systematic approach - belongs in Agent type or custom world config
         */
        if (Universe.settings.agentsHaveRandomInitialHealth) {
            var categoryLength = ModuleManager.currentModule.resourceSet.categories.length;
            var categoryToReduceIndex = Math.floor(Math.random() * categoryLength);
            var categoryToReduce = ModuleManager.currentModule.resourceSet.categories[categoryToReduceIndex];

            // Reduce by no more than 50%
            var maxReduction = -50;
            var amountToReduce = Math.ceil(Math.random() * maxReduction);
            agent.adjustHealthForResourceCategory(amountToReduce, categoryToReduce);
        }
        return agent;
    };

    /**
     * Indicates total number of agents saveable on this world
     */
    this.getTotalSaveableAgents = function () {
        var firstWave = this.initialAgentNumber;
        var lastWave = this.waveNumber + this.initialAgentNumber -1;
        var minor = (firstWave * (firstWave - 1)) / 2;
        var major = (lastWave * (lastWave + 1)) / 2;
        var saveablePerEntryPoint = major - minor;
        var totalSaveable = saveablePerEntryPoint * this.getEntryPoints().length;
        return totalSaveable;
    };



// Overall agent health functions

    /**
     * Find the current resource index
     */
    this.currentAgentHealthStats = function () {
        var stats = {}, resourceSet = ModuleManager.currentModule.resourceSet;

        if (!_.isUndefined(resourceSet)) {
            for (var i = 0, l = resourceSet.categories.length; i < l; i++) {
                stats[resourceSet.categories[i].code] = 0;
            }
            stats.total = 0;
            for (var i = 0, l = this.currentAgents.length; i < l; i++) {
                var agent = this.currentAgents[i];

                if (!_.isUndefined(agent.culture.healthCategories)) {
                    for (var j = 0; j < agent.culture.healthCategories.length; j ++) {
                        var h = agent.getHealthForResourceCategory(agent.culture.healthCategories[j]);
                        stats[agent.culture.healthCategories[j].code] += h;
                    }
                }
                stats.total += agent.health;
            }
            // Average values
            for (var i = 0, l = resourceSet.categories.length; i < l; i++) {
                stats[resourceSet.categories[i].code] /= this.currentAgents.length;
            }
            stats.total += this.currentAgents.length;
        }
        return stats;
    };



    /******************************************/
    /** RESOURCE FUNCTIONS ********************/
    /******************************************/


    this.addResourceToCell = function(resource) {
        var x = resource.x, y = resource.y;
        var cell = this.cells[this.indexify(x, y)];
        if (!_.isUndefined(cell))
            cell.resources.push(resource);
    };
    this.removeResourceFromCell = function(resource) {
        var x = resource.x, y = resource.y;
        var cell = this.getCell(x, y);
        var index = _.indexOf(cell.resources, resource);
        if (!_.isUndefined(cell))
            cell.resources.splice(index, 1);
    };
    this.removeAllResourcesFromCells = function() {
        this.cells.forEach(function(cell) { cell.resources = []});
    };
    this.getResourcesAtCell = function(x, y) {
        return this.cells[this.indexify(x, y)].resources;
    };

    /**
     * @param resources
     */
    this.resetResources = function() {
        this.currentResourceStore = this.initialResourceStore;
        this.currentResourceSpent = 0;

        this.resources = [];
        this.worldResources = this.worldResources || [];
        this.removeAllResourcesFromCells();
        for (var i = 0; i < this.worldResources.length; i++) {
            this.resources.push(this.worldResources[i]);
            this.addResourceToCell(this.worldResources[i]);
        }
        this.resourceCategoryCounts = this.resetResourceCategoryCounts();
    };

    /**
     *
     * @param resources
     */
    this.setResources = function(resources) {
        this.resetResources();
        var that = this;
        resources.forEach(function(resource) {
            that.addResource(resource)
        });
        this.resourceCategoryCounts = this.resetResourceCategoryCounts();
    };

    /**
     * Tests whether a cell position is occupied by a resource
     * @param x
     * @param y
     * @return {Boolean}
     */
    this.isPositionOccupiedByResource = function(x, y) {
        return this.getCell(x, y).resources.length > 0;
    };


    /**
     * Adds a resource to the world
     * @param resource
     */
    this.addResource = function(resource) {
        this.resources.push(resource);
        this.addResourceToCell(resource);

        // Increment the resource category count
        this.resourceCategoryCounts[resource.category.code] += 1;

        this.currentResourceStore -= resource.cost;
        this.currentResourceSpent += resource.cost;
    };

    /**
     *
     * @param resource
     */
    this.addResourceRandomly = function(resourceType) {
        var foundPosition = false,
            clength = this.cells.length;

        for (var i = 0; i < clength; i ++) {
            var rx = Math.floor(Math.random() * this.cellsAcross),
                ry = Math.floor(Math.random() * this.cellsDown);
            var cell = this.getCell(rx, ry);
            if (cell.resources.length == 0 && cell.resourcesAllowed) {
                this.addResource(new Resource(resourceType, rx, ry));
                break;
            }
        }
    };

    /**
     *
     * @param resource
     */
    this.removeResource = function(resource) {
        var index = this.getCurrentResourceIndex(resource);
        if (index > -1) {
            this.resources.splice(index, 1);
            this.removeResourceFromCell(resource);

            // Decrement the resource category count
            this.resourceCategoryCounts[resource.category.code] -= 1;
        }
    };


    /**
     *
     * @param resource
     */
    this.removeResourceByPosition = function(x, y) {
        var index = this.getResourceIndexAtPosition(x, y);
        if (index > -1) {
            var resource = this.resources[index];
            this.resources.splice(index, 1);
            this.removeResourceFromCell(resource);

            // Decrement the resource category count
            this.resourceCategoryCounts[resource.category.code] -= 1;
        }
    };



    /**
     * Adds a number of resources to the world-level resources
     * @param agentType
     * @param number
     */
    this.generateWorldResources = function() {
        if (this.randomiseResources && this.initialResourceNumber > 0) {
            // Get pathway length
            this.worldResources = [];
            for (var i = 0; i < this.initialResourceNumber; i ++) {
                // Generate a random tile position
                var x = Math.floor(Math.random() * this.cellsAcross);
                var y = Math.floor(Math.random() * this.cellsDown);
                var types = ModuleManager.currentModule.resourceSet.types;
                var rt = types[Math.floor(Math.random() * types.length)];
                this.worldResources.push(new Resource(rt, x, y));
            }
        }
        this.resetResources();
    };

    /**
     * Removes world-level resources
     */
    this.removeWorldResources = function() {
        this.worldResources = [];
        this.resetResources();
    };


    // RESOURCE COUNTS

    /**
     * Recalculates resource counts
     * @return {*}
     */
    this.resetResourceCategoryCounts = function() {
        if (_.isUndefined(ModuleManager.currentModule.resourceSet))
            return;

        var rcc = {};
        ModuleManager.currentModule.resourceSet.categories.forEach(function(resourceCategory) {
            rcc[resourceCategory.code] = 0;
        });
        this.resources.forEach(function(resource) {
            rcc[resource.category.code] += 1;
        });
        this.resourceCategoryCounts = rcc;
        return rcc;
    };


    /**
     * Gets the proportion of resources with the given resource category code
     * @param code
     */
    this.getResourceCategoryProportion = function(code) {
        var categoryCount = this.resourceCategoryCounts,
            totalResources = this.resources.length;
        return categoryCount / totalResources;
    };

    /**
     * Find the current resource index
     */
    this.getCurrentResourceIndex = function (resource) {
        for (var i = 0; i < this.resources.length; i++) {
            var tmp = this.resources[i];
            if (tmp == resource) {
                return i;
            }
        }
        return -1;
    };


    /**
     * Find the current resource at a position
     */
    this.getResourceIndexAtPosition = function (x, y) {
        for (var i = 0; i < this.resources.length; i++) {
            var resource = this.resources[i];
            if (resource.x == x && resource.y == y)
                return i;
        }
        return -1;
    };


    /**
     * Calculates the proportion of a particular resource type, relative to the overall number of resources, then returns a log derivative (so minor variations have minimal impact).
     * If the global variable FiercePlanet.ignoreResourceBalance is true, this calculation is ignored.
     * If the global variable FiercePlanet.resourcesInTension is true, this calculation is further adjusted by the proximity of other resources.
     *
     * @param   The resource to calculate the effect for
     * @param   Whether the resource mix should be ignored (TODO: should be moved to the Universe object)
     * @param   Whether tensions between resource categories should be factored in (TODO: should be moved to the Universe object)
     */
    this.calculateResourceEffect = function (resource, ignoreResourceMix, resourcesInTension) {
        // Allow this calculation to be ignored
        if (ignoreResourceMix || Universe.settings.ignoreResourceBalance || Universe.settings.applyGeneralHealth || this.resources.length <= 1)
            return 1;

        var code = resource.category.code;
        var totalResources = this.resources.length;
        var resourceCategoryCount = this.resourceCategoryCounts[code];
//        var resourceCategoryCount = this.getResourceCategoryCount(code);
        var resourceTypeProportion = (resourceCategoryCount / totalResources) * totalResources;
        var proportionOfIdeal = (resourceTypeProportion <= 1) ? resourceTypeProportion : ((totalResources - resourceTypeProportion) / (totalResources - 1));
        var effect = proportionOfIdeal * proportionOfIdeal;


        // Further adjustment based on surrounding resources
        if (resourcesInTension || Universe.settings.resourcesInTension) {
            effect *= this.calculateSurroundingResourcesEffects(resource);
        }
        return effect;
    };

    /**
     * Calculates the effect of surrounding resources
     * TODO: Allow for a variety of effects
     *
     * @param   A resource to calculate the effect for
     * @returns   The effect to apply
     */
    this.calculateSurroundingResourcesEffects = function (resource) {
        var x = resource.x;
        var y = resource.y;
        var resourceCategory = resource.category;
        var baseEffect = 1;
        for (var i = 0, l = this.resources.length; i < l; i++) {
            var neighbour = this.resources[i];
            var nx = neighbour.x;
            var ny = neighbour.y;
            if (nx == x && ny == y)
                continue;
//            if (Math.abs(nx - x) <= 1 && Math.abs(ny - y) <= 1) {
            // Added global resource tension setting
            if (Universe.settings.resourcesInTensionGlobally || Math.abs(nx - x) <= 1 && Math.abs(ny - y) <= 1) {
                var neighbourCategory = neighbour.category;
                baseEffect *= resourceCategory.doEvaluateOtherCategoryImpact(neighbourCategory);
            }
        }
        return baseEffect;
    };

    /**
     * Resets all resource yields to their original values
     */
    this.resetResourceYields = function () {
        this.resources.forEach(function(resource) {
            resource.totalYield = resource.initialTotalYield;
        });
    };


    /**
     * Recover resources to a maximum of their initial state
     *
     * @returns An array of recovered resources
     */
    this.recoverResources = function () {
        var recoveredResources = [];
        this.resources.forEach(function(resource) {
            if (resource.totalYield < resource.initialTotalYield) {
                /* Overly generous... */
                resource.incrementTotalYield();
                recoveredResources.push(resource);
            }
        });
        return recoveredResources;
    };

	/**
	 * Generates a structure contains stats about the current resources
	 */
	this.resourceStats = function() {
        var resourceBalance = 0, resourceCounters = [];
        ModuleManager.currentModule.resourceSet.categories.forEach(function(category) {
            resourceCounters.push(0);
        });
        this.resources.forEach(function(resource) {
            for (var i = 0; i < ModuleManager.currentModule.resourceSet.categories.length; i++) {
                var category = ModuleManager.currentModule.resourceSet.categories[i];
                if (resource.category == (category))
                    resourceCounters[i] = resourceCounters[i] + 1;
            }
        });
        // Computes a rough estimate of the degree of distribution of resources relative to the number of resources outlayed.
        // Kurtosis overkill for this purpose?
        var len = resourceCounters.length
			, min = jStat.min(resourceCounters)
            , max = jStat.max(resourceCounters)
            , sum = jStat.sum(resourceCounters)
            , range = jStat.range(resourceCounters)
            , stdev = jStat.stdev(resourceCounters)
			, coeffvar = jStat.coeffvar(resourceCounters)
			, cappedCoeffvar = (coeffvar > 1 ? 1 : coeffvar)
		return {
			array: resourceCounters
			, len: len
			, min: min
			, max: max
			, sum: sum
            , range: range
            , stdev: stdev
			, coeffvar: coeffvar
			, cappedCoeffvar: cappedCoeffvar
		}
	};

    // WAVES

    /**
     * Initialise waves
     */
    this.initialiseWaves = function(waveNumber) {
        if (_.isUndefined(this.waves) || this.waves.length == 0) {
            this.waves = [];
            for (var i = 0; i < waveNumber; i++) {
                var wave = new Wave();
                wave.agents = [];
                var cultures = this.cultures || ModuleManager.currentModule.allCultures();
                for (var j = 0, len = cultures.length; j < len; j++) {
                    var culture = cultures[j];
                    if (culture.generateEachWave && this.generateWaveAgentsAutomatically) {
                        var thisWaveNumber = (culture.waveNumber ? culture.waveNumber : this.initialAgentNumber);
                        if (this.distributeAgentsNormally) {
                            var s = this.distributeAgentsSigma;
                            if (s == undefined)
                                s = 0;
                            thisWaveNumber = jStat.normal.sample(thisWaveNumber, s);
                        }
                        if (this.incrementAgentsEachWave)
                            thisWaveNumber += (this.incrementAgentsEachWave * i);
                        var agents = this.generateAgents(culture, thisWaveNumber);
                        wave.agents = _.union(wave.agents, agents);
                    }
                }
                this.waves.push(wave);
            }
        }
    };

    /**
     * Find the critical path to the nearest exit point
     */
    this.pointDistance = function(x, y, ex, ey) {
        return Math.abs(ex - x) + Math.abs(ey - y);
    };
    this.meanDistance = function (cell, goal){
        var x = cell[0], y = cell[1];
        var gx = goal[0], gy = goal[1];
        return Math.abs(gx - x) + Math.abs(gy - y);
    };
    this.isSameCell = function (c1, c2){
        return (c1 && c2 && c1[0] == c2[0] && c1[1] == c2[1])
    };
    this.isInHistory = function (cell, history){
        for (var i = 0, l = history.length; i < l; i++) {
            var testCell = history[i];
            if (this.isSameCell(cell, testCell))
                return true;
        }
        return false;
    };
    this.getDirections = function (cell, goal){
        var x = cell[0], y = cell[1];
        var gx = goal[0], gy = goal[1];
        var dx = gx - x, dy = gy - y;
        var directions = [];
        if (Math.abs(dx) < Math.abs(dy)) {
            if (dx < 0)
                directions = (dy < 0) ? [2, 3, 1, 0] : [2, 1, 3, 0];
            else
                directions = (dy < 0) ? [0, 3, 1, 2] : [0, 1, 3, 2];
        }
        else {
            if (dy < 0)
                directions = (dx < 0) ? [3, 2, 0, 1] : [3, 0, 2, 1];
            else
                directions = (dx < 0) ? [1, 2, 0, 3] : [1, 0, 2, 3];
        }
        return directions;
    };


    /**
     * Gets positions surrounding a given co-ordinate.
     * The von Neumann neighbourhood returns only positions to the left, right, top and bottom of the current position.
     * TODO: Fix for
     *
     * @param x
     * @param y
     * @param includeSelf
     */
    this.getVonNeumannNeighbourhood = function(x, y, includeSelf) {
        return _.map(this.getCellsAtDistance(x, y, 1, Distance.TAXICAB_DISTANCE, includeSelf), function(cell) {return {x: cell.x, y: cell.y}});
    };

    /**
     * Gets positions surrounding a given co-ordinate.
     * THe Moore neighbourhood returns only positions to the left, right, top and bottom of the current position.
     *
     * @param x
     * @param y
     * @param includeSelf
     */
    this.getMooreNeighbourhood = function(x, y, includeSelf) {
        return _.map(this.getCellsAtDistance(x, y, 1, Distance.CHEBYSHEV_DISTANCE, includeSelf), function(cell) {return {x: cell.x, y: cell.y}});
    };

    /**
     * Gets positions surrounding a given co-ordinate.
     * THe Moore neighbourhood returns only positions to the left, right, top and bottom of the current position.
     *
     * @param x
     * @param y
     * @param includeSelf
     */
    this.getMvNNeighbourhood = function(x, y, includeSelf) {
        return _.map(this.getCellsAtDistance(x, y, 2, Distance.TAXICAB_DISTANCE, includeSelf), function(cell) {return {x: cell.x, y: cell.y}});
    };

    /**
     * Gets positions surrounding a given co-ordinate.
     * THe Moore neighbourhood returns only positions to the left, right, top and bottom of the current position.
     *
     * @param x
     * @param y
     * @param includeSelf
     */
    this.getHNeighbourhood = function(x, y, includeSelf) {
        return this.getMaskedNeighbourhood(x, y, includeSelf, [3, 7]);
    };

    /**
     * @param x
     * @param y
     * @param includeSelf
     */
    this.getInverseVonNeumannNeighbourhood = function(x, y, includeSelf) {
        return this.getMaskedNeighbourhood(x, y, includeSelf, [1, 3, 5, 7]);
    };

    /**
     * Gets positions surrounding a given co-ordinate.
     *
     * @param x
     * @param y
     * @param includeSelf
     */
    this.getMaskedNeighbourhood = function(x, y, includeSelf, maskedPositionIndexes) {
        var surroundingPositions = this.getMooreNeighbourhood(x, y, includeSelf);

        var sortedPositions = maskedPositionIndexes;
        if (!_.isUndefined(maskedPositionIndexes)) {
            sortedPositions = maskedPositionIndexes.sort(function(a, b) {
                return (a < b ? 1 :  (a > b ? -1 : 0));
            });
        }
        sortedPositions.forEach(function(position) {
            if (includeSelf)
                position += 1;
            if (position >= 0 && position < surroundingPositions.length) {
                surroundingPositions.splice(position, 1);

            }
        });

        return surroundingPositions;
    };



    this.getCellsAtDistance = function(x, y, distance, strategy, includeSelf) {
        var validCells = []
            , strategy = strategy || Distance.CHEBYSHEV_DISTANCE
            , includeSelf = includeSelf || false;

        var minX = (x - distance),
            minY = (y - distance),
            maxX = (x + distance),
            maxY = (y + distance);

        for (var i = minX; i <= maxX; i++ ) {
            for (var j = minY; j <= maxY; j++ ) {
                if ((i == x && j == y) && ! includeSelf)
                    continue;
                var cx = i, cy = j;
                if (this.allowOffscreenCycling) {
                    if (i < 0)
                        cx += this.cellsAcross;
                    else if (i > this.cellsAcross - 1)
                        cx -= this.cellsAcross;
                    if (j < 0)
                        cy += this.cellsDown;
                    else if (j > this.cellsDown - 1)
                        cy -= this.cellsDown;
                }
                else {
                    if (i < 0 || i > this.cellsAcross - 1)
                        continue;
                    if (j < 0 || j > this.cellsDown - 1)
                        continue;
                }
                var cell = this.getCell(cx, cy);
                if (!_.isUndefined(cell)) {
                    switch (strategy) {
                        // Default: cell x and y values are within range (results in square neighbourhood)
                        case Distance.CHEBYSHEV_DISTANCE:
                            validCells.push(cell);
                            break;
                        // Radial distance: cell direct line is within range (results in circular neighbourhood)
                        case Distance.MINKOWSKI_DISTANCE:
                            var radius = Math.sqrt(Math.pow(i - x, 2) + Math.pow(j - y, 2));
                            if (radius <= distance)
                                validCells.push(cell);
                            break;
                        // Summed distance: sum of cell values are within range (results in diamond neighbourhood)
                        case Distance.TAXICAB_DISTANCE:
                            var sum = Math.abs(i - x) + Math.abs(j - y);
                            if (sum <= distance)
                                validCells.push(cell);
                            break;
                    }
                }
            }
        }
        return validCells;
    };


    this.getAgentsAtDistance = function(x, y, distance, strategy, includeSelf) {
        var cells = this.getCellsAtDistance(x, y, distance, strategy, includeSelf);
        // Map, compact and flatten the agent collection
        return _.compact(
            _.flatten(
                _.map(cells, function(cell) { return cell.agents; })
            )
        );
    };

    this.getResourcesAtDistance = function(x, y, distance, strategy, includeSelf) {
        var cells = this.getCellsAtDistance(x, y, distance, strategy, includeSelf);
        // Map, compact and flatten the agent collection
        return _.compact(
            _.flatten(
                _.map(cells, function(cell) { return cell.resources; })
            )
        );
    };

    this.getNeighbouringCells = function(x, y) {
        return this.getCellsAtDistance(x, y, 1, Distance.CHEBYSHEV_DISTANCE, true);
    };

    this.getNeighbouringResources = function(x, y) {
        return this.getResourcesAtDistance(x, y, 1, Distance.CHEBYSHEV_DISTANCE, true);
    };

    this.getNeighbouringAgents = function(x, y) {
        return this.getAgentsAtDistance(x, y, 1, Distance.CHEBYSHEV_DISTANCE, true);
    };



    this.randomiseAgentCollection = function() {
        return _.shuffle(this.currentAgents);
    };

    this.randomiseCellCollection = function() {
        return _.shuffle(this.cells);
    };




    // Sets the id, if passed in; otherwise default to 1001
    this.id = 1;
    this.name = undefined;

    // Dimensions
    this.cellsAcross = 10, this.cellsDown = 10;
    this.cells = [];

	// Game parameters
    this.isPresetWorld = false, this.isTerminalWorld = false, this.customWorld = false;
    this.entryPoints = [], this.exitPoints = [];

    // Agent parameters
    this.initialAgentNumber = 1, this.waveNumber = 1, this.expiryLimit = 1, this.waves = [];

	// Resource parameters
    this.initialResourceStore = 100, this.currentResourceStore = 100, this.initialResourceNumber = 0, this.currentResourceSpent = 0;

	// Cell options
    this.allowOffscreenCycling = false, this.resourcesOwnTilesExclusively = false, this.allowResourcesOnPath = false;
    // Rendering options
    this.isometricView = false;
    // Agent options
    this.noWander = false, this.noSpeedChange = false, this.noSpeedChangeOnResources = false;
    // Generation options
    this.randomiseAgents = false;
    this.placeAgentsOnAllCells = false;
    this.randomiseResources = false;
    this.generateWaveAgentsAutomatically = true;
    this.incrementAgentsEachWave = true;
    this.generateWaveAgentsAutomatically = true;
    this.distributeAgentsNormally = false;
    this.distributeAgentsSigma = 0;
    this.distributeAgentsHealthNormally = false;
    this.distributeAgentsHealthSigma = 0;


    // Agent variables
    this.cultures = undefined;
    this.currentAgents = [], this.currentAgentsMap = {}, this.currentAgentsFunction = function(agent) {return agent};
    this.expiredAgents = [], this.savedAgents = [];

    // Resource variables
    this.worldResources = [], this.resources = [], this.resourceCategoryCounts = [];

    // User interface elements
    this.tip = null, this.catastrophe = null;
    this.introduction = "Welcome to world " + this.id + ".";
    this.information = '';
    this.conclusion = "Congratulations! You have completed world " + this.id + ".";

    // Google map, image and sound options
    this.backgroundTerrain = null, this.mapOptions = null, this.mapURL = null, this.noMap = false;
    this.thumbnail = undefined, this.image = null, this.imageAttribution = null, this.soundSrc = null;
}


if (typeof exports !== "undefined")
    exports.World = World;
