/*
 * Fierce Planet - Chat utilities
 * Various utility methods
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */


var FiercePlanet = FiercePlanet || {};

FiercePlanet.Console = FiercePlanet.Console || {};

(function () {

    /**
     * Minimises the console
     */
    this.minimise = function () {
        $('.jqconsole').height(20);
        $('#notifications').height(40);
    };

    /**
     * Maximises the console
     */
    this.maximise = function () {
        $('.jqconsole').height(180);
        $('#notifications').height(200);
    };

    this.registerEvents = function () {
        /*
         $('textarea').blur(function() {
         FiercePlanet.Console.minimise();
         });
         $('textarea').focus(function() {
         FiercePlanet.Console.maximise();
         });
         */
    }
}).apply(FiercePlanet.Console);
