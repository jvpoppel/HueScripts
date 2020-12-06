/**
 * @author Johan van Poppel ( https://github.com/jvpoppel/HueScripts )
 */

import { LightCommand } from "./events/lightCommand";
import {Logger} from "../util/logger";

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

        Logger.getLogger().info("Added new row: " + time + ", " + command.light + ", " + command.type.toString() + ", "+ command.values.toString());
    }

    public getCommand(): LightCommand {
        return this.command;
    }

    public getTime(): number {
        return this.time;
    }
}
