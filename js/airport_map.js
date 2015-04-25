//list of locations [location, lat, long, person, year]
var locations = [['Wilmington Internation Airport', 34.266802,-77.910371, 'lcl', 'Airport']];
var locations1 = [['Raleigh Internation Airport', 35.880079,-78.787996, 'lcl', 'Airport']];



var app = new clTravels([34.266802,-77.910371], 12);
var app1 = new clTravels([35.880079,-78.787996], 12);
window.addEventListener('load', function() {
    app.init(document.getElementById("ilmMap"));
    getTravel(app, locations);
    app1.init(document.getElementById("rduMap"));
    getTravel(app1, locations1);
});

function clTravels(center, zoom) {
    this.center = center;
    this.zoom = zoom;
}

clTravels.prototype.init = function(container) {
    this.map = L.map(container).setView(this.center, this.zoom);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="http://osm.org/copyright">OpenStreetmap</a> contributors'
    }).addTo(this.map);
};

clTravels.prototype.addTravel = function(position, title, status) {
    L.marker(position).addTo(this.map).bindPopup(title);
    // if(status == 'lc') {
    //     L.circle(position, 10000, {color:'#00009c'}).addTo(this.map);
    // }
    // else if(status == 'lcl') {
    //     L.circle(position, 10000, {color:'#008080'}).addTo(this.map);
    // }
    // else if(status == 'c') {
    //     L.circle(position, 10000, {color:'#1ca112'}).addTo(this.map);
    // }
    // else {
    //     L.circle(position, 10000, {color:'#800080'}).addTo(this.map);
    // }
};

// clTravels.prototype.zoomOut = function() {
//     this.map.setZoom(2, animate=true);
// };

clTravels.prototype.reCenter = function(lat, lng) {
    //this.map.setZoom(2, animate=true);
    this.map.panTo(new L.LatLng(lat, lng));
    this.map.setZoom(15, animate=true);
};

function getTravel(obj, locs) {
        $.each(locs, function(i,e) {
            obj.addTravel([e[1],e[2]],
                              (e[0] + ' ' + e[4]), e[3]);
        });
}


