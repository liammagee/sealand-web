
var map, ctaLayer, encodings, markers = [], weightedPoints = [], heatmap;

// Load the Google map
initializeMap = function() {
    var mapOptions = {
        zoom: 9,
//        center: new google.maps.LatLng(-34.5976, -58.383),
        center: new google.maps.LatLng(-34.683, -58.585),
        mapTypeId: google.maps.MapTypeId.SATELLITE
    };
    map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);

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
        , radius: 1
    });
    heatmap.setMap(map);
}


clearOverlays = function() {
    hideOverlays()
    markers = [];

    hideHeatmap()
    weightedPoints = [];
}


hookUpListeners = function() {
    $('#showKML').click(function() {
        if ($(this).is(':checked')) {
            ctaLayer = new google.maps.KmlLayer('http://dl.dropbox.com/u/4013043/doc.kml');
            ctaLayer.setMap(map);
        }
        else {
            ctaLayer.setMap(null);
        }
    })

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
        var records = RecordsManager.records;

        RecordsManager.selectRecords = filterRecords(RecordsManager.records);

        var level = parseInt($('#level:checked').val());
        var analysedRecords = RecordsManager.analyseRecords(level);
        for (var key in analysedRecords) {
            if (analysedRecords.hasOwnProperty(key) && encodings.hasOwnProperty(key)) {
                var results = encodings[key].results;
                var weighting = analysedRecords[key];
                if (results && results.length > 0) {
                    var lat = results[0].geometry.location.lat,
                        lng = results[0].geometry.location.lng;

                    // Create Google marker here
                    var myLatlng = new google.maps.LatLng(lat,lng);
                    var marker = new google.maps.Marker({
                        position: myLatlng,
                        map: map,
                        title: key + ': ' + weighting + ' records found.'
                    });
                    markers.push(marker);
                    var weightedLocation = {
                        location: myLatlng,
                        weight: weighting //Math.pow(2,weighting)
                    };
                    weightedPoints.push(weightedLocation)
                }
            }
        }
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

filterRecords = function(records) {
    var p_30_1 = $('#p_30_1').val()
        , p_30_2 = $('#p_30_2').val()
        , p_30_3 = $('#p_30_3').val()
        , p_31_1 = $('#p_31_1').val()
        , p_31_2 = $('#p_31_2').val()
        , p_31_3 = $('#p_31_3').val();

    if (p_30_1 > 0)
        records = _.filter(records, function(row) { return (row.p_30_1 == p_30_1) });
    if (p_30_2 > 0)
        records = _.filter(records, function(row) { return (row.p_30_2 == p_30_2) });
    if (p_30_3 > 0)
        records = _.filter(records, function(row) { return (row.p_30_3 == p_30_3) });
    if (p_31_1 > 0)
        records = _.filter(records, function(row) { return (row.p_31_1 == p_31_1) });
    if (p_31_2 > 0)
        records = _.filter(records, function(row) { return (row.p_31_2 == p_31_2) });
    if (p_31_3 > 0)
        records = _.filter(records, function(row) { return (row.p_31_3 == p_31_3) });

    return records;
}

loadEncodings = function() {
    $.getJSON('/data/encodings.json', function(data) {
        encodings = data;
    });
}

loadRecords = function() {
    $.getJSON('/data/catastro.json', function(data) {
        RecordsManager.initialiseRecords(data);

        var level = parseInt($('#level:checked').val());
        var records = RecordsManager.analyseRecords(level);
    });
}



$(document).ready(function() {
    initializeMap();

    hookUpListeners();

    loadEncodings();

    loadRecords();
});
