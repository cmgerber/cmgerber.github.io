//list of locations [location, lat, long, person, year]
var locations = [['San Diego, CA', 32.9953, -117.2603, 'lcl', 2014], ['Lake George, NY', 43.4244, -73.7153, 'lc', 2014],
                ['Edinburgh, Scotland', 55.9531, -3.1889, 'c', 2014], ['Elgin, Scotland', 57.6500, -3.3150, 'c', 2014],
                ['Berkeley, CA', 37.8717, -122.2728, 'lcl', 2013], ['Melbourne, Australia', -37.8136, 144.9631, 'l', 2013],
                ['San Jose, Costa Rica', 9.9333, -84.0833, 'lc', 2013], ['Cary', 35.7789, -78.8003, 'lc', 2013],
                ['Wilmington, NC', 34.2233, -77.9122, 'lc', 2013], ['Atlanta, GA', 33.7550, -84.3900, 'lc', 2013],
                ['Manchester NH', 42.9908, -71.4636, 'lc', 2013],
                ['Toledo, OH', 41.6656, -83.5753, 'lc', 2012], ['Philadelphia, PA', 39.9500, -75.1667, 'lc', 2012],
                ['Richmond, VA', 37.5333, -77.4667, 'lc', 2012],
                ['Washington DC', 38.8951, -77.0367, 'lcl', 2011], ['Rome, Italy', 41.9000, 12.5000, 'c', 2008],
                ['Quebec, Canada', 46.8167, -71.2167, 'c', 2007], ['Santa Barbara, CA', 34.4258, -119.7142, 'c', 2007],
                ['Seville, Spain', 37.3772, -5.9869, 'c', 2006], ['London, England', 51.5072, -0.1275, 'lc', 2006],
                ['Madrid, Spain', 40.4000, -3.6833, 'c', 2006], ['Paris, France', 48.8567, 2.3508, 'c', 2006],
                ['Vienna, Austria', 48.2000, 16.3667, 'c', 2006], ['Salzburg, Austria', 47.8000, 13.0333, 'c', 2006],
                ['Dublin, Ireland', 53.3478, -6.2597, 'c', 2006], ['Munich, Germany', 48.1333, 11.5667, 'c', 2006],
                ['Hohenschwangau, Germany', 47.5583, 10.7417, 'c', 2006], ['Toledo, Spain', 39.8567, -4.0244, 'c', 2006],
                ['Vancouver, Canada', 49.2500, -123.1000, 'c', 2004]];



var app = new clTravels([37.3772, -5.9869], 2);
window.addEventListener('load', function() {
    app.init(document.getElementById("map"));
    getTravel(app);

    //filter buttons
    var rows = $('table tr');
    var LC = $('.lc');
    var C = $('.c');
    var L = $('.l');
    var LCL = $('lcl');

    $('#LindsColin').click(function() {
                LC.show();
                C.hide();
                L.hide();
                LCL.show();
    });

    $('#Colin').click(function() {
                LC.hide();
                C.show();
                L.hide();
                LCL.hide();
    });

    $('#Linds').click(function() {
                LC.hide();
                C.hide();
                L.show();
                LCL.hide();
    });

    $('#ShowAll').click(function() {
        LC.show();
        C.show();
        L.show();
        LCL.show();
    });
});

function clTravels(center, zoom) {
    this.center = center;
    this.zoom = zoom;
}

clTravels.prototype.init = function(container) {
    this.map = L.map(container).setView(this.center, this.zoom);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
};

clTravels.prototype.addTravel = function(position, title, status) {
    L.marker(position).addTo(this.map).bindPopup(title);
    if(status == 'lc') {
        L.circle(position, 10000, {color:'#00009c'}).addTo(this.map);
    }
    else if(status == 'lcl') {
        L.circle(position, 10000, {color:'#008080'}).addTo(this.map);
    }
    else if(status == 'c') {
        L.circle(position, 10000, {color:'#1ca112'}).addTo(this.map);
    }
    else {
        L.circle(position, 10000, {color:'#800080'}).addTo(this.map);
    }
};

// clTravels.prototype.zoomOut = function() {
//     this.map.setZoom(2, animate=true);
// };

clTravels.prototype.reCenter = function(lat, lng) {
    //this.map.setZoom(2, animate=true);
    this.map.panTo(new L.LatLng(lat, lng));
    this.map.setZoom(6, animate=true);
};


function getTravel(obj) {
        tableCreate(locations);
        $.each(locations, function(i,e) {
            obj.addTravel([e[1],e[2]],
                              (e[0] + ' ' + e[4]), e[3]);
        });
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
            $.each(['Loaction', 'Year'], function(i,e) {
                var thd = thr.insertCell();
                thd.appendChild(document.createTextNode(e));
                thd.style.border = "1px solid black";
            });
        }
        else {for(var j = 0; j < data[i-1].length + 1; j++) {
                //create a row for each Travel and value
                if(j === 0 || j === 4) {
                    var td = tr.insertCell();
                    var d;
                    if(data[i-1][j] == 'url' || data[i-1][j] == 'detail') {

                        d = '<a href=' + data[i-1].properties[data[i][j]] + ' target="_blank">' + data[i-1][j] + '</a>';
                        td.innerHTML = d;
                    }
                    else {
                        d = data[i-1][j];
                        td.appendChild(document.createTextNode(d));
                    }
                    td.className = td.className + "row-cell " +
                    data[i-1][1] + ' ' + data[i-1][2] + ' ' + data[i-1][3];
                    td.style.border = "1px solid black";
                    //add click listener to each cell
                    //will refocus map on relevant Travel
                    $(td).click(function() {
                        var classList = $(this)[0].className.split(/\s+/);
                        app.reCenter(classList[1], classList[2]);
                    });
                }
        }
        }
    }
    body.appendChild(tbl);
}


