/**
 * @author Johan van Poppel ( https://github.com/jvpoppel/HueScripts )
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
var localLights;
var currentPage = 1;
var started = false;
var pagesMap = new Map();
var lights = new Map();
$(document).ready(function () {
    return __awaiter(this, void 0, void 0, function () {
        var i;
        return __generator(this, function (_a) {
            // First, initialize the pages map
            for (i = 1; i <= 6; i++) {
                pagesMap.set(i, new Page(i));
            }
            checkBridge();
            $("#btnEditDelete").on('click', function () {
                delRow();
            });
            $("#btnEditSubmit").on('click', function () {
                editRow();
            });
            return [2 /*return*/];
        });
    });
});
inputSound.onchange = function (e) {
    var sound = document.getElementById('sound');
    sound.src = URL.createObjectURL(this.files[0]);
    // not really needed in this exact case, but since it is really important in other cases,
    // don't forget to revoke the blobURI when you don't need it
    sound.onend = function (e) {
        URL.revokeObjectURL(this.src);
    };
};
/**
 * Change dropdown menu's based on light IDs on bridge
 */
function changeDropdownLightIDs() {
    return __awaiter(this, void 0, void 0, function () {
        var addRowLightSelect, editRowLightSelect, lightIDs, index, addOption, editOption;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    addRowLightSelect = document.getElementById("addRowLight");
                    editRowLightSelect = document.getElementById("editRowLight");
                    lightIDs = [];
                    return [4 /*yield*/, getLocalLights().then(function (response) {
                            return lightIDs = response;
                        })];
                case 1:
                    _a.sent();
                    console.log(lightIDs);
                    for (index = 0; index < lightIDs.length; index++) {
                        addOption = document.createElement("option");
                        editOption = document.createElement("option");
                        addOption.text = lightIDs[index];
                        editOption.text = lightIDs[index];
                        addRowLightSelect.add(addOption);
                        editRowLightSelect.add(editOption);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Function that gets all local bridges and stores the IPs in a dropdown menu.
 */
function getBridges() {
    var bSelect = $("#bridgeSelect");
    discoverBridges("https://discovery.meethue.com/").then(function (bridges) {
        for (var _i = 0, bridges_1 = bridges; _i < bridges_1.length; _i++) {
            bridge = bridges_1[_i];
            bSelect.append($('<option>', {
                value: bridge,
                text: bridge
            }));
        }
    });
}
/**
 * Function that checks if there already is a Philips Hue account.
 * If so: Do nothing.
 * Else: Start bridge connecting.
 */
function checkBridge() {
    if ((bridgeIP === null) || (username === null)) {
        getBridges();
        $('#ipModal').modal({ backdrop: "static" });
        $('#ipModal').modal('show');
    }
    else {
        bridge = hue.bridge(bridgeIP);
        user = bridge.user(username);
        changeDropdownLightIDs().then(function (r) { return console.log("Changed dropdown light IDs."); });
    }
}
/**
 * Function to store the selected IP, and initiate account creation.
 */
function modalSelectIP() {
    return __awaiter(this, void 0, void 0, function () {
        var fetchIP, linked;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fetchIP = $('#bridgeSelect :selected').text();
                    console.log(fetchIP);
                    localStorage.setItem("bridgeIP", fetchIP);
                    bridge = hue.bridge(fetchIP);
                    $('#ipModal').modal('hide');
                    $('#bridgeModal').modal({ backdrop: "static" });
                    $('#bridgeModal').modal('show');
                    linked = false;
                    _a.label = 1;
                case 1:
                    if (!!linked) return [3 /*break*/, 3];
                    return [4 /*yield*/, bridge.createUser('HueScriptsApp#Account').then(function (data) {
                            return __awaiter(this, void 0, void 0, function () {
                                var newUsername, error_1;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, 1, , 3]);
                                            newUsername = data[0].success.username;
                                            linked = true;
                                            console.log("username: " + newUsername);
                                            localStorage.setItem("bridgeUser", newUsername);
                                            user = bridge.user(newUsername);
                                            bridgeConnectSuccess();
                                            return [3 /*break*/, 3];
                                        case 1:
                                            error_1 = _a.sent();
                                            // To avoid DDoS-ing your hue bridge by spamming requests, implement 0.5s timeout here.
                                            console.log("Link button press not yet registered, wait 0.5s and try again.");
                                            return [4 /*yield*/, sleep(500)];
                                        case 2:
                                            _a.sent();
                                            return [3 /*break*/, 3];
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            });
                        })];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 1];
                case 3:
                    $('#bridgeModal').modal('hide');
                    // Change dropdown menu's based on the found bridge.
                    return [4 /*yield*/, changeDropdownLightIDs()];
                case 4:
                    // Change dropdown menu's based on the found bridge.
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Function to show the 'Bridge successfully connected' modal.
 */
function bridgeConnectSuccess() {
    $('#bridgeModal').modal('hide');
    $('#successModal').modal({ backdrop: "static" });
    $('#successModal').modal('show');
}
/**
 * Function that calls the modal on which the JSON input is present.
 */
function loadFnc() {
    $('#inputModal').modal({ backdrop: "static" });
    $('#inputModal').modal('show');
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
    }
    else {
        // Do nothing!
    }
}
/**
 * Separate load function to be used by Load modal.
 * Also checks for empty input
 */
function submitLoadModal() {
    var input = $('#inputArea').val();
    if (input !== 0) {
        jsonSubmit(input);
    }
}
/**
 * Function that parses inputted JSON sequence to an usable array.
 */
function jsonSubmit(input) {
    console.log("Parsing JSON Sequence: \n" + input);
    var arr = jQuery.parseJSON(input);
    sequence = $.map(arr, function (el) { return el; });
    sequence.sort(function (a, b) {
        return a.time - b.time;
    });
    console.log(sequence);
    createCmdTable();
}
function modalLightTest() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, createLightTable()];
                case 1:
                    _a.sent();
                    $("#lightModal").modal({ backdrop: "static" });
                    $("#lightModal").modal('show');
                    return [2 /*return*/];
            }
        });
    });
}
function createLightTable() {
    return __awaiter(this, void 0, void 0, function () {
        var divTable, lightIDs, content, lightIndex;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    divTable = $("#lightTable");
                    divTable.html("");
                    lightIDs = [];
                    return [4 /*yield*/, getLocalLights().then(function (response) {
                            return lightIDs = response;
                        })];
                case 1:
                    _a.sent();
                    console.log("light IDs = " + lightIDs);
                    content = "<table id=\"lightTable\">";
                    content += "<thead><tr><th>ID</th><th> </th><th> </th><th>Test button</th></tr></thead><tbody>";
                    for (lightIndex = 0; lightIndex < lightIDs.length; lightIndex++) {
                        content += "<tr><td>" + lightIDs[lightIndex] + "</td><td> </td><td> </td>";
                        content += "<td><button type=\"button\" id=\"lightTest_" + lightIDs[lightIndex] + "\" class=\"btn btn-info btn-sm\" onclick=\"testLight(" + lightIDs[lightIndex] + ");\"> Test Light";
                        content += "</button></td></tr>";
                    }
                    content += "</tbody></table>";
                    divTable.append(content);
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Function that sets the brightness of a light first to 50 then to 255
 * @param id Light ID
 */
function testLight(id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Test light " + id);
                    user.setLightState(id, { "bri": 10 });
                    return [4 /*yield*/, sleep(250)];
                case 1:
                    _a.sent();
                    user.setLightState(id, { "bri": 255 });
                    return [2 /*return*/];
            }
        });
    });
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
        var rEdit = $("#rowEdit_" + tableIndex);
        rEdit.attr("class", "btn btn-info btn-sm");
        rEdit.on('click', function () {
            var suffix = event.target.id.match(/\d+/);
            modifyRow(suffix[0], rEdit);
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
        $("#timer").html("Timer: " + time);
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
    }
    else {
        timeString = (time - (time % 10)) / 10 + "." + (time % 10);
    }
    $("#timer").html("Timer: " + timeString);
    if (lastExecuted < sequence.length) {
        async(checkCmd, function () {
        });
    }
    time = time + 1;
}
/**
 * @param fn Function to be executed with {@code time} as parameter.
 * @param callback Callback after {@code fn} has been executed.
 */
function async(fn, callback) {
    setTimeout(function () {
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
        }
        else {
            $("#row" + lastExecuted).addClass("table-info");
        }
        while (lastExecuted < sequence.length - 1) {
            if (sequence[lastExecuted].time == sequence[lastExecuted + 1].time) {
                ++lastExecuted;
                sendData.push(sequence[lastExecuted]);
                $("#row" + lastExecuted).addClass("table-info");
                $("#row" + (lastExecuted - 1)).removeClass("table-info");
            }
            else {
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
                body = { "bri": Number(wrd) };
                break;
            case "sat":
                body = { "sat": Number(wrd) };
                break;
            case "hue":
                body = { "hue": Number(wrd) };
                break;
            case "rgb":
                wrd = JSON.parse(wrd);
                body = { "xy": convertRGB(wrd[0], wrd[1], wrd[2]) };
                break;
            case "repeat":
                clearInterval(timeInterval);
                $("#row" + Number(lastExecuted - 1)).removeClass("table-info");
                time = 0;
                lastExecuted = 0;
                $("#timer").html("Timer: " + time);
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
    $("#rowModal").modal({ backdrop: "static" });
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
    sequence.sort(function (a, b) {
        return a.time - b.time;
    });
    createCmdTable();
}
/**
 * Function to edit the sequence on a selected row.
 */
function editRow() {
    editButton.unbind("click");
    $("#editModal").modal('hide');
    var row = $("#editRowID").val();
    sequence[row].light = $("#editRowLight").val();
    sequence[row].time = $("#editRowTime").val();
    sequence[row].wrd = $("#editRowValue").val();
    sequence[row].cmd = $('#editRowCommand :selected').text();
    sequence.sort(function (a, b) {
        return a.time - b.time;
    });
    createCmdTable();
}
/**
 * Function to delete a selected row.
 */
function delRow() {
    editButton.unbind("click");
    $("#editModal").modal('hide');
    var row = $("#editRowID").val();
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
    $("#editModal").modal({ backdrop: "static" });
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
var convertRGB = function (red, green, blue) {
    return colors.rgbToCIE1931(red, green, blue);
};
/**
 * Function to search the current network for bridges
 * @param url API url
 * @returns {Promise<[]>} Promise that, when fulfilled, contains all bridges.
 */
var discoverBridges = function (url) {
    return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("url: " + url);
                    response = [];
                    return [4 /*yield*/, fetch(url).then(function (resp) { return resp.json().then(function (data) {
                            for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                                var value = data_1[_i];
                                console.log("ip: " + value.internalipaddress);
                                response.push(value.internalipaddress);
                            }
                            return response;
                        }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/, response];
            }
        });
    });
};
/**
 * Query the light ID's connected to this Hue bridge
 * @param url API url
 * @returns {Promise<number>} Promise that, when fulfilled, contains the light ID's in array format on the bridge
 */
var getLightIDs = function (url) {
    return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("API Call: getLightIDs");
                    response = 0;
                    return [4 /*yield*/, fetch(url).then(function (resp) { return resp.json().then(function (data) {
                            response = Object.keys(data);
                            return response;
                        }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/, response];
            }
        });
    });
};
/**
 * Query the light ID's if not fetched yet.
 * @returns {Promise<number>} Promise that, when fulfilled, contains the light ID's in array format on the bridge
 */
function getLocalLights() {
    return __awaiter(this, void 0, void 0, function () {
        var lightIDs_1, apiURL;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(localLights === undefined)) return [3 /*break*/, 2];
                    lightIDs_1 = [];
                    apiURL = "http://" + bridgeIP + "/api/" + username + "/lights";
                    return [4 /*yield*/, getLightIDs(apiURL).then(function (response) {
                            return lightIDs_1 = response;
                        })];
                case 1:
                    _a.sent();
                    localLights = lightIDs_1;
                    _a.label = 2;
                case 2: return [2 /*return*/, localLights];
            }
        });
    });
}
/**
 * Sleep function, as written by StackOverflow user Dan Dascelescu at https://stackoverflow.com/a/39914235.
 * @param ms Timeout in milliseconds
 * @return promise that is only fulfilled after @param ms time
 */
function sleep(ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
}
/**
 * Change the cmdTable to the associated page
 * @param id Page ID to be loaded
 */
function changePage(id) {
    var oldPageButton = $("#btnSelectPage" + currentPage);
    var newPageButton = $("#btnSelectPage" + id);
    var currentCmdTable = JSON.stringify(sequence);
    pagesMap.get(currentPage).setCommands(currentCmdTable);
    sequence = [];
    try {
        jsonSubmit(pagesMap.get(id).getCommands());
    }
    catch (exception) {
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
function initLights() {
    return __awaiter(this, void 0, void 0, function () {
        var lightIDs, index;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    lights = new Map();
                    lightIDs = [];
                    return [4 /*yield*/, getLocalLights().then(function (response) {
                            return lightIDs = response;
                        })];
                case 1:
                    _a.sent();
                    for (index = 0; index < lightIDs.length; index++) {
                        lights.set(lightIDs[index], new Light(lightIDs[index]));
                    }
                    return [2 /*return*/];
            }
        });
    });
}
