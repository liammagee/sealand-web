
var map, ctaLayer, encodings, markers = [], weightedPoints = [], heatmap;
var rows, stateFrequencies, stateAmounts;

// Load the Google map
initializeMap = function() {
    var mapOptions = {
        zoom: 4,
//        center: new google.maps.LatLng(-34.5976, -58.383),
        center: new google.maps.LatLng(-28.307475, 133.302272),
        mapTypeId: google.maps.MapTypeId.SATELLITE
    };
    map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);

}


clearOverlays = function() {
    hideOverlays()
    markers = [];

    hideHeatmap()
    weightedPoints = [];
}

hideOverlays = function() {
    markers.forEach(function(marker) {
        marker.setMap(null);
    })
}
showOverlays = function() {
    markers.forEach(function(marker) {
        marker.setMap(map);
    })
}

hideHeatmap = function() {
    if (heatmap)
        heatmap.setMap(null);
}
showHeatmap = function() {
    var pointArray = new google.maps.MVCArray(weightedPoints);
    
    heatmap = new google.maps.visualization.HeatmapLayer({
        data: pointArray
        , dissipating: false
        , opacity: 0.5
        , radius: 5
    });
    heatmap.setMap(map);
}


hookUpListeners = function() {
    $('#showMarkers').click(function() {
        if ($(this).is(':checked')) {
            showOverlays()
        }
        else {
            hideOverlays()
        }
    })

    $('#showHeatmap').click(function() {
        if ($(this).is(':checked')) {
            showHeatmap()
        }
        else {
            hideHeatmap()
        }
    })

    $('#query').click(function() {
        clearOverlays();


        // Determine the right set of results to show
        var showResultsBy = parseInt($('#showResults option:selected').val());
        var values = {};
        switch (showResultsBy) {
            case 0:
                values = stateFrequencies;
                break;
            case 1:
                values = stateAmounts;
                break;
        }

        // Determine kind of calculation to apply to each value
        var calculateResultsBy = parseInt($('#calculateResults option:selected').val());

        // Add weighted points for the set of values
        _.each(values, function(value, state) {
            var coords = ausStateGPS(state);
            if (coords != null) {
                var myLatlng = new google.maps.LatLng(coords["lat"], coords["lng"]);
                var title = state + ': ' + value + ' records found.';
                var marker = new google.maps.Marker({
                    position: myLatlng,
                    map: map,
                    title: state + ': ' + value + ' records found.'
                });
                markers.push(marker);

                var weightedValue = value;
                switch (calculateResultsBy) {
                    // As is: just N
                    case 0:
                        weightedValue = value;
                        break;
                    // 2 exp N
                    case 1:
                        weightedValue = Math.pow(2, value);
                        break;
                    // log(N)
                    case 2:
                        weightedValue = Math.log(value);
                        break;
                }
                var weightedLocation = {
                    location: myLatlng,
                    weight: weightedValue //Math.pow(2,weighting)
                };
                weightedPoints.push(weightedLocation)
            }
        });

        if ($('#showMarkers').is(':checked'))
            showOverlays()
        else
            hideOverlays()
        if ($('#showHeatmap').is(':checked'))
            showHeatmap();
        else
            hideHeatmap();

    })
}


/**
 * Taken from http://www.gps-coordinates.net/
 */
ausStateGPS = function(state) {
    latLng = null;
    if (state == "Australian Capital Territory") {
        latLng = { "lat": -35.473468, "lng": 149.012368 };
    }
    else if (state == "New South Wales") {
        latLng = { "lat": -31.2532183, "lng": 146.92109900000003 };
    }
    else if (state == "Northern Territory") {
        latLng = { "lat": -19.4914108, "lng": 132.55096030000004 };
    }
    else if (state == "Queensland") {
        latLng = { "lat": -20.9175738, "lng": 142.70279559999994 };
    }
    else if (state == "South Australia") {
        latLng = { "lat": -30.0002315, "lng": 136.2091547 };
    }
    else if (state == "Tasmania") {
        latLng = { "lat": -41.3650419, "lng": 146.6284905 };
    }
    else if (state == "Victoria") {
        latLng = { "lat": -37.4713077, "lng": 144.7851531 };
    }
    else if (state == "Western Australia") {
        latLng = { "lat": -27.6728168, "lng": 121.62830980000001 };
    }
    return latLng;
}

parseCSV = function() {
    $.get('/data/sealand-simple.csv', function(csv) {
        var results = $.parse(csv);
        rows = results.results.rows;
        stateFrequencies = {};
        stateAmounts = {};
        _.each(rows, function(row) {
            var state1 = row['State 1'];
            var state2 = row['State 2-?'];
            var insuredCost = parseInt(row['Insured Cost']);
            if (isNaN(insuredCost))
                insuredCost = 0;
            if (stateFrequencies[state1]) {
                stateFrequencies[state1] += 1;
                stateAmounts[state1] += insuredCost;
            }
            else {
                stateFrequencies[state1] = 1;   
                stateAmounts[state1] = insuredCost;
            }
            if (stateFrequencies[state2]) {
                stateFrequencies[state2] += 1;
                stateAmounts[state2] += insuredCost;
            }
            else {
                stateFrequencies[state2] = 1;   
                stateAmounts[state2] = insuredCost;
            }
        });
    });
}

$(document).ready(function() {
    initializeMap();

    hookUpListeners();

    parseCSV();
});
