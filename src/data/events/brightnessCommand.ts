/**
 * @author Johan van Poppel ( https://github.com/jvpoppel/HueScripts )
 */

import { CommandType, LightCommand } from "./lightCommand";
import {HueAPIService} from "../../service/hueAPIService";
import {Logger} from "../../util/logger";

/**
 * HueScripts BrightnessCommand Class
 * Implementation of the LightCommand interface, specifying a brightness change for a light
 */
export class BrightnessCommand implements LightCommand {
    values: any[];
    executed: boolean;
    light: number;
    type: CommandType;
    forTest: boolean;

    constructor(light: number, values: any[], forTest: boolean = false) {
        if (values.length == 0) {
            throw Error("BrightnessCommand had no values");
        }
        if (values.length > 2) {
            throw Error("BrightnessCommand had too many values");
        }
        this.light = light;
        this.values = values;
        this.executed = false;
        this.type = CommandType.BRIGHTNESS;
        this.forTest = forTest;

        if (forTest) {
            Logger.getLogger().warn("BrightnessCommand created for testing.");
        }
    }

    public execute(): boolean {
        // If already executed, don't do anything;
        if (this.executed) {
            return false;
        }
        this.executed = true;

        let payload;

        // Length can only be 1 or 2 because of validation in constructor.
        if (this.values.length == 1) {
            payload = {"bri": +this.values[0]};
        } else {
            payload = {"bri": +this.values[0], "transitiontime": +this.values[1]};
        }


        Logger.getLogger().debug("Send payload " + JSON.stringify(payload) + " to light " + this.light);

        // In testing, exclude the API service as this will not work.
        if (!this.forTest) {
            HueAPIService.setLightState(this.light, JSON.stringify(payload));
        }

        return true;

    }

    public reset(): void {
        this.executed = false;
    }

    public toString(): string {
        return "BrightnessCommand for light |" + this.light + "|, values |" + this.values.toString() + "|, executed |" + this.executed + "|";
    }

}
