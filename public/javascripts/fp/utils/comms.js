/*
 * Fierce Planet - Chat utilities
 * Various utility methods
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */



var FiercePlanet = FiercePlanet || {};

/**
 * @namespace Contains communication functions
 */
FiercePlanet.Comms = FiercePlanet.Comms || {};

(function(){
    this.duelingAgents = [];

    this.receiveServerEvent = function(nickname, eventType, obj){
        if (eventType == 'world') {
            if (Universe.settings.spectate) {
                Lifecycle.currentWorldNumber = worldNumber;
                Lifecycle.currentWorldPreset = true;
                Lifecycle.newWorld();
//                Lifecycle.startWorld();
            }
            // TODO: Fix - causes problems with main Google screen
//            FiercePlanet.Drawing.drawMirrorGame();
        }
        else if (eventType == 'start') {
            if (Universe.settings.spectate) {
                FiercePlanet.Dialogs.newWorldDialog.dialog('close');
//                Lifecycle.startWorld();
            }
        }
        else if (eventType == 'play') {
            if (Universe.settings.spectate) {
//                Lifecycle.pauseGame();
            }
        }
        else if (eventType == 'pause') {
            if (Universe.settings.spectate) {
                Lifecycle.pauseGame();
            }
        }
        else if (eventType == 'resources') {
//            if (Universe.settings.spectate) {
                var resources = obj;
                for (var i = 0, l = resources.length; i < l; i++) {
                    FiercePlanet.Utils.makeFromJSONObject(resources[i], Resource.prototype);
                }
//                Lifecycle.currentWorld.addResource(resource);
                FiercePlanet.Drawing.drawResources('#alt_resourceCanvas', resources);
//            }
        }
        else if (eventType == 'agents') {
            var agents = obj;
            // Co-op mode
//                Lifecycle.currentWorld.setCurrentAgents(agents);
//                FiercePlanet.Drawing.clearCanvas('#agentCanvas');
//                FiercePlanet.Drawing.drawAgents();
            // Comp mode
//            FiercePlanet.Drawing.clearCanvas('#alt_agentCanvas');
//            FiercePlanet.Drawing.drawAgents('#alt_agentCanvas', agents);

            // Same screen
            for (var i = 0, l = agents.length; i < l; i++) {
                Lifecycle.currentWorld.currentAgents.push(agents[i]);
            }
            if (Universe.settings.spectate) {
                Lifecycle.processAgents();
                Lifecycle._stopAgents();
            }
        }
        else if (eventType == 'agent') {
            duelingAgents.push(obj);
            // Co-op mode
//                Lifecycle.currentWorld.setCurrentAgents(agents);
//                FiercePlanet.Drawing.clearCanvas('#agentCanvas');
//                FiercePlanet.Drawing.drawAgents();
            FiercePlanet.Drawing.clearCanvas('#alt_agentCanvas');
            FiercePlanet.Drawing.drawAgents('#alt_agentCanvas', duelingAgents);
            if (Universe.settings.spectate) {
                Lifecycle.processAgents();
                Lifecycle._stopAgents();
            }
        }
    }

    this.notifyServerOfEvent = function(eventType, obj){
        socket.emit('lifecycle event', eventType, obj);
    }



    this.esc = function(msg){
      return FiercePlanet.Comms.msg.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    };


    this.message = function(from, msg) {
        try {
            if (jqconsole.zone.chat)
                jqconsole.Write(from + ': ' + msg + '\n');
        }
        catch (e) {}
    }

}).apply(FiercePlanet.Comms);


