var hue = jsHue(); //Instance of Hue
//var bridgeIP = localStorage.getItem("bridgeIP");
var bridgeIP = "192.168.0.188";
var bridge;
//var username = localStorage.getItem("bridgeUser");
var username = "YuFlCi5J1qXbu3XBkd9IhyEG4O1tBG5GYAjN25zh";
var user;
var data = [];
var time = 0;
var timeInterval;
var tableIndex = 0;
var curTable;

var started = false;
var test = false;


$(document).ready(function() {
    checkBridge();
});

/**
 * Function that gets all local bridges and stores the IPs in a dropdown menu.
 */
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

/**
 * Function that checks if there already is a Philips Hue account.
 * If so: Do nothing.
 * Else: Start bridge connecting.
 */
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

/**
 * Function to store the selected IP, and initiate account creation.
 */
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

/**
 * Function to show the 'Bridge successfully connected' modal.
 */
function bridgeConnectSuccess() {
    $('#bridgeModal').modal('hide');
    $('#successModal').modal({backdrop: "static"});
    $('#successModal').modal('show');
}

/**
 * Test function that will change a lamps brightness.
 * TODO: Remove.
 */
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

/**
 * Function to create an account on the Hue Bridge if there is none already.
 * @param fetchIP Bridge IP
 */
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

/**
 * Function that calls the modal on which the JSON input is present.
 */
function loadFnc() {
    $('#inputModal').modal({backdrop: "static"});
    $('#inputModal').modal('show');
}

/**
 * Function that parses inputted JSON data to an usable array.
 */
function jsonSubmit() {
    var input = $('#inputArea').val();
    console.log(input);

    var arr = jQuery.parseJSON(input);
    data = $.map(arr, function(el) { return el; });
    console.log(data);

    createTable();
}

/**
 * Function called after loading a JSON string, maps this data to a table.
 */
function createTable() {
    var divTable = $("#divTable");
    divTable.html("");
    tableIndex = 0;
    divTable.append("<table id='cmdTable'>");
    curTable = $("#cmdTable");
    curTable.addClass("table table-hover");
    curTable.append("<thead>");
    /** Add first row of table */
    curTable.append("<tr>");
    curTable.append("<th>Time</th>");
    curTable.append("<th>Light</th>");
    curTable.append("<th>Command</th>");
    curTable.append("<th>Value</th>");
    curTable.append("</thead><tbody>");

    /** Let a for loop add the rest of the columns */

    for (tableIndex = 0; tableIndex < data.length; ++tableIndex) {

        var attributes = "id='row" + tableIndex + "'";
        curTable.append("<tr " + attributes + ">");
        var row = $("#row" + tableIndex);
        var time = data[tableIndex].time;
        var light = data[tableIndex].light;
        var cmd = data[tableIndex].cmd;
        var wrd = data[tableIndex].wrd;

        row.append("<td>" + time + "</td>");
        row.append("<td>" + light + "</td>");
        row.append("<td>" + cmd + "</td>");
        row.append("<td>" + wrd + "</td>");
        row.append("</tr>");
    }

    curTable.append("</tbody></table>");
}

/**
 * Function to create {@code timeInterval} iff {@code started == false}
 */
function startFnc() {
    if (started === false) {
        time = 0;
        $("#timer").html("Timer: "+ time);
        checkCmd();
        timeInterval = window.setInterval(update, 100);
        started = true;
    }
}

/**
 * Function to stop {@code timeInterval} iff {@code started == true}
 */
function stopFnc() {
    if (started === true) {
        clearInterval(timeInterval);
        started = false;
    }
}

/**
 * Function to asynchronously call {@code checkCmd()} and update {@code time}
 */
function update() {
    var timeString = "";
    if (time < 10) {
        timeString = "0." + time;
    } else {
        timeString = (time - ( time % 10 )) / 10 + "." + ( time%10 );
    }
    $("#timer").html("Timer: "+ timeString);
    async(checkCmd, function() {
        console.log("Finished time " + time);
    });
    time = time + 1;
}

/**
 * @param fn Function to be executed with {@code time} as parameter.
 * @param callback Callback after {@code fn} has been executed.
 */
function async(fn, callback) {
    setTimeout(function() {
        fn(time);
        callback();
    }, 0);
}

/**
 * Function to check if a command has to be executed at that time. If so, also execute it.
 * @param asyncTime The time on which the function has been called.
 */
function checkCmd(asyncTime) {
    var index;
    for (index = 0; index < data.length; ++index) {
        if (data[index].time == asyncTime) {
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

}

/**
 * Functon that shows the modal containing the add row fields.
 */
function addFnc() {
    $("#rowModal").modal({backdrop: "static"});
    $("#rowModal").modal('show');
}

/**
 * Function that adds a new row to the command table, and stores this also in the {@code data} array.
 */
function addRow() {
    $("#rowModal").modal('hide');
    data.push({
        "time": $("#addRowTime").val(),
        "light": $("#addRowLight").val(),
        "cmd": $('#addRowCommand :selected').text(),
        "wrd": $("#addRowValue").val()
    });
    createTable();

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