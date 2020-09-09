/**
 * @author Johan van Poppel ( https://github.com/jvpoppel/HueScripts )
 */


import * as colorsAPI from '../../lib/colors.js';
import * as jsHue from '../../lib/jshue.js';
import { Page } from "../data/page";
import { Light } from "../model/light";
import { TSMap } from "typescript-map";

var hue = jsHue();
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
var localLights;
var currentPage = 1;

var started = false;

var pagesMap = new TSMap();
var lights = new TSMap();


$(document).ready(function() {
    // First, initialize the pages map
    for (var i = 1; i <= 6; i++) {
        pagesMap.set(i, new Page(i));
    }

    checkBridge();
	
	$("#btnEditDelete").on('click', function() {
		delRow();
	});
	
	$("#btnEditSubmit").on('click', function() {
		editRow();
	});
});

/*
    TODO: Rework sound

inputSound.onchange = function(e){
    var sound = document.getElementById('sound');
    sound.src = URL.createObjectURL(this.files[0]);
    // not really needed in this exact case, but since it is really important in other cases,
    // don't forget to revoke the blobURI when you don't need it
    sound.onend = function(e) {
        URL.revokeObjectURL(this.src);
    }
};
 */

/**
 * Change dropdown menu's based on light IDs on bridge
 */
async function changeDropdownLightIDs() {

    const addRowLightSelect = (<HTMLSelectElement> document.getElementById("addRowLight"));
    const editRowLightSelect = (<HTMLSelectElement> document.getElementById("editRowLight"));
    let lightIDs = [];
    await getLocalLights().then(response =>
        lightIDs = response);
    console.log(lightIDs);
    for (let index = 0; index < lightIDs.length; index++) {
        let addOption: HTMLOptionElement = document.createElement("option");
        let editOption: HTMLOptionElement = document.createElement("option");
        addOption.text = lightIDs[index];
        editOption.text = lightIDs[index];
        addRowLightSelect.add(addOption);
        editRowLightSelect.add(editOption);
    }
}

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
    let ipModal = $('#ipModal');
    if ((bridgeIP === null) || (username === null)) {
        getBridges();
        ipModal.modal({backdrop: "static"});
        ipModal.modal('show');
    } else {
        bridge = hue.bridge(bridgeIP);
        user = bridge.user(username);

        changeDropdownLightIDs().then(r => console.log("Changed dropdown light IDs."));
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

    let bridgeModal = $('#bridgeModal');

    $('#ipModal').modal('hide');
    bridgeModal.modal({backdrop: "static"});
    bridgeModal.modal('show');
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
    bridgeModal.modal('hide');
    // Change dropdown menu's based on the found bridge.
    await changeDropdownLightIDs();
}

/**
 * Function to show the 'Bridge successfully connected' modal.
 */
function bridgeConnectSuccess() {
    let successModal = $('#successModal');
    $('#bridgeModal').modal('hide');
    successModal.modal({backdrop: "static"});
    successModal.modal('show');
}

/**
 * Function that calls the modal on which the JSON input is present.
 */
function loadFnc() {

    let inputModal = $('#inputModal');
    inputModal.modal({backdrop: "static"});
    inputModal.modal('show');
}

function saveFnc() {

    var cnvData = JSON.stringify(sequence);
    $("#saveArea").val(cnvData);
    $("#saveModal").modal('show');
}

/**
 * Function that clears the entire sequence table.
 */
function clearFnc() {
    if (confirm('Are you sure you want to delete everything you just created?')) {
        // Clear!
        sequence = [];
        createCmdTable();
    } else {
        // Do nothing!
    }

}

/**
 * Separate load function to be used by Load modal.
 * Also checks for empty input
 */
function submitLoadModal() {
    let input = $('#inputArea').val();
    if (input !== 0) {
        jsonSubmit(input);
    }
}

/**
 * Function that parses inputted JSON sequence to an usable array.
 */
function jsonSubmit(input) {
    console.log("Parsing JSON Sequence: \n" + input);

    const arr = jQuery.parseJSON(input);
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
    var lightIDs = [];
    await getLocalLights().then(response =>
        lightIDs = response);
    console.log("light IDs = " + lightIDs);
    var content = "<table id=\"lightTable\">";
    content += "<thead><tr><th>ID</th><th> </th><th> </th><th>Test button</th></tr></thead><tbody>";

    for (var lightIndex = 0; lightIndex < lightIDs.length; lightIndex++) {
        content += "<tr><td>" + lightIDs[lightIndex] + "</td><td> </td><td> </td>";
        content += "<td><button type=\"button\" id=\"lightTest_" + lightIDs[lightIndex] + "\" class=\"btn btn-info btn-sm\" onclick=\"testLight(" + lightIDs[lightIndex] + ");\"> Test Light";
		content += "</button></td></tr>";
    }

    content += "</tbody></table>";
    divTable.append(content);
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
    curTable.append("<th>LightCommand</th>");
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
		// TODO: Rework
		rEdit.on('click', function() {
			//let suffix = event.target.id.match(/\d+/);
            modifyRow(tableIndex, rEdit);
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

        // TODO: Rework sound
        // sound.play();
        time = 0;
		lastExecuted = 0;
        $("#timer").html("Timer: "+ time);
        // TODO: Improve
        checkCmd(0);
        timeInterval = window.setInterval(update, 100);
        started = true;
    }
}

/**
 * Function to stop {@code timeInterval} iff {@code started == true}
 */
function stopFnc() {
    if (started === true) {
        // TODO: Rework sound
        // sound.pause();
        clearInterval(timeInterval);
		$("#row" + Number(lastExecuted - 1)).removeClass("table-info");
        started = false;
        // TODO: Rework sound
        // sound.load();
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
                // TODO: Improve
                checkCmd(0);
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
	// TODO: Improve
	//@ts-ignore
	let row: number = $("#editRowID").val();
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
	// TODO: improve
	// @ts-ignore
    let row: number = $("#editRowID").val();
	sequence.splice(row, 1);
	createCmdTable();

}

/**
 * @param row Row to be edited
 * @param elem Element that called this function (remove event handeler from this element)
 */
function modifyRow(row, elem) {
	editButton = elem;
	$("#editRowID").val(row);
	$("#editRowLight").val(sequence[row].light);
	$("#editRowTime").val(sequence[row].time);
	$("#editRowValue").val(sequence[row].wrd);
	$("#editRowCommand").val(sequence[row].cmd);

	let editModal = $("#editModal");

    editModal.modal({backdrop: "static"});
    editModal.modal('show');
	
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

	return colorsAPI.colors().rgbToCIE1931(red, green, blue);
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
 * Query the light ID's connected to this Hue bridge
 * @param url API url
 * @returns {Promise<number>} Promise that, when fulfilled, contains the light ID's in array format on the bridge
 */
let getLightIDs = async function(url) {
    console.log("API Call: getLightIDs");
    let response = 0;
    await fetch(url).then(
        (resp) => resp.json().then(
            function(data) {
                return Object.keys(data);
    }));
    return response;
};

/**
 * Query the light ID's if not fetched yet.
 * @returns {Promise<number>} Promise that, when fulfilled, contains the light ID's in array format on the bridge
 */
async function getLocalLights() {
    if (localLights === undefined) {
        let lightIDs = [];
        let apiURL = "http://" + bridgeIP + "/api/" + username + "/lights";
        await getLightIDs(apiURL).then(lightIDsResponse =>
            // @ts-ignore
            lightIDs = lightIDsResponse);
        localLights = lightIDs;
    }

    return localLights;
}

/**
 * Sleep function, as written by StackOverflow user Dan Dascelescu at https://stackoverflow.com/a/39914235.
 * @param ms Timeout in milliseconds
 * @return promise that is only fulfilled after @param ms time
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Change the cmdTable to the associated page
 * @param id Page ID to be loaded
 */
function changePage(id) {
    let oldPageButton = $("#btnSelectPage" + currentPage);
    let newPageButton = $("#btnSelectPage" + id);

    let currentCmdTable = JSON.stringify(sequence);

    (<Page> pagesMap.get(currentPage)).setCommands(currentCmdTable);
    sequence = [];
    try {
        jsonSubmit((<Page> pagesMap.get(id)).getCommands())
    } catch (exception) {
        console.log("Tried to parse sequence for page ID " + id + ", but failed.");
    }

    oldPageButton.removeClass("btn-secondary");
    oldPageButton.addClass("btn-light");

    newPageButton.removeClass("btn-light");
    newPageButton.addClass("btn-secondary");

    currentPage = id;
}

/**
 * Initialize the map containing all Light objects.
 * This is to be run every time a sequence starts, to make sure all known lights are back at their init state.
 */
async function initLights() {
    lights = new TSMap();
    let lightIDs = [];
    await getLocalLights().then(response =>
        lightIDs = response);

    for (let index = 0; index < lightIDs.length; index++) {
        lights.set(lightIDs[index], new Light(lightIDs[index]));
    }
}