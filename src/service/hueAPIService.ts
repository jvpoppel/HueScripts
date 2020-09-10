import {WebElements} from "../static/webElements";

export class hueAPIService {

    private static async discoverBridges(url: string) {
        console.log("url: " + url);
        let response = [];
        await fetch(url).then(
            (resp) => resp.json().then(
                function (data) {
                    for (const value of data) {
                        console.log("ip: " + value.internalipaddress);
                        response.push(value.internalipaddress);
                    }
                    return response;
                }));
        return response;
    }

    public static fetchAllBridges() {
        let bridgeSelect = WebElements.BRIDGE_SELECT_IP_SELECT;
        this.discoverBridges("https://discovery.meethue.com/").then(bridges => {
                for (let bridge of bridges) {
                    bridgeSelect.append($('<option>', {
                        value: bridge,
                        text: bridge
                    }));
                }
            }
        )
    }
}