/**
 * @author Johan van Poppel ( https://github.com/jvpoppel/HueScripts )
 * 
 */

var hue = jsHue(); //Instance of Hue
var bridgeIP = localStorage.getItem("bridgeIP");
var bridge;
var username = localStorage.getItem("bridgeUser");
var user;
var sequence = [];
var time = 0;
var lastExecuted = 0;
var timeInterval;
var tableIndex = 0;
var curTable;
var editButton;

var started = false;


$(document).ready(function() {
    checkBridge();
	
	$("#btnEditDelete").on('click', function() {
		delRow();
	});
	
	$("#btnEditSubmit").on('click', function() {
		editRow();
	});
});

inputSound.onchange = function(e){
    var sound = document.getElementById('sound');
    sound.src = URL.createObjectURL(this.files[0]);
    // not really needed in this exact case, but since it is really important in other cases,
    // don't forget to revoke the blobURI when you don't need it
    sound.onend = function(e) {
        URL.revokeObjectURL(this.src);
    }
};

/**
 * Function that gets all local bridges and stores the IPs in a dropdown menu.
 */
function getBridges() {

    var bSelect = $("#bridgeSelect");
    discoverBridges("https://discovery.meethue.com/").then(bridges => {
            for (bridge of bridges) {
                bSelect.append($('<option>', {
                    value: bridge,
                    text: bridge
                }));
            }
        }
    )

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
async function modalSelectIP() {

    /** Fetch, and store bridge IP from dropdown menu */
    var fetchIP = $('#bridgeSelect :selected').text();
    console.log(fetchIP);
    localStorage.setItem("bridgeIP", fetchIP);
    bridge = hue.bridge(fetchIP);

    $('#ipModal').modal('hide');
    $('#bridgeModal').modal({backdrop: "static"});
    $('#bridgeModal').modal('show');
    // create user account (requires link button to be pressed)
    var linked = false;
    while (!linked) { // Keeps looping until an username has been correctly fetched and set.
        await bridge.createUser('HueScriptsApp#Account').then(async function(data) {
            try {
                var newUsername = data[0].success.username;
                linked = true;
                console.log("username: " + newUsername);
                localStorage.setItem("bridgeUser", newUsername);
                user = bridge.user(newUsername);
                bridgeConnectSuccess();
            } catch (error) {
                // To avoid DDoS-ing your hue bridge by spamming requests, implement 0.5s timeout here.
                console.log("Link button press not yet registered, wait 0.5s and try again.");
                await sleep(500);
            }
        });
    }
    $('#bridgeModal').modal('hide');
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
 * Function that calls the modal on which the JSON input is present.
 */
function loadFnc() {
    
    $('#inputModal').modal({backdrop: "static"});
    $('#inputModal').modal('show');
}

function saveFnc() {

    var cnvData = JSON.stringify(sequence);
    $("#saveArea").val(cnvData);
    $("#saveModal").modal('show');
}

/**
 * Function that parses inputted JSON sequence to an usable array.
 */
function jsonSubmit() {
    var input = $('#inputArea').val();
    console.log(input);

    var arr = jQuery.parseJSON(input);
    sequence = $.map(arr, function(el) { return el; });
	sequence.sort(function(a, b){
		return a.time - b.time;
	});
    console.log(sequence);

    createCmdTable();
}

async function modalLightTest() {
    await createLightTable();
    $("#lightModal").modal({backdrop: "static"});
    $("#lightModal").modal('show');
}

async function createLightTable() {
    var divTable = $("#lightTable");
    divTable.html("");
    apiURL = "http://" + bridgeIP + "/api/" + username + "/lights";
    var amountOfLights = 0;
    await amountLights(apiURL).then(response =>
        amountOfLights = response);
    console.log("aoL = " + amountOfLights);
    var content = "<table id=\"lightTable\">";
    content += "<thead><tr><th>ID</th><th> </th><th> </th><th>Test button</th></tr></thead><tbody>";

    for (var lightIndex = 1; lightIndex <= amountOfLights; lightIndex++) {
        content += "<tr><td>" + lightIndex + "</td><td> </td><td> </td>";
        content += "<td><button type=\"button\" id=\"lightTest_" + lightIndex + "\" class=\"btn btn-info btn-sm\" onclick=\"testLight(" + lightIndex + ");\"> Test Light";
		content += "</button></td></tr>";
    }

    content += "</tbody></table>";
    divTable.append(content);
    console.log(content);
}

/**
 * Function that sets the brightness of a light first to 50 then to 255
 * @param id Light ID
 */
async function testLight(id) {
    console.log("Test light " + id);
    user.setLightState(id, { "bri": 10});
    await sleep(250);
    user.setLightState(id, { "bri": 255});
}

/**
 * Function called after loading a JSON string, maps this sequence to a table.
 */
function createCmdTable() {
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

    for (tableIndex = 0; tableIndex < sequence.length; ++tableIndex) {

        var attributes = "id='row" + tableIndex + "'";
        curTable.append("<tr " + attributes + ">");
        var row = $("#row" + tableIndex);
        var time = sequence[tableIndex].time;
        var light = sequence[tableIndex].light;
        var cmd = sequence[tableIndex].cmd;
        var wrd = sequence[tableIndex].wrd;

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

        sound.play();
        time = 0;
		lastExecuted = 0;
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
        sound.pause();
        clearInterval(timeInterval);
		$("#row" + Number(lastExecuted - 1)).removeClass("table-info");
        started = false;
        sound.load();
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
	
	if (lastExecuted < sequence.length) {
		async(checkCmd, function() {
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
	
	if (sequence[lastExecuted].time == asyncTime) {
		
		sendData.push(sequence[lastExecuted]);
		if (lastExecuted > 0) {
			$("#row" + lastExecuted).addClass("table-info");
			$("#row" + (lastExecuted - 1)).removeClass("table-info");
		} else {
			$("#row" + lastExecuted).addClass("table-info");
		}
		
		while (lastExecuted < sequence.length - 1) {
			
			if (sequence[lastExecuted].time == sequence[lastExecuted + 1].time) {
				++lastExecuted;
				sendData.push(sequence[lastExecuted]);
			    $("#row" + lastExecuted).addClass("table-info");
			    $("#row" + (lastExecuted - 1)).removeClass("table-info");
				
			} else {
				
				break;
			}
		}
		++lastExecuted;
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
				
			case "rgb":
			    wrd = JSON.parse(wrd);
			    body = { "xy": convertRGB(wrd[0], wrd[1], wrd[2])};
				break;

            case "repeat":
                clearInterval(timeInterval);
                $("#row" + Number(lastExecuted - 1)).removeClass("table-info");
                time = 0;
                lastExecuted = 0;
                $("#timer").html("Timer: "+ time);
                checkCmd();
                timeInterval = window.setInterval(update, 100);
                break;
            default:
                throw "Error: light command '" + cmd + "' not recognized.";
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
 * Function that adds a new row to the command table, and stores this also in the {@code sequence} array.
 */
function addRow() {
	
    $("#rowModal").modal('hide');
    sequence.push({
        "time": $("#addRowTime").val(),
        "light": $("#addRowLight").val(),
        "cmd": $('#addRowCommand :selected').text(),
        "wrd": $("#addRowValue").val()
    });
	
	sequence.sort(function(a, b){
		return a.time - b.time;
	});
	
    createCmdTable();

}

/**
 * Function to edit the sequence on a selected row.
 */
function editRow() {

    editButton.unbind( "click" );
	$("#editModal").modal('hide');
	var row = $("#editRowID").val();
	sequence[row].light = $("#editRowLight").val();
	sequence[row].time = $("#editRowTime").val();
	sequence[row].wrd = $("#editRowValue").val();
	sequence[row].cmd = $('#editRowCommand :selected').text();
	
	sequence.sort(function(a, b){
		return a.time - b.time;
	});
	
	createCmdTable();
}

/**
 * Function to delete a selected row.
 */
function delRow() {

    editButton.unbind( "click" );
	$("#editModal").modal('hide');
	var row = $("#editRowID").val();
	sequence.splice(row, 1);
	createCmdTable();

}

/**
 * @param row Row to be edited
 * @param elem Element that called this function (remove event handeler from this element)
 */
function modifRow(row, elem) {
	editButton = elem;
	$("#editRowID").val(row);
	$("#editRowLight").val(sequence[row].light);
	$("#editRowTime").val(sequence[row].time);
	$("#editRowValue").val(sequence[row].wrd);
	
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
let convertRGB = function(red, green, blue) {

	return colors.rgbToCIE1931(red, green, blue);
};

/**
 * Function to search the current network for bridges
 * @param url API url
 * @returns {Promise<[]>} Promise that, when fulfilled, contains all bridges.
 */
let discoverBridges = async function(url) {
    console.log("url: " + url);
    var response = [];
    await fetch(url).then(
        (resp) => resp.json().then(
            function(data) {
                for (const value of data) {
                    console.log("ip: " + value.internalipaddress);
                    response.push(value.internalipaddress);
                }
                return response;
    }));
    return response;
};

/**
 * Query the amount of lights connected to this Hue bridge
 * @param url API url
 * @returns {Promise<number>} Promise that, when fulfilled, contains the amount of lights on the bridge
 */
let amountLights = async function(url) {
    var response = 0;
    await fetch(url).then(
        (resp) => resp.json().then(
            function(data) {
                console.log(data);
                response = Object.keys(data).length;
                return response;
    }));
    return response;
};

/**
 * Sleep function, as written by StackOverflow user Dan Dascelescu at https://stackoverflow.com/a/39914235.
 * @param ms Timeout in milliseconds
 * @return promise that is only fulfilled after @param ms time
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}