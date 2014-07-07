/*!
 * Fierce Planet - Google Map utilities
 * Various utility methods
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */


var FiercePlanet = FiercePlanet || {};


/**
 * @namespace Contains isometric utility functions
 */
FiercePlanet.GoogleMapUtils = FiercePlanet.GoogleMapUtils || {};

/**
 * @namespace Contains google map utility functions
 */
//var GoogleMapUtils = GoogleMapUtils || {};

// Rotate
// http://code.google.com/apis/maps/documentation/javascript/examples/aerial-rotation.html

(function() {

    var initialised = false;
    var mapTypes = {};

    var map;
    var mapTypeIds = [];

    var mapControlOptions = {};

    // Setup a copyright/credit line, emulating the standard Google style
    var creditNode = document.createElement('div');
    creditNode.id = 'credit-control';
    creditNode.style.fontSize = '11px';
    creditNode.style.fontFamily = 'Arial, sans-serif';
    creditNode.style.margin = '0 2px 2px 0';
    creditNode.style.whitespace = 'nowrap';
    creditNode.index = 0;

    this.loadScript = function() {
        if (!initialised) {
            var script = document.createElement("script");
            script.type = "text/javascript";
            var mapURL = 'http://maps.googleapis.com/maps/api/js?sensor=true&callback=FiercePlanet.GoogleMapUtils.initMaps';
//            if (callback)
//                mapURL += "&callback=" + callback;
            script.src = mapURL;
            document.body.appendChild(script);
        }
    }


    this.initMaps = function() {
        // set up the map types

        // Externally sourced - relatively low res
        /*
         mapTypes['nighttime'] = {
         getTileUrl: function(coord, zoom) {
         return getHorizontallyRepeatingTileUrl(coord, zoom, function(coord, zoom) {
         var bound = Math.pow(2, zoom);
         return "http://www.cc.gatech.edu/~pesti/night/t-n/" +
         + zoom + "/" + coord.x + "-" + coord.y + '.jpeg';
         });
         },
         tileSize: new google.maps.Size(256, 256),
         isPng: false,
         maxZoom: 6,
         minZoom: 0,
         radius: 1738000,
         name: 'Earth at Night',
         credit: 'Image Credit: NASA/USGS'
         };

         // set up the map types
         mapTypes['europa'] = {
         getTileUrl: function(coord, zoom) {
         return getHorizontallyRepeatingTileUrl(coord, zoom, function(coord, zoom) {
         var bound = Math.pow(2, zoom);
         return "http://www.cc.gatech.edu/~pesti/europa/t-e2/" +
         + zoom + "/" + coord.x + "-" + coord.y + '.jpeg';
         });
         },
         tileSize: new google.maps.Size(256, 256),
         isPng: false,
         maxZoom: 6,
         minZoom: 0,
         radius: 1738000,
         name: 'Europa - the Icy Moon of Jupiter',
         credit: 'Image Credit: NASA/USGS'
         };
         */

        if (typeof(google) !== 'undefined' && typeof(google.maps) !== 'undefined') {
            // set up the map types
            mapTypes['moon'] = {
                getTileUrl: function(coord, zoom) {
                    return getHorizontallyRepeatingTileUrl(coord, zoom, function(coord, zoom) {
                        var bound = Math.pow(2, zoom);
                        return "http://mw1.google.com/mw-planetary/lunar/lunarmaps_v1/clem_bw/" +
                            + zoom + "/" + coord.x + "/" + (bound - coord.y - 1) + '.jpg';
                    });
                },
                tileSize: new google.maps.Size(256, 256),
                isPng: false,
                maxZoom: 9,
                minZoom: 0,
                radius: 1738000,
                name: 'Moon',
                credit: 'Image Credit: NASA/USGS'
            };

            mapTypes['sky'] = {
                getTileUrl: function(coord, zoom) {
                    return getHorizontallyRepeatingTileUrl(coord, zoom, function(coord, zoom) {
                        return "http://mw1.google.com/mw-planetary/sky/skytiles_v1/" +
                            coord.x + "_" + coord.y + '_' + zoom + '.jpg';

                    });
                },
                tileSize: new google.maps.Size(256, 256),
                isPng: false,
                maxZoom: 13,
                radius: 57.2957763671875,
                name: 'Sky',
                credit: 'Image Credit: SDSS, DSS Consortium, NASA/ESA/STScI'
            };

            mapTypes['mars_elevation'] = {
                getTileUrl: function(coord, zoom) {
                    return getHorizontallyRepeatingTileUrl(coord, zoom, function(coord, zoom) {
                        return getMarsTileUrl("http://mw1.google.com/mw-planetary/mars/elevation/", coord, zoom);
                    });
                },
                tileSize: new google.maps.Size(256, 256),
                isPng: false,
                maxZoom: 8,
                radius: 3396200,
                name: 'Mars Elevation',
                credit: 'Image Credit: NASA/JPL/GSFC'
            };

            mapTypes['mars_visible'] = {
                getTileUrl: function(coord, zoom) {
                    return getHorizontallyRepeatingTileUrl(coord, zoom, function(coord, zoom) {
                        return getMarsTileUrl("http://mw1.google.com/mw-planetary/mars/visible/", coord, zoom);
                    });
                },
                tileSize: new google.maps.Size(256, 256),
                isPng: false,
                maxZoom: 9,
                radius: 3396200,
                name: 'Mars Visible',
                credit: 'Image Credit: NASA/JPL/ASU/MSSS'
            };

            mapTypes['mars_infrared'] = {
                getTileUrl: function(coord, zoom) {
                    return getHorizontallyRepeatingTileUrl(coord, zoom, function(coord, zoom) {
                        return getMarsTileUrl("http://mw1.google.com/mw-planetary/mars/infrared/", coord, zoom);
                    });
                },
                tileSize: new google.maps.Size(256, 256),
                isPng: false,
                maxZoom: 9,
                radius: 3396200,
                name: 'Mars Infrared',
                credit: 'Image Credit: NASA/JPL/ASU'
            };
        }

        initialised = true;
    }


    // Normalizes the tile URL so that tiles repeat across the x axis (horizontally) like the
    // standard Google map tiles.
    function getHorizontallyRepeatingTileUrl(coord, zoom, urlfunc) {
      var y = coord.y;
      var x = coord.x;

      // tile range in one direction range is dependent on zoom level
      // 0 = 1 tile, 1 = 2 tiles, 2 = 4 tiles, 3 = 8 tiles, etc
      var tileRange = 1 << zoom;

      // don't repeat across y-axis (vertically)
      if (y < 0 || y >= tileRange) {
        return null;
      }

      // repeat across x-axis
      if (x < 0 || x >= tileRange) {
        x = (x % tileRange + tileRange) % tileRange;
      }

      return urlfunc({x:x,y:y}, zoom)
    }

    function getMarsTileUrl(baseUrl, coord, zoom) {
      var bound = Math.pow(2, zoom);
      var x = coord.x;
      var y = coord.y;
      var quads = ['t'];

      for (var z = 0; z < zoom; z++) {
        bound = bound / 2;
        if (y < bound) {
          if (x < bound) {
            quads.push('q');
          } else {
            quads.push('r');
            x -= bound;
          }
        } else {
          if (x < bound) {
            quads.push('t');
            y -= bound;
          } else {
            quads.push('s');
            x -= bound;
            y -= bound;
          }
        }
      }

      return baseUrl + quads.join('') + ".jpg";
    }


    function setCredit(credit) {
      creditNode.innerHTML = credit + ' -';
    }

    this.initializePlanetaryTypes = function() {
        var key;
      // push all mapType keys in to a mapTypeId array to set in the mapTypeControlOptions
      for (key in mapTypes) {
        mapTypeIds.push(key);
      }

      mapControlOptions = {
          mapTypeIds: mapTypeIds,
          style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
        };
      var mapOptions = {
        zoom: 0,
        center: new google.maps.LatLng(0, 0),
        mapTypeControlOptions: {
          mapTypeIds: mapTypeIds,
          style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
        }
      };
      map = new google.maps.Map(document.getElementById("actual_map"), mapOptions);

      // push the credit/copyright custom control
      map.controls[google.maps.ControlPosition.BOTTOM_RIGHT].push(creditNode);

      // add the new map types to map.mapTypes
      for (key in mapTypes) {
        map.mapTypes.set(key, new google.maps.ImageMapType(mapTypes[key]));
      }

      // handle maptypeid_changed event to set the credit line
      google.maps.event.addListener(map, 'maptypeid_changed', function() {
        setCredit(mapTypes[map.getMapTypeId()].credit);
      });

      // start with the moon map type
//      map.setMapTypeId('sky');
//        map.setZoom(8);
//        FiercePlanet.googleMap = map;
    }


    /**
     * Simple method for coercing a value to a floored integer
     * @param value
     */
    this.serializeCurrentMap = function() {
        var mapOptions = this.defaultOptions();
        if (FiercePlanet.Game.googleMap) {
            mapOptions.center = FiercePlanet.Game.googleMap.getCenter();
            mapOptions.mapTypeId = FiercePlanet.Game.googleMap.getMapTypeId();
            mapOptions.tilt = FiercePlanet.Game.googleMap.getTilt();
            mapOptions.zoom = FiercePlanet.Game.googleMap.getZoom();
        }
        return mapOptions;
    };

    
    /**
     * Simple method for coercing a value to a floored integer
     * @param value
     */
    this.createMap = function(options, altCanvasName) {
        if (typeof(google) == 'undefined' || typeof(google.maps) == 'undefined')
            return;
        var canvasName = altCanvasName || '#actual_map';

        // If the map needs rotation, rotate the underlying div
        if (options && !_.isUndefined(options.rotate)) {
            $('#actual_map').css({'-webkit-transform': 'rotate(' + options.rotate + 'deg)'});
            //'-webkit-transform': 'rotate(' + this.mapRotationAngle + 'deg)',
        }

        // If this is not a LatLng object, make one
        if (options && !options.center.lat)
            options.center = new google.maps.LatLng(options.center[0], options.center[1]);
//        map = new google.maps.Map($(canvasName)[0], this.defaultOptions());
        try {
//            map = new google.maps.Map($(canvasName)[0], options);
            map = new google.maps.Map(document.getElementById('map_canvas'), options);

            var trafficLayer = new google.maps.TrafficLayer();
            trafficLayer.setMap(map);

//            var weatherLayer = new google.maps.weather.WeatherLayer({
//                temperatureUnits: google.maps.weather.TemperatureUnit.FAHRENHEIT
//            });
//            weatherLayer.setMap(map);

//            var cloudLayer = new google.maps.weather.CloudLayer();
//            cloudLayer.setMap(map);
//
//            // push the credit/copyright custom control
//            map.controls[google.maps.ControlPosition.BOTTOM_RIGHT].push(creditNode);
//
//            // add the new map types to map.mapTypes
//            for (var key in mapTypes) {
//                map.mapTypes.set(key, new google.maps.ImageMapType(mapTypes[key]));
//            }
//
//            // handle maptypeid_changed event to set the credit line
//            google.maps.event.addListener(map, 'maptypeid_changed', function() {
//                if (!_.isUndefined(map.getMapTypeId()))
//                    setCredit(mapTypes[map.getMapTypeId()].credit);
//            });
            return map;
        }
        catch (e) {
            console.log(e)
        }

    };


    /**
     * Generates a set of default (and non-interactive) Google Map options
     */
    this.defaultOptions = function() {
        // If we can't reach the Google Maps API, return an empty object
        if (typeof(google) == 'undefined' || typeof(google.maps) == 'undefined')
            return mapOptions;

      // push all mapType keys in to a mapTypeId array to set in the mapTypeControlOptions
        mapTypeIds = [
            google.maps.MapTypeId.ROADMAP,
            google.maps.MapTypeId.SATELLITE,
            google.maps.MapTypeId.HYBRID,
            google.maps.MapTypeId.TERRAIN
        ];

      for (var key in mapTypes) {
        mapTypeIds.push(key);
      }
        mapControlOptions = {
            mapTypeIds: mapTypeIds,
            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
          };

        var mapOptions = {

            backgroundColor: '#ffffff',

            /* Required */
            center: new google.maps.LatLng(69.13811902334064, -32.86834716796875),
//        center: new google.maps.LatLng(47.5153, 19.0782),

            disableDefaultUI: false,

            disableDoubleClickZoom: false,

            draggable: true,

//        draggableCursor: "",
//
//        draggingCursor: "",

            heading: 0,

            keyboardShortcuts: true,

            mapTypeControl: false,

            mapTypeControlOptions: mapControlOptions,

            /* Required */
//            mapTypeId: google.maps.MapTypeId.SATELLITE,
            mapTypeId: 'sky',

            maxZoom: null,

            minZoom: null,

            noClear: false,

            overviewMapControl: true,

//        overviewMapControlOptions: {},

            panControl: false,

//        panControlOptions: {},

            rotateControl: false,

//        rotateControlOptions: {},

            scaleControl: false,

//        scaleControlOptions: {},

            scrollwheel: false,

//        streetView: null,

            streetViewControl: false,

//        streetViewControlOptions: {},

            tilt: 0,

            /* Required */
            zoom: 7,

            zoomControl: false

//        , zoomControlOptions: new google.maps.ZoomControlOptions(google.maps.Position.TOP_LEFT, google.maps.ZoomControlStyle.DEFAULT)
        };

        return mapOptions;
    };



    /**
     * Generates a set of interactive Google Map options
     */
    this.interactiveOptions = function() {
		var mapOptions = this.defaultOptions();
		mapOptions['disableDefaultUI'] = false;
		return mapOptions;
	};


	/**
	 * Uses geolocation to determine current location
	 */
    this.currentLocation = function() {
        var initialLocation;
        var siberia = new google.maps.LatLng(60, 105);
        var newyork = new google.maps.LatLng(40.69847032728747, -73.9514422416687);
        var browserSupportFlag =  new Boolean();


          if(navigator.geolocation) {
            browserSupportFlag = true;
            navigator.geolocation.getCurrentPosition(function(position) {
              initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
            }, function() {
              handleNoGeolocation(browserSupportFlag);
            });
          // Try Google Gears Geolocation
          } else if (google.gears) {
            browserSupportFlag = true;
            var geo = google.gears.factory.create('beta.geolocation');
            geo.getCurrentPosition(function(position) {
              initialLocation = new google.maps.LatLng(position.latitude, position.longitude);
            }, function() {
              this.handleNoGeoLocation(browserSupportFlag);
            });
          // Browser doesn't support Geolocation
          } else {
            browserSupportFlag = false;
            this.handleNoGeolocation(browserSupportFlag);
          }

        function handleNoGeolocation(errorFlag) {
            if (errorFlag == true) {
              alert("Geolocation service failed.");
              initialLocation = newyork;
            } else {
              alert("Your browser doesn't support geolocation. We've placed you in Siberia.");
              initialLocation = siberia;
            }
          }
        return initialLocation;
    };



    /**
     * Simple method for coercing a value to a floored integer
     * @param value
     */
    this.getMapLocationInfo = function(callback) {
        if (typeof(google) == 'undefined' || typeof(google.maps) == 'undefined')
            return;

        var locationInfo = '';

        if (!_.isUndefined(FiercePlanet.Game.googleMap)) {
            var latlng = FiercePlanet.Game.googleMap.center;
            var geoencoder = new google.maps.Geocoder();
            geoencoder.geocode({'latLng': latlng}, callback);
        }

        return locationInfo;
    };

}).apply(FiercePlanet.GoogleMapUtils);





