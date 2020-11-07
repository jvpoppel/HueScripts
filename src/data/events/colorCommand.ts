/**
 * @author Johan van Poppel ( https://github.com/jvpoppel/HueScripts )
 */

import { CommandType, LightCommand } from "./lightCommand";
import { HueLink } from "../../service/hueLink";
import { Light } from "../../model/light";
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

    constructor(light: number, values: any) {
        this.light = light;
        this.values = values;
        this.executed = false;
        this.type = CommandType.COLOR;
    }

    public execute(): void {
        // If already executed, don't do anything;
        if (this.executed) {
            return;
        }
        this.executed = true;

        let payload = {"xy": [+this.values[0], +this.values[1]], "transitiontime": +this.values[2]};

        Logger.getLogger().debug("Send payload " + JSON.stringify(payload) + " to light " + this.light);

        HueAPIService.setLightState(this.light, JSON.stringify(payload));
    }

    public reset(): void {
        this.executed = false;
    }

    public toString(): string {
        return "ColorCommand for light |" + this.light + "|, values |" + this.values.toString() + "|, executed |" + this.executed + "|";
    }
}
