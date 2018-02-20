var hue = jsHue(); //Instance of Hue
//var bridgeIP = localStorage.getItem("bridgeIP");
var bridgeIP = "192.168.0.188";
var bridge;
//var username = localStorage.getItem("bridgeUser");
var username = "YuFlCi5J1qXbu3XBkd9IhyEG4O1tBG5GYAjN25zh";
var user;
var data = [];
var time = 0;
var cmdChecked = 0;
var timeInterval;
var tableIndex = 0;
var curTable;
var editButton;

var started = false;
var test = false;


$(document).ready(function() {
    checkBridge();
	
	$("#btnEditDelete").on('click', function() {
		delRow();
	});
	
	$("#btnEditSubmit").on('click', function() {
		editRow();
	});
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
	data.sort(function(a, b){
		return a.time - b.time;
	});
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
	curTable.append("<th></th>");
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
		row.append('<td><button type="button" id="rowEdit_' + tableIndex + '">Edit');
		var rEdit = $("#rowEdit_"+tableIndex);
		rEdit.attr("class","btn btn-info btn-sm");
		rEdit.on('click', function() {
			var suffix = event.target.id.match(/\d+/);
            modifRow(suffix[0], rEdit);
        });
		rEdit.append("</button></td>");
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
		cmdChecked = 0;
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
		$("#row" + Number(cmdChecked - 1)).removeClass("table-info");
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
	
	if (cmdChecked < data.length) {
		async(checkCmd, function() {
			console.log("Finished time " + time);
		});
	}
	
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
	var sendData = new Array();
	
	if (data[cmdChecked].time == asyncTime) {
		
		sendData.push(data[cmdChecked]);
		if (cmdChecked > 0) {
			$("#row" + cmdChecked).addClass("table-info");
			$("#row" + (cmdChecked - 1)).removeClass("table-info");
		} else {
			$("#row" + cmdChecked).addClass("table-info");
		}
		
		while (cmdChecked < data.length - 1) {
			
			if (data[cmdChecked].time == data[cmdChecked + 1].time) {
				++cmdChecked;
				sendData.push(data[cmdChecked]);
			    $("#row" + cmdChecked).addClass("table-info");
			    $("#row" + (cmdChecked - 1)).removeClass("table-info");
				
			} else {
				
				break;
			}
		}
		++cmdChecked;
	}
	
	for (var index = 0; index < sendData.length; ++index) {
		
		var light = sendData[index].light;
        var cmd = sendData[index].cmd;
        var wrd = sendData[index].wrd;
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
				
			case "xy":
			    wrd = JSON.parse(wrd);
			    body = { "xy": convertRGB(wrd[0], wrd[1], wrd[2])};
				break;
        }
		
        console.log(body);
        user.setLightState(light, body);
	}
}

/**
 * Function that shows the modal containing the add row fields.
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
	
	data.sort(function(a, b){
		return a.time - b.time;
	});
	
    createTable();

}

/**
 * Function to edit the data on a selected row.
 */
function editRow() {

    editButton.unbind( "click" );
	$("#editModal").modal('hide');
	var row = $("#editRowID").val();
	data[row].light = $("#editRowLight").val();
	data[row].time = $("#editRowTime").val();
	data[row].wrd = $("#editRowValue").val();
	data[row].cmd = $('#editRowCommand :selected').text();
	
	data.sort(function(a, b){
		return a.time - b.time;
	});
	
	createTable();
}

/**
 * Function to delete a selected row.
 */
function delRow() {

    editButton.unbind( "click" );
	$("#editModal").modal('hide');
	var row = $("#editRowID").val();
	data.splice(row, 1);
	createTable();

}

/**
 * @param row Row to be edited
 * @param elem Element that called this function (remove event handeler from this element)
 */
function modifRow(row, elem) {
	editButton = elem;
	$("#editRowID").val(row);
	$("#editRowLight").val(data[row].light);
	$("#editRowTime").val(data[row].time);
	$("#editRowValue").val(data[row].wrd);
	
	$("#editModal").modal({backdrop: "static"});
	$("#editModal").modal('show');
	
}

/**
 * Function wrapper for RGB to CIE conversion from colors.js
 * @param red int value for red
 * @param green int value for green
 * @param blue int value for green
 * @pre 0 <= red, green, blue <= 255
 * @result array containing x and y values
 */
var convertRGB = function(red, green, blue) {
	
	return colors.rgbToCIE1931(red, green, blue);
}