var basemap = new L.TileLayer(baseUrl, { maxZoom: 20, attribution: baseAttribution, subdomains: subdomains, opacity: opacity });
var center = new L.LatLng(38.7849, -76.8721);
var map = new L.Map('map', { center: center, zoom: 2, maxZoom: maxZoom, layers: [basemap]}).setView(center, 10);;


var searchCtrl = L.control.fuseSearch()
searchCtrl.addTo(map);

var maps = (function () {
    var maps = null;
    $.ajax({
        'async': false,
        'global': false,
        'url': "data/mapp.json",
        'dataType': "json",
        'success': function (data) {
            maps = data;
        }
    });
    return maps;
})();

var pals = (function () {
    var pals = null;
    $.ajax({
        'async': false,
        'global': false,
        'url': "data/pals.json",
        'dataType': "json",
        'success': function (data) {
            pals = data;
        }
    });
    return pals;
})();

var palsFeatures = [];
var mapsFeatures = []

pals.forEach(function (point) {
    var lat = point.lat;
    var lon = point.lng;

    var feature = {
        type: 'Feature',
        properties: point,
        geometry: {
            type: 'Point',
            coordinates: [lon, lat]
        }
    };

    palsFeatures.push(feature);
});

maps.forEach(function (point) {
    var lat = point.lat;
    var lon = point.lng;

    var feature = {
        type: 'Feature',
        properties: point,
        geometry: {
            type: 'Point',
            coordinates: [lon, lat]
        }
    };

    mapsFeatures.push(feature);
});
var popupOpts = {
    autoPanPadding: new L.Point(5, 50),
    autoPan: true
};


var mapsgeoJson = { type: 'FeatureCollection', features: mapsFeatures };
var palsgeoJson = { type: 'FeatureCollection', features: palsFeatures };
searchCtrl.indexFeatures(mapsgeoJson, ['Program Affiliation','Title','Description','Links (DRUM or Website)','Year','Advisor','Students']);
var palsPoints = L.geoJson(palsgeoJson, {
    firstLineTitles: true,
    onEachFeature: function (feature, layer) {
        var popup = '<div class="popup-content"><table class="table table-striped table-bordered table-condensed">';

        var title = "PALS";
        popup += '<tr><th>' + feature.properties.Title + '</th><td>' + '</td></tr>';
        
        popup += "</table></popup-content>";
        layer.bindPopup(popup, popupOpts);
        var p = layer.feature.properties;
        p.index = p.Title + " | " + p.type + " | ";	
    },
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {
            icon: L.icon({// modify icon
                iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                /*shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',*/
                iconSize: [20, 20]
            })
        });
    }
});

var mapsPoints = L.geoJson(mapsgeoJson, {
    onEachFeature: function (feature, layer) {
        feature.layer = layer;
        var popup = '<div class="popup-content"><table class="table table-striped table-bordered table-condensed">';
        var title = "PALS";
       
        popup += '<tr><th>' + title + '</th><td>' + '</td></tr>';
        popup += "</table></popup-content>";
        layer.bindPopup(popup, popupOpts);
    },
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {
            icon: L.icon({// modify icon
                iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
                /*shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',*/
                iconSize: [20, 20]
            })
        });
    }
});

var parent= new L.MarkerClusterGroup(clusterOptions);
map.addLayer(parent);
var overlay={}

var mapsSub=L.featureGroup.subGroup(
    parent,[mapsPoints]
  );
  var palsSub=L.featureGroup.subGroup(
    parent,[palsPoints]
  );

map.addLayer(mapsSub);
map.addLayer(palsSub);
overlay["MAPP"]=mapsSub;
overlay["PALS"]=palsSub;
control = L.control.layers(null, overlay, {collapsed: true });
control.addTo(map);


/*
var searchGroup= L.layerGroup([mapsPoints,palsPoints]);

var searchControl = new L.Control.Search({
    layer: searchGroup,
    propertyName: 'Title',
    position:'topleft',
    marker: false,
    moveToLocation: function(latlng, title, map) {
        var zoom=[latlng.lat,latlng.lng];
        console.log(latlng)
        map.setView(zoom); // access the zoom
    },
    zoom:20

});

searchControl.on('search:locationfound', function(e) {
    
    e.layer.setStyle({fillColor: '#3f0', color: '#0f0'});
    if(e.layer._popup)
        e.layer.openPopup();

}).on('search:collapsed', function(e) {

    palsPoints.eachLayer(function(layer) {	//restore feature color
        palsPoints.resetStyle(layer);
    });	
});

map.addControl(searchControl);
*/