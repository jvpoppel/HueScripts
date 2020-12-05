/**
 * @author Johan van Poppel ( https://github.com/jvpoppel/HueScripts )
 */

import { CommandType, LightCommand } from "./lightCommand";
import {HueAPIService} from "../../service/hueAPIService";
import {Logger} from "../../util/logger";

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
        if (values.length > 1) {
            throw Error("OnCommand had too many values");
        }
        this.light = light;
        this.values = values;
        this.type = CommandType.ON;
        this.forTest = forTest;

        // Length can only be 0 or 1 because of validation in constructor.
        if (this.values.length == 0) {
            this.transitionTime = "";
        } else {
            this.transitionTime = "" + this.values[0];
        }

        if (forTest) {
            Logger.getLogger().warn("OnCommand created for testing.");
        }
    }

    public execute(): boolean {

        let payload;

        // Length can only be 0 or 1 because of validation in constructor.
        if (this.values.length == 0) {
            payload = {"on": true};
        } else {
            payload = {"on": true, "transitiontime": +this.values[0]};
        }


        Logger.getLogger().debug("Send payload " + JSON.stringify(payload) + " to light " + this.light);

        // In testing, exclude the API service as this will not work.
        if (!this.forTest) {
            HueAPIService.setLightState(this.light, JSON.stringify(payload));
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
        return "OnCommand for light |" + this.light + "|, values |" + this.values.toString();
    }

}
