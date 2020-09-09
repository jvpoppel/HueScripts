import * as jsHue from "../../lib/jshue.js";

export class HueLink {

    private static instance: HueLink;

    bridgeIP: string;
    username: string;
    hue = jsHue(); //Instance of Hue
    bridge: any;
    user: any;

    private constructor() {
        this.bridgeIP = localStorage.getItem("bridgeIP");
        this.username = localStorage.getItem("bridgeUser");
        this.bridge = this.hue.bridge(this.bridgeIP);
        this.user = this.bridge.user(this.username);
    }

    public static getInstance(): HueLink {
        if (HueLink.instance == null) {
            HueLink.instance = new HueLink();
        }
        return HueLink.instance;
    }

    public sendCommand(light: number, payload: any): HueLink {
        this.user.setLightState(light, payload);
        return this;
    }
}