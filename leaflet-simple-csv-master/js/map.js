/*Creating a map centered in Maryland */

var basemap = new L.TileLayer(baseUrl, { maxZoom: 20, attribution: baseAttribution, subdomains: subdomains, opacity: opacity });
var center = new L.LatLng(38.7849, -76.8721);
var map = new L.Map('map', { center: center, zoom: 2, maxZoom: maxZoom, layers: [basemap] }).setView(center, 10);;

/*Adding search control */
var searchCtrl = L.control.fuseSearch()
searchCtrl.addTo(map);


/*Retriving data from MAPP and PALS */
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

/* Changing JSON to geoJson*/
var mapsgeoJson = { type: 'FeatureCollection', features: mapsFeatures };
var palsgeoJson = { type: 'FeatureCollection', features: palsFeatures };

/*Choosing set to search and which fields to search */
searchCtrl.indexFeatures(mapsgeoJson, ['Program Affiliation', 'Title']);
function whenClicked(e) {
    var item = e.sourceTarget.feature.properties
    var itemT = item.Title;
    var itemD = item.Description;
    var location = [item.lat, item.lng];

    var list = '<div class="image">Image</div><div class="text"><div style="background-color:red">'+itemT+'</div>';
    list+='<div>'+itemD+'</div></div>'
   
    var elements = document.getElementsByClassName('list-wrapper');
    Array.prototype.forEach.call(elements, function (element) {
        element.innerHTML = list;
    });
    map.setView(location);
}

/*Creating map points */
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
        popup += '<tr><th>' + feature.properties.Title + '</th><td>' + '</td></tr>';
        popup += "</table></popup-content>";
        layer.bindPopup(popup, popupOpts);
        layer.on({
            click: whenClicked
        });
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

/*Creating clustering for markers and adding to map*/
var parent = new L.MarkerClusterGroup(clusterOptions);
map.addLayer(parent);

/* Creating an overlay for filtering*/
var overlay = {}

/* Creating sub-grouping for points and cluster. In this case, the points are subgroups of the parent cluster*/
var mapsSub = L.featureGroup.subGroup(
    parent, [mapsPoints]
);
var palsSub = L.featureGroup.subGroup(
    parent, [palsPoints]
);

/* Adding subgroups to map*/
map.addLayer(mapsSub);
map.addLayer(palsSub);

/*Overlay control now controls which subgroups to display on the map */
overlay["MAPP"] = mapsSub;
overlay["PALS"] = palsSub;
control = L.control.layers(null, overlay, { collapsed: true });
control.addTo(map);


