var basemap = new L.TileLayer(baseUrl, {maxZoom: 17, attribution: baseAttribution, subdomains: subdomains, opacity: opacity});

var center = new L.LatLng(0, 0);

var map = new L.Map('map', {center: center, zoom: 2, maxZoom: maxZoom, layers: [basemap]});
var searchLayer = L.geoJson().addTo(map);

var popupOpts = {
    autoPanPadding: new L.Point(5, 50),
    autoPan: true
};

var points = L.geoCsv (null, {
    firstLineTitles: true,
    fieldSeparator: fieldSeparator,
    onEachFeature: function (feature, layer) {
        var popup = '<div class="popup-content"><table class="table table-striped table-bordered table-condensed">';
        for (var clave in feature.properties) {
            var title = points.getPropertyTitle(clave).strip();
            var attr = feature.properties[clave];
            if (title == labelColumn) {
                layer.bindLabel(feature.properties[clave], {className: 'map-label'});
            }
            if (attr.indexOf('http') === 0) {
                attr = '<a target="_blank" href="' + attr + '">'+ attr + '</a>';
            }
            if (attr) {
                popup += '<tr><th>'+title+'</th><td>'+ attr +'</td></tr>';
            }
        }
        popup += "</table></popup-content>";
        layer.bindPopup(popup, popupOpts);
    },
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {
            icon:L.icon({// modify icon
            iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
            /*shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',*/
            iconSize: [20,20]
            })
        });
    },
    firstLineTitles: true,
    filter: function(feature, layer) {
        total += 1;
        if (!filterString) {
            hits += 1;
            return true;
        }
        var hit = false;
        var lowerFilterString = filterString.toLowerCase().strip();
        $.each(feature.properties, function(k, v) {
            var value = v.toLowerCase();
            if (value.indexOf(lowerFilterString) !== -1) {
                hit = true;
                hits += 1;
                return false;
            }
        });
        return hit;
    }
});
var pointsMaps = L.geoCsv (null, {
    firstLineTitles: true,
    fieldSeparator: fieldSeparator,
    onEachFeature: function (feature, layer) {
        var popup = '<div class="popup-content"><table class="table table-striped table-bordered table-condensed">';
        for (var clave in feature.properties) {
            var title = pointsMaps.getPropertyTitle(clave).strip();
            var attr = feature.properties[clave];
            if (title == labelColumn) {
                layer.bindLabel(feature.properties[clave], {className: 'map-label'});
            }
            if (attr.indexOf('http') === 0) {
                attr = '<a target="_blank" href="' + attr + '">'+ attr + '</a>';
            }
            if (attr) {
                popup += '<tr><th>'+title+'</th><td>'+ attr +'</td></tr>';
            }
        }
        console.log("HERE!");
        popup += "</table></popup-content>";
        layer.bindPopup(popup, popupOpts);
    },
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {
            icon:L.icon({// modify icon
            iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
            /*shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',*/
            iconSize: [20,20]
            })
        });
    },
    firstLineTitles: true,
    filter: function(feature, layer) {
        total += 1;
        if (!filterString) {
            hits += 1;
            return true;
        }
        var hit = false;
        var lowerFilterString = filterString.toLowerCase().strip();
        $.each(feature.properties, function(k, v) {
            var value = v.toLowerCase();
            if (value.indexOf(lowerFilterString) !== -1) {
                hit = true;
                hits += 1;
                return false;
            }
        });
        return hit;
    }
});

var hits = 0;
var total = 0;
var filterString;
var markers = new L.MarkerClusterGroup();
var dataCsv;
var addCsvMarkers1;
var addCsvMarkers2;
function addCsvMarkersPals() {
    hits = 0;
    total = 0;
    filterString = document.getElementById('filter-string').value;

    if (filterString) {
        $("#clear").fadeIn();
    } else {
        $("#clear").fadeOut();
    }

    /*map.removeLayer(markers);
    points.clearLayers();*/

    markers = new L.MarkerClusterGroup(clusterOptions);
    points.addData(dataCsv);
    markers.addLayer(points);
    map.addLayer(markers);
    window.onload = function() {
    $.get('data/mapp.csv', function(data) {
        var build = '<table>\n';
        var rows = data.split("\n");
        rows.forEach( function getvalues(thisRow) {
        build += "<tr>\n";
        var columns = thisRow.split("|");
        for(var i=0;i<columns.length;i++){ build += "<td>" + columns[i] + "</td>\n"; }   			
        build += "</tr>\n";
        })
        build += "</table>";
        document.getElementById("list").innerHTML=build;
    })};	
    try {
        var bounds = markers.getBounds();
        if (bounds) {
            map.fitBounds(bounds);
        }
    } catch(err) {
        // pass
    }
    if (total > 0) {
        $('#search-results').html("Showing " + hits + " of " + total);
    }
    return false;
};
function addCsvMarkersMapp() {
    hits = 0;
    total = 0;
    filterString = document.getElementById('filter-string').value;

    if (filterString) {
        $("#clear").fadeIn();
    } else {
        $("#clear").fadeOut();
    }

    /*map.removeLayer(markers);
    points.clearLayers();*/

    markers = new L.MarkerClusterGroup(clusterOptions);
    pointsMaps.addData(dataCsv);
    markers.addLayer(pointsMaps);
    map.addLayer(markers);
    window.onload = function() {
    $.get('data/mapp.csv', function(data) {
        var build = '<table>\n';
        var rows = data.split("\n");
        rows.forEach( function getvalues(thisRow) {
        build += "<tr>\n";
        var columns = thisRow.split("|");
        for(var i=0;i<columns.length;i++){ build += "<td>" + columns[i] + "</td>\n"; }   			
        build += "</tr>\n";
        })
        build += "</table>";
        document.getElementById("list").innerHTML=build;
    })};	
    try {
        var bounds = markers.getBounds();
        if (bounds) {
            map.fitBounds(bounds);
        }
    } catch(err) {
        // pass
    }
    if (total > 0) {
        $('#search-results').html("Showing " + hits + " of " + total);
    }
    return false;
};
function addCsvMarkers(){
    addCsvMarkersPals();
    addCsvMarkersMapp();
}
map._layersMinZoom=5;

// add a layer group, yet empty

var typeAheadSource = [];

function ArrayToSet(a) {
    var temp = {};
    for (var i = 0; i < a.length; i++)
        temp[a[i]] = true;
    var r = [];
    for (var k in temp)
        r.push(k);
    return r;
}

function populateTypeAhead(csv, delimiter) {
    var lines = csv.split("\n");
    for (var i = lines.length - 1; i >= 1; i--) {
        var items = lines[i].split(delimiter);
        for (var j = items.length - 1; j >= 0; j--) {
            var item = items[j].strip();
            item = item.replace(/"/g,'');
            if (item.indexOf("http") !== 0 && isNaN(parseFloat(item))) {
                typeAheadSource.push(item);
                var words = item.split(/\W+/);
                for (var k = words.length - 1; k >= 0; k--) {
                    typeAheadSource.push(words[k]);
                }
            }
        }
    }
}

if(typeof(String.prototype.strip) === "undefined") {
    String.prototype.strip = function() {
        return String(this).replace(/^\s+|\s+$/g, '');
    };
}

map.addLayer(markers);

$(document).ready( function() {
    $.ajax ({
        type:'GET',
        dataType:'text',
        url: dataUrl,
        contentType: "text/csv; charset=utf-8",
        error: function() {
            alert('Error retrieving csv file');
        },
        success: function(csv) {
            dataCsv = csv;
            populateTypeAhead(csv, fieldSeparator);
            typeAheadSource = ArrayToSet(typeAheadSource);
            $('#filter-string').typeahead({source: typeAheadSource});
            addCsvMarkers2=addCsvMarkersMapp();
        }
    });

    $("#clear").click(function(evt){
        evt.preventDefault();
        $("#filter-string").val("").focus();
        addCsvMarkers2=addCsvMarkersMapp();
    });

});

$(document).ready( function() {
    $.ajax ({
        type:'GET',
        dataType:'text',
        url: 'data/pals.csv',
        contentType: "text/csv; charset=utf-8",
        error: function() {
            alert('Error retrieving csv file');
        },
        success: function(csv) {
            dataCsv = csv;
            populateTypeAhead(csv, fieldSeparator);
            typeAheadSource = ArrayToSet(typeAheadSource);
            $('#filter-string').typeahead({source: typeAheadSource});
            addCsvMarkers1=addCsvMarkersPals();
        }
    });

    $("#clear").click(function(evt){
        evt.preventDefault();
        $("#filter-string").val("").focus();
        addCsvMarkers1=addCsvMarkersPals();
    });

});

var markersLayer = new L.LayerGroup();  
map.addLayer(markersLayer); 

// add the search bar to the map
  var controlSearch = new L.Control.Search({
    position:'topleft',    // where do you want the search bar?
    layer: markersLayer,  // name of the layer
    initial: false,
    zoom: 11,        // set zoom to found location when searched
    marker: false,
    textPlaceholder: 'search...' // placeholder while nothing is searched
  });

  map.addControl(controlSearch); // add it to the map
