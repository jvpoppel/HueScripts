var hue = jsHue(); //Instance of Hue
var bridge = null;


$(document).ready(function() {
    getBridges();
});

function getBridges() {

    var bSelect = $("#bridgeSelect");
    var index;

    hue.discover().then(bridges => {
        if(bridges.length === 0) {
        console.log('No bridges found. :(');
        } else {
            //bridges.forEach(b => console.log('Bridge found at IP address %s.', b.internalipaddress));
            //bridges.forEach(b => fndBridges.push(b.internalipaddress));
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
