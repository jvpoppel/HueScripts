/**
 * @author Johan van Poppel ( https://github.com/jvpoppel/HueScripts )
 */

import { CommandType, LightCommand } from "./lightCommand";
import {HueAPIService} from "../../service/hueAPIService";
import {Logger} from "../../util/logger";
import {Session} from "../../static/session";

/**
 * HueScripts OnCommand Class
 * Implementation of the LightCommand interface, specifying a light that should turn on
 */
export class OnCommand implements LightCommand {
    values: any[];
    light: number;
    type: CommandType;
    forTest: boolean;
    transitionTime: string;

    constructor(light: number, values: any[], forTest: boolean = false) {
        if (values.length > 0) {
            throw Error("OnCommand had too many values");
        }
        this.light = light;
        this.values = values;
        this.type = CommandType.ON;
        this.forTest = forTest;

        this.transitionTime = "";

        if (forTest) {
            Logger.getLogger().warn("OnCommand created for testing.");
        }
    }

    public execute(): boolean {

        let payload = {"on": true};


        Logger.getLogger().debug("Send payload " + JSON.stringify(payload) + " to light " + this.light);

        // In testing, exclude the API service as this will not work.
        if (!this.forTest) {
            if (this.light == -1) {
                Session.get().lights().forEach(value => HueAPIService.setLightState(value.getID(), JSON.stringify(payload)));
            } else {
                HueAPIService.setLightState(this.light, JSON.stringify(payload));
            }
        }

        return true;
    }

    public formattedValuesWithoutTransition(): string {
        return "";
    }

    public getTransitionTime(): string {
        return this.transitionTime;
    }

    public toString(): string {
        return "OnCommand for light |" + this.light + "|";
    }

}
