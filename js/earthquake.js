var app = new USGSEarthquakes([38,-122], 10);
window.addEventListener('load', function() {
    app.init(document.getElementById("map"));
    getEarthquake(app);
});

function USGSEarthquakes(center, zoom) {
    this.center = center;
    this.zoom = zoom;
}

USGSEarthquakes.prototype.init = function(container) {
    this.map = L.map(container).setView(this.center, this.zoom);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
};

USGSEarthquakes.prototype.addEarthquake = function(position, title, magnitude) {
    L.marker(position).addTo(this.map).bindPopup(title);
    L.circle(position, magnitude*1000).addTo(this.map);
};

USGSEarthquakes.prototype.reCenter = function(lat, lng) {
    this.map.panTo(new L.LatLng(lat, lng));
};


function getEarthquake(obj) {
    $.getJSON("http://io.milowski.com/usgs/earthquakes/feed/v1.0/summary/all_hour.geojson", function(data){
        var Earthquakes = [];
        console.log(data);
        tableCreate(data.features);
        $.each(data.features, function(i,e) {
            Earthquakes.push([e.properties.title,e.geometry.coordinates]);
            obj.addEarthquake([e.geometry.coordinates[1],e.geometry.coordinates[0]],
                              e.properties.title, e.properties.mag);
        });
        obj.reCenter(Earthquakes[0][1][1], Earthquakes[0][1][0]);
        console.log('updated');
    });
    setTimeout(function() {
        $("#map .leaflet-marker-pane").empty();
        $("#eqTable tr").remove();
        getEarthquake(app);}, 300000); //update data every 5 minutes
}

function tableCreate(data){
    var body = document.getElementById('eqTable'),
        tbl  = document.createElement('table');
    tbl.style.width='100px';
    tbl.style.border = "1px solid black";

    for(var i = 0; i < data.length + 1; i++){
        var tr = tbl.insertRow();
        var th = tbl.createTHead();
        var thr = th.insertRow();
        if(i===0) {
            //Create header row
            for(key in data[i].properties) {
                var thd = thr.insertCell();
                thd.appendChild(document.createTextNode(key));
                thd.style.border = "1px solid black";
            }
        }
        else {for(key in data[i-1].properties) {
                //create a row for each earthquake and value
                var td = tr.insertCell();
                var d;
                if(key == 'time' || key == 'updated') {
                    d = new Date();
                    d.setTime(data[i-1].properties[key]);
                    td.appendChild(document.createTextNode(d));
                }
                else if(key == 'url' || key == 'detail') {

                    d = '<a href=' + data[i-1].properties[key] + ' target="_blank">' + key + '</a>';
                    td.innerHTML = d;
                    //td.href = data[i-1].properties[key];
                }
                else {
                    d = data[i-1].properties[key];
                    td.appendChild(document.createTextNode(d));
                }
                td.className = td.className + "row-cell " +
                data[i-1].geometry.coordinates[1] + ' ' +
                data[i-1].geometry.coordinates[0];
                td.style.border = "1px solid black";
                //add click listener to each cell
                //will refocus map on relevant earthquake
                $(td).click(function() {
                    console.log('here');
                    console.log($(this)[0]);
                    var classList = $(this)[0].className.split(/\s+/);
                    app.reCenter(classList[1], classList[2]);
                    console.log(classList);
                });
        }
        }
    }
    body.appendChild(tbl);
}
