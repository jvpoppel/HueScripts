/**
 * @author Johan van Poppel ( https://github.com/jvpoppel/HueScripts )
 */

import { CommandType, LightCommand } from "./lightCommand";
import { HueLink } from "../../service/hueLink";
import { Light } from "../../model/light";
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

    constructor(light: number, values: any[]) {
        this.light = light;
        this.values = values;
        this.executed = false;
        this.type = CommandType.BRIGHTNESS;
    }

    public execute(): void {
        // If already executed, don't do anything;
        if (this.executed) {
            return;
        }
        this.executed = true;

        let payload = {"bri": +this.values[0], "transitiontime": +this.values[1]};

        Logger.getLogger().debug("Send payload " + JSON.stringify(payload) + " to light " + this.light);

        HueAPIService.setLightState(this.light, JSON.stringify(payload));

    }

    public reset(): void {
        this.executed = false;
    }

    public toString(): string {
        return "BrightnessCommand for light |" + this.light + "|, values |" + this.values.toString() + "|, executed |" + this.executed + "|";
    }

}
