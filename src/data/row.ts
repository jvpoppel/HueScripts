/**
 * @author Johan van Poppel ( https://github.com/jvpoppel/HueScripts )
 */

import {CommandType, LightCommand} from "./events/lightCommand";
import {Logger} from "../util/logger";
import {ElementId} from "../util/elementId";
import {ColorCommand} from "./events/colorCommand";
import {WebElements} from "../static/webElements";
import {PageCommand} from "./events/pageCommand";

/**
 * HueScripts Row Class
 * A row is a combination of a command and a time
 */
export class Row {

    private readonly time: number;
    private readonly command: LightCommand;
    private readonly elementId: string;

    constructor(time: number, command: LightCommand) {

        this.time = time;
        this.command = command;
        this.elementId = ElementId.generate("Row");

        Logger.getLogger().info("Added new row: " + time + ", " + command.light + ", " + command.type.toString() + ", "+ command.values.toString());
    }

    public getCommand(): LightCommand {
        return this.command;
    }

    public getTime(): number {
        return this.time;
    }

    public getElementId(): string {
        return this.elementId;
    }

    public html(): string {
        let light: string = "";
        if (this.command.light != undefined) {
            if (this.command.light == -1) {
                light = "All";
            } else {
                light += this.command.light;
            }
        }

        let style: string = "style=''";

        if (this.command.type == CommandType.COLOR) {
            let originalValues: number[] = (this.command as ColorCommand).getOriginalValues();
            style = "style='background-color:rgb({0}, {1}, {2});'";
            style = style.replace("{0}", String(originalValues[0]));
            style = style.replace("{1}", String(originalValues[1]));
            style = style.replace("{2}", String(originalValues[2]));
        }

        return  "<tr id='" + this.elementId + "' " + style + ">" +
            "<td>" + this.getTime() + "</td>" +
            "<td>" + light + "</td>" +
            "<td>" + this.command.type + "</td>" +
            "<td>" + this.command.formattedValuesWithoutTransition() + "</td>" +
            "<td>" + this.command.getTransitionTime() + "</td>" +
            "<td><button type=\"button\" class=\"btn btn-success\" id=\"rowEdit_"+this.elementId+"\">Edit</button></td>" +
            "<td><button type=\"button\" class=\"btn btn-dark\" id=\"rowDel_"+this.elementId+"\">Delete</button></td>" +
            "</tr>";
    }

    public fillInCommandModal(): void {
        WebElements.MODAL_TIME_INPUT().get()[0].value = String(this.time);

        // Set light checkbox / select dropdown based on command type
        if (this.command.type === CommandType.ON || this.command.type === CommandType.OFF || this.command.type === CommandType.BRIGHTNESS || this.command.type === CommandType.COLOR) {
            if(this.command.light == -1) {
                WebElements.MODAL_LIGHT_ALLLIGHTS().get()[0].checked = true;
            } else {
                WebElements.MODAL_LIGHT_ALLLIGHTS().get()[0].checked = false;
                WebElements.MODAL_LIGHT_INPUT().get()[0].value = String(this.command.light);
            }
        }

        // Set transition time based on command type
        if (this.command.type === CommandType.BRIGHTNESS || this.command.type === CommandType.COLOR) {
            WebElements.MODAL_TRANSITION_INPUT().get()[0].value = String(this.command.getTransitionTime());
        }

        // Set 'Page' value based on command type
        if (this.command.type === CommandType.PAGE) {
            WebElements.MODAL_PAGE_INPUT().get()[0].value = String(this.command.values[0]);
        }

        // Set 'Brightness' value based on command type
        if (this.command.type === CommandType.BRIGHTNESS) {
            WebElements.MODAL_BRIGHTNESS_INPUT().get()[0].value = String(this.command.values[0]);
        }

        // Set RGB values based on command type
        if (this.command.type === CommandType.COLOR) {
            WebElements.MODAL_RED_INPUT().get()[0].value = String((this.command as ColorCommand).getOriginalValues()[0]);
            WebElements.MODAL_GREEN_INPUT().get()[0].value = String((this.command as ColorCommand).getOriginalValues()[1]);
            WebElements.MODAL_BLUE_INPUT().get()[0].value = String((this.command as ColorCommand).getOriginalValues()[2]);
        }
    }
}
