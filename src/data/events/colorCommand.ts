/**
 * @author Johan van Poppel ( https://github.com/jvpoppel/HueScripts )
 */

import { CommandType, LightCommand } from "./lightCommand";
import {HueAPIService} from "../../service/hueAPIService";
import {Logger} from "../../util/logger";

/**
 * HueScripts ColorCommand Class
 * Implementation of the LightCommand interface, specifying a color change for a light
 */
export class ColorCommand implements LightCommand {
    values: any;
    executed: boolean;
    light: number;
    type: CommandType;
    forTest: boolean;

    constructor(light: number, values: any, forTest: boolean = false) {
        this.light = light;
        this.values = values;
        this.executed = false;
        this.type = CommandType.COLOR;
        this.forTest = forTest;

        if (forTest) {
            Logger.getLogger().warn("ColorCommand created for testing.");
        }
    }

    public execute(): boolean {
        // If already executed, don't do anything;
        if (this.executed) {
            return false;
        }
        this.executed = true;

        let payload = {"xy": [+this.values[0], +this.values[1]], "transitiontime": +this.values[2]};

        Logger.getLogger().debug("Send payload " + JSON.stringify(payload) + " to light " + this.light);

        // In testing, exclude the API service
        if (!this.forTest) {
            HueAPIService.setLightState(this.light, JSON.stringify(payload));
        }

        return true;
    }

    public reset(): void {
        this.executed = false;
    }

    public toString(): string {
        return "ColorCommand for light |" + this.light + "|, values |" + this.values.toString() + "|, executed |" + this.executed + "|";
    }
}
