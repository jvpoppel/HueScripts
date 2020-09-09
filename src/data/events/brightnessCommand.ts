/**
 * @author Johan van Poppel ( https://github.com/jvpoppel/HueScripts )
 */

import {CommandType, LightCommand} from "./lightCommand";

/**
 * HueScripts BrightnessCommand Class
 * Implementation of the LightCommand interface, specifying a brightness change for a light
 */
export class BrightnessCommand implements LightCommand {
    values: Array<number>;
    executed: boolean;
    light: number;
    type: CommandType;

    constructor(light: number, values: Array<number>) {
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

    }

}