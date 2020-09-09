/**
 * @author Johan van Poppel ( https://github.com/jvpoppel/HueScripts )
 */

import { LightCommand } from "./events/lightCommand";

/**
 * HueScripts Row Class
 * A row is a combination of a command and a time
 */
export class Row {

    private readonly time: number;
    private readonly command: LightCommand;

    constructor(time: number, command: LightCommand) {

        this.time = time;
        this.command = command;
    }

    public getCommand(): LightCommand {
        return this.command;
    }

    public getTime(): number {
        return this.time;
    }
}