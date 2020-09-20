import {WebElements} from "../static/webElements";
import {BaseModal} from "../static/baseModal";
import {HueLink} from "./hueLink";
import {LocalStorage} from "../static/localStorage";
import {HueAccount} from "./hueAccount";

export class HueAPIService {

    private static async discoverBridges(url: string) {
        console.log("url: " + url);
        let response = [];
        await fetch(url).then(
            (resp) => resp.json().then(
                function (data) {
                    for (const value of data) {
                        console.log("discovered bridge on ip: " + value.internalipaddress);
                        response.push(value.internalipaddress);
                    }
                    return response;
                }));
        return response;
    }

    public static fetchAllBridges() {
        let bridgeSelect = WebElements.BRIDGE_SELECT_DROPDOWN;
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

    public static async createAccountOnIP() {
        LocalStorage.setBridgeIP(WebElements.BRIDGE_SELECTED_IP.text());
        BaseModal.hide(WebElements.IP_MODAL);
        BaseModal.show(WebElements.BRIDGE_LINK);

        let bridge = HueLink.getHue().bridge(HueAccount.ip());

        let linked = false;
        while (!linked) { // Keeps looping until an username has been correctly fetched and set.
            await bridge.createUser('HueScriptsApp#Account').then(async function(data) {
                try {
                    let newUsername = data[0].success.username;
                    linked = true;
                    console.log("username: " + newUsername);
                    LocalStorage.setBridgeUser(newUsername);
                    HueLink.getHue().bridge.user(newUsername);
                } catch (error) {
                    // To avoid DDoS-ing your hue bridge by spamming requests, implement 0.5s timeout here.
                    console.log("Link button press not yet registered, wait 0.5s and try again.");
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
            });
        }


        BaseModal.hide(WebElements.BRIDGE_LINK);
        BaseModal.show(WebElements.BRIDGE_SUCCESS);
    }
}
