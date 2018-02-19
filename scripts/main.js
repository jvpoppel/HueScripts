var hue = jsHue(); //Instance of Hue
//var bridgeIP = localStorage.getItem("bridgeIP");
var bridgeIP = "192.168.0.188";
var bridge;
//var username = localStorage.getItem("bridgeUser");
var username = "YuFlCi5J1qXbu3XBkd9IhyEG4O1tBG5GYAjN25zh";
var user;
var data;
var time = 0;
var timeInterval;

var started = false;
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
        user.setLightState(3, { bri: 255});
        console.log("255");
        test = false;
    } else {
        user.setLightState(3, { bri: 10});
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

function loadFnc() {
    $('#inputModal').modal({backdrop: "static"});
    $('#inputModal').modal('show');
}

function jsonSubmit() {
    var input = $('#inputArea').val();
    console.log(input);

    var arr = jQuery.parseJSON(input);
    data = $.map(arr, function(el) { return el; });
    console.log(data);

}

function startFnc() {
    if (started === false) {
        time = 0;
        $("#timer").html("Timer: "+ time);
        checkCmd();
        timeInterval = window.setInterval(checkCmd, 1000);
        started = true;
    }
}

function stopFnc() {
    if (started === true) {
        clearInterval(timeInterval);
        started = false;
    }
}

function checkCmd() {
    var index;
    for (index = 0; index < data.length; ++index) {
        if (data[index].time == time) {
            var light = data[index].light;
            var cmd = data[index].cmd;
            var wrd = data[index].wrd;
            var body;
            switch (cmd) {
                case "bri":
                    body = { "bri": Number(wrd)};
                    break;

                case "sat":
                    body = { "sat": Number(wrd)};
                    break;

                case "hue":
                    body = { "hue": Number(wrd)};
                    break;
            }
            console.log(body);
            user.setLightState(light, body);
        }
    }
    time = time + 1;
    $("#timer").html("Timer: "+ time);

}

function convertRGB(red, green, blue) {
    red = red / 255.000;
    green = green / 255.000;
    blue = blue / 255.000;

    red = (red > 0.04045) ? pow((red + 0.055) / (1.0 + 0.055), 2.4) : (red / 12.92);
    green = (green > 0.04045) ? pow((green + 0.055) / (1.0 + 0.055), 2.4) : (green / 12.92);
    blue = (blue > 0.04045) ? pow((blue + 0.055) / (1.0 + 0.055), 2.4) : (blue / 12.92);

    var X = red * 0.664511 + green * 0.154324 + blue * 0.162028;
    var Y = red * 0.283881 + green * 0.668433 + blue * 0.047685;
    var Z = red * 0.000088 + green * 0.072310 + blue * 0.986039;

    var x = X / (X + Y + Z);
    var y = Y / (X + Y + Z);
}