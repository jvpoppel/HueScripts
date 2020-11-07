/**
 * @author Johan van Poppel ( https://github.com/jvpoppel/HueScripts )
 */
import {Light} from "../../model/light";

export enum CommandType {
    BRIGHTNESS,
    COLOR,
    ON,
    OFF
}
/**
 * HueScripts LightCommand interface
 * A command is a combination of a light ID, command Type and arguments.
 */
export interface LightCommand {

    type: CommandType;
    light: number;
    values: Array<number>;
    executed: boolean;

    execute();

    reset();

    toString(): string;
}
