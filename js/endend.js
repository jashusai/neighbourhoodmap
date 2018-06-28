/* This variable using for store the location name and city name
and location latitude and longitude*/
var locs = [{collegeid: 'BEC college',city: 'Bapatla',lat: 15.8905642,lng: 80.4396485},
              {collegeid: 'RVRJC college',city: 'Guntur',lat: 16.2556495,lng: 80.3217099},
              {collegeid: 'GITAM college',city: 'Vizag',lat: 17.7814939,lng: 83.3750193},
              {collegeid: 'VIT college',city: 'Bhimavaram ',lat: 16.5659704,lng: 81.5203238},
              {collegeid: 'VRSE college',city: 'Vijayawada ',lat: 16.4837461,lng: 80.6888283}
             ];
/* Declaring the global variables */
var map;
var informationWindow;
var SeeInfoWindow = function() {
    /* function used for information window and 
    filtered the locations of uppercase
    or lowercase
    info window has a close click*/
    var imp = this;
    this.mapNot = ko.observable(false);
    this.locsList = ko.observableArray([]);
    locs.forEach(function(explace) {
    imp.locsList.push(new empty(explace));});
    map.fitBounds(map.bounds);
    this.exLoc = ko.observable(locsList()[0]);
    this.searchWord = ko.observable('');
    this.setBackState = function() { 
        imp.exLoc().active(false);
        imp.exLoc().needle.setAnimation(null);
        informationWindow.close();};
    this.purifiedLocations = ko.computed(function() {
    setBackState();
    return imp.locsList().filter(function(explace) {
            var reveal = true;
            if (imp.searchWord() !== '') {
                if (explace.collegeid().toLowerCase().indexOf(imp.searchWord().toLowerCase()) !== -1) {
                    reveal = true;
                } else {
                    reveal = false;}}
            explace.needle.setVisible(reveal);
            return reveal;});});
    this.citySelector = function(whenClicked) {
        var n =  imp.exLoc().active() === true;
        if (imp.exLoc() == whenClicked && n) {
            setBackState();
            return;
        }setBackState();

        imp.exLoc(whenClicked);

        imp.exLoc().active(true);

        imp.exLoc().needle.setAnimation(google.maps.Animation.BOUNCE);
        informationWindow.setContent('<h1>' + imp.exLoc().collegeid() + '</h1>' + imp.exLoc().retrieveContent(function(j) {
            if (imp.exLoc() == j) {
                informationWindow.setContent('<h1>' + imp.exLoc().collegeid() + '</h1>' + j.info());
            }}));
        informationWindow.open(map, imp.exLoc().needle);
         map.panTo(imp.exLoc().needle.position);};};
         function initiativeFunction() {
            map = new google.maps.Map(document.getElementById('jashumap'));
            map.bounds = new google.maps.LatLngBounds();
            informationWindow = new google.maps.InfoWindow({
            content: ''
            });
            google.maps.event.addListener(informationWindow, 'closeclick', function() {
                setBackState();
            });
        }
var empty = function(explace) {
    var imp = this;
    imp.collegeid = ko.observable(explace.collegeid);
    imp.city = ko.observable(explace.city);
    imp.lat = ko.observable(explace.lat);
    imp.lng = ko.observable(explace.lng);
    imp.active = ko.observable(false);
    imp.retrieveContent = function(callthis) {
        if (imp.info) {
            return imp.info();
        }
        /*The third party link variable is used for wikipedia
        and collegeid and search the info 
        in new tab*/
        var thirdPartyLink = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + imp.collegeid() +'&format=json&callthis=wikicallthis';
        $.ajax({
                url: thirdPartyLink,
                dataType: 'jsonp',
            })
            .done(function(resultset) {
                var totalData = '';
                var abc1 = typeof resultset[1] !== "blank";
                if (resultset && abc1 && typeof resultset[3] !== "blank") {
                        for (var j = 0; j <1; j++) {
                            var a = typeof resultset[1][j] !== "blank";
                            var b = typeof resultset[3][j] !== "blank";
                            if (a && b ) {
                                totalData += '<a href="' + resultset[3][j] + '" target="_blank">' + resultset[1][j] + '</a><br>';
                            }
                        }
                    }
                if (totalData !== '') {
                    imp.info = ko.observable('<h3>Wikipedia link for "' + imp.collegeid() +  '"</h3><p>' + totalData + '</p>');
                } else {
                    imp.info = ko.observable('<h3>Wikipedia link for "' + imp.collegeid() + '"</h3><p>There was a problem, sorry =/</p>');
                }
            })
            .fail(function() {
                console.log("Sorry !! Error!!");
            })
            .always(function() {
                if (typeof callthis !== "blank") {
                    callthis(imp);
                }
            });
             return '<h5>Wiki Link for "' + imp.collegeid() + '"</h5><p><span class="def"></span></p>';
    };
    imp.addNeedle = (function() {
        imp.needle = new google.maps.Marker({
            position: { lat: imp.lat(), lng: imp.lng() },
            map: map,
            heading: imp.collegeid()
        });
    map.bounds.extend(imp.needle.position);
    imp.needle.addListener('click', function() { 
            citySelector(imp);
        });
        map.addListener('click', function() { 
            informationWindow.close();
        });
    })();
};



function errorSolver() {
    /*If any problem with google api-key this function shows some message */
    console.log('Error! Map Cannot Be Loaded');
    $('body').prepend('<p id="mapkaerror"> Google API error </p>');
}

var extrafunc = function() {
    initiativeFunction();
    ko.applyBindings(SeeInfoWindow);
};

