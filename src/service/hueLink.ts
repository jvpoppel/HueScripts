import * as jsHue from "../../lib/jshue.js";
import {LocalStorage} from "../static/localStorage";

export class HueLink {

    private static hue = jsHue(); //Instance of Hue
    private static instance: HueLink;

    bridgeIP: string;
    username: string;
    bridge: any;
    user: any;

    private constructor() {
        this.bridgeIP = LocalStorage.bridgeIP();
        this.username = LocalStorage.bridgeUser();
        this.bridge = HueLink.hue.bridge(this.bridgeIP);
        this.user = this.bridge.user(this.username);
    }

    public static getInstance(): HueLink {
        if (HueLink.instance == null) {
            HueLink.instance = new HueLink();
        }
        return HueLink.instance;
    }

    public static getHue() {
        return HueLink.hue;
    }

    public sendCommand(light: number, payload: any): HueLink {
        this.user.setLightState(light, payload);
        return this;
    }
}