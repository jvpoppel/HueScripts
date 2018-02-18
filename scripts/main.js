var hue = jsHue(); //Instance of Hue
//var bridgeIP = localStorage.getItem("bridgeIP");
var bridgeIP = "192.168.0.188";
var bridge;
//var username = localStorage.getItem("bridgeUser");
var username = "YuFlCi5J1qXbu3XBkd9IhyEG4O1tBG5GYAjN25zh";
var user;

var test = false;


$(document).ready(function() {
    checkBridge();
});

function getBridges() {

    var bSelect = $("#bridgeSelect");
    var index;

    hue.discover().then(bridges => {
        if(bridges.length === 0) {
        console.log('No bridges found. :(');
        } else {
            for (index = 0; index < bridges.length; ++index) {
                var b = bridges[index];
                bSelect.append($('<option>', {
                    value: index,
                    text: b.internalipaddress
                }));
            }
        }
    }).catch(e => console.log('Error finding bridges', e));
}

function checkBridge() {
    if ((bridgeIP === null) || (username === null)) {
        getBridges();
        $('#ipModal').modal({backdrop: "static"});
        $('#ipModal').modal('show');
    } else {
        bridge = hue.bridge(bridgeIP);
        user = bridge.user(username);
    }
}

function modalSelectIP() {

    /** Fetch, and store bridge IP from dropdown menu */
    var fetchIP = $('#bridgeSelect :selected').text();
    console.log(fetchIP);
    localStorage.setItem("bridgeIP", fetchIP);
    bridge = hue.bridge(fetchIP);

    $('#ipModal').modal('hide');
    $('#bridgeModal').modal({backdrop: "static"});
    $('#bridgeModal').modal('show');
    // create user account (requires link button to be pressed)
    /*bridge.createUser('HueScriptsApp#Account',
        function (success) {
            console.log("Success");
            // extract bridge-generated username from returned data
            username = data[0].success.username;
            localStorage.setItem("bridgeUser", username);
            // instantiate user object with username
            user = bridge.user(username);

            bridgeConnectSuccess();
        }, function(error) {
            console.log(error);
            $("#discoverText").text("Something went wrong while connecting to your bridge. Refresh and try again.");
        }); */
    createAccount(fetchIP);
}

function bridgeConnectSuccess() {
    $('#bridgeModal').modal('hide');
    $('#successModal').modal({backdrop: "static"});
    $('#successModal').modal('show');
}

function testFnc() {
    if (test == true) {
        user.setLightState(1, { bri: 255});
        console.log("255");
        test = false;
    } else {
        user.setLightState(1, { bri: 10});
        console.log("128");
        test = true;
    }
}

function createAccount(fetchIP) {
    //TODO: make.

    /*var req_url = 'http://' + fetchIP + '/api';
    var command = $.ajax({
        url: req_url,
        type: "POST",
        data: {
            "devicetype": "HueScriptsApp#Api Acc"
        }

    });*/
}