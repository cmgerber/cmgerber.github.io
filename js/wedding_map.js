//list of locations [location, lat, long, person, year]
var locations = [['Goldsworthy House', 34.216754, -77.787763, 'lcl', "Ceremony"],
                ['Bluewater Grill', 34.216887,-77.812611, 'lc', 'Reception'],
                ['Wrightsville Beach Bridge*', 34.218231, -77.812611, 'lcl', "Bridge"],
                ['Hampton Inn & Suites', 34.223223, -77.819617, 'lcl', "Hotel"],
                ['Holiday Inn Resort', 34.220396, -77.785332, 'lcl', "Hotel"]];
                //['Residence Inn', 34.236389, -77.826856, 'lcl', "Hotel"]



var app = new clTravels([34.217774, -77.812611], 13);
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
    tbl.style.width='300px';
    tbl.style.border = "1px solid black";

    for(var i = 0; i < data.length + 1; i++){
        var tr = tbl.insertRow();
        var th = tbl.createTHead();
        var thr = th.insertRow();
        if(i===0) {
            //Create header row
            $.each(['Loaction', 'Event'], function(i,e) {
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


