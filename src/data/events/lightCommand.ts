/**
 * @author Johan van Poppel ( https://github.com/jvpoppel/HueScripts )
 */
export enum CommandType {
    BRIGHTNESS,
    SATURATION,
    HUE,
    RGB
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
}