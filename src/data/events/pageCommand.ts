/**
 * @author Johan van Poppel ( https://github.com/jvpoppel/HueScripts )
 */

import { CommandType, LightCommand } from "./lightCommand";
import {HueAPIService} from "../../service/hueAPIService";
import {Logger} from "../../util/logger";

/**
 * HueScripts PageCommand Class
 * Implementation of the LightCommand interface, referencing another page to add all commands from starting at the specified time.
 */
export class PageCommand implements LightCommand {
    values: any[];
    executed: boolean;
    light: number; // Not used in this command and thus will be null.
    type: CommandType;
    forTest: boolean;

    constructor(values: any[], forTest: boolean = false) {
        if (values.length != 1) {
            throw Error("PageCommand had invalid amount of values");
        }
        this.values = values;
        this.executed = false;
        this.type = CommandType.PAGE;
        this.forTest = forTest;

        if (forTest) {
            Logger.getLogger().warn("PageCommand created for testing.");
        }
    }

    /**
     * Execute command will not do anything when executed.
     * This because the command will be "executed" on Queue parsing.
     */
    public execute(): boolean {
        // If already executed, don't do anything;
        if (this.executed) {
            return false;
        }
        this.executed = true;

        return true;

    }

    public formattedValuesWithoutTransition(): string {
        return "" + this.values[0];
    }

    public getTransitionTime(): string {
        return "";
    }

    public reset(): void {
        this.executed = false;
    }

    public toString(): string {
        return "PageCommand for page |" + this.values[0] +  "|, executed |" + this.executed + "|";
    }

}
