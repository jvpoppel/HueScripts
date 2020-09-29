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
    values: any;
    executed: boolean;
    light: Light;
    type: CommandType;

    constructor(light: Light, values: any) {
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

        let payload = {"bri": +this.values};

        Logger.getLogger().debug("Send payload " + JSON.stringify(payload) + " to light " + this.light.getID());

        HueAPIService.setLightState(this.light.getID(), JSON.stringify(payload));

    }

}
