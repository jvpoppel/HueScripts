/**
 * @author Johan van Poppel ( https://github.com/jvpoppel/HueScripts )
 */

import { CommandType, LightCommand } from "./lightCommand";
import { HueLink } from "../../service/hueLink";
import { Light } from "../../model/light";

/**
 * HueScripts BrightnessCommand Class
 * Implementation of the LightCommand interface, specifying a brightness change for a light
 */
export class BrightnessCommand implements LightCommand {
    values: Array<number>;
    executed: boolean;
    light: Light;
    type: CommandType;

    constructor(light: Light, values: Array<number>) {
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

        let payload = {"bri": this.values[0]};

        HueLink.getInstance().sendCommand(this.light.getID(), payload);
        this.light.setBrightness(this.values[0]);

    }

}