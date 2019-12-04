var basemap = new L.TileLayer(baseUrl, { maxZoom: 20, attribution: baseAttribution, subdomains: subdomains, opacity: opacity });
var center = new L.LatLng(38.7849, -76.8721);
var map = new L.Map('map', { center: center, zoom: 2, maxZoom: maxZoom, layers: [basemap] }).setView(center, 10);;


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

searchCtrl.indexFeatures(mapsgeoJson, ['Program Affiliation', 'Title']);
function whenClicked(e) {
    var item = e.sourceTarget.feature.properties
    var itemT = item.Title;
    var itemD = item.Description;
    var location = [item.lat, item.lng];
    var list = '<li>' + itemT + '<br>' + itemD + '</li>';
    console.log(list);
    var elements = document.getElementsByClassName('sidenav');
    Array.prototype.forEach.call(elements, function (element) {
        element.innerHTML = list;
    });
    map.setView(location);
}


var palsPoints = L.geoJson(palsgeoJson, {
    firstLineTitles: true,
    onEachFeature: function (feature, layer) {
        var popup = '<div class="popup-content"><table class="table table-striped table-bordered table-condensed">';
        popup += '<tr><th>' + feature.properties.Title + '</th><td>' + '</td></tr>';
        popup += "</table></popup-content>";
        layer.bindPopup(popup, popupOpts);
        var p = layer.feature.properties;
        p.index = p.Title;
        layer.on({
            click: whenClicked
        });
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
        popup += '<tr><th>' + feature.properties.Title + feature.properties.description + '</th><td>' + '</td></tr>';
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

var parent = new L.MarkerClusterGroup(clusterOptions);
map.addLayer(parent);
var overlay = {}

var mapsSub = L.featureGroup.subGroup(
    parent, [mapsPoints]
);
var palsSub = L.featureGroup.subGroup(
    parent, [palsPoints]
);
map.addLayer(mapsSub);
map.addLayer(palsSub);
overlay["MAPP"] = mapsSub;
overlay["PALS"] = palsSub;
control = L.control.layers(null, overlay, { collapsed: true });
control.addTo(map);


