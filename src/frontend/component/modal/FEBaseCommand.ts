import {InputField} from "../InputField";
import {WebElements} from "../../../static/webElements";
import {CommandType} from "../../../data/events/lightCommand";
import {Session} from "../../../static/session";
import {CommandInput} from "../../../model/commandInput";
import {FEBrightnessCommand} from "./FEBrightnessCommand";
import {FEColorCommand} from "./FEColorCommand";
import {BaseModal} from "../../../static/baseModal";
import {FEPageCommand} from "./FEPageCommand";
import {FEOnCommand} from "./FEOnCommand";
import {FEOffCommand} from "./FEOffCommand";

export class FEBaseCommand {

    private time: InputField;
    private light: InputField;
    private allLights: InputField;
    private currentCommandType: CommandType;
    private lightsSelect: string;

    private static instance: FEBaseCommand;

    private constructor() {
        this.time = new InputField('Time:', WebElements.MODAL_TIME_INPUT(), 0);
        this.light = new InputField('Light ID:', WebElements.MODAL_LIGHT_INPUT(), null);
        this.allLights = new InputField('All lights', WebElements.MODAL_LIGHT_ALLLIGHTS(), false);
        this.lightsSelect = this.generateLightsID();

        WebElements.COMMAND_MODAL_SUBMIT.get()[0].addEventListener("click", (e:Event) => FEBaseCommand.submit());
    }

    public static get() {
        if (this.instance == null) {
            this.instance = new FEBaseCommand();
        }
        return this.instance;
    }

    private generateLightsID(): string {
        let result = '';
        Session.get().lights().forEach(function(lightID) {
            result += '<option>' + lightID + '</option>';
        });
        return result;
    }

    public beginOfForm(withoutLightID: boolean = false): string {
        let result: string = "";

        result += '<div class="container-fluid">\n' +
            '            <div class="row">\n' +
            '                <div class="col-md-4 text-right">\n' +
            '                    <label>' + this.time.label() + '</label>\n' +
            '                </div>\n' +
            '                <div class="col-md-2 text-left">\n' +
            '                    <input class="rowInput" type="number" min="0" max="999999" value="' + this.time.value() + '" id="commandTimeInput">\n' +
            '                </div>\n' +
            '                <div class="col-md-6"></div>\n' +
            '            </div>\n';
        if (withoutLightID) {
            return result;
        }
        result += '      <div class="row">\n' +
            '                <div class="col-md-4 text-right">\n' +
            '                    <label>' + this.light.label() + '</label>\n' +
            '                </div>\n' +
            '                <div class="col-md-2 text-left">\n' +
            '                    <select class="rowInput" id="commandLightInput">' + this.lightsSelect + '</select>\n' +
            '                </div>\n' +
            '                <div class="col-md-3 text-right">\n' +
            '                    <label>' + this.allLights.label() + '</label>\n' +
            '                </div>\n' +
            '                <div class="col-md-2 text-left">\n' +
            '                    <input type="checkbox" id="commandLightAllLights">\n' +
            '                </div>\n' +
            '                <div class="col-md-1"></div>\n' +
            '            </div>\n';

        return result;
    }

    public updateTime(time: number): FEBaseCommand {
        this.time.setValue(time);
        return this;
    }

    public updateLight(light: number): FEBaseCommand {
        this.light.setValue(light);
        return this;
    }

    public and(): FEBaseCommand {
        return this;
    }

    public setCommandType(type: CommandType): FEBaseCommand {
        this.currentCommandType = type;
        return this;
    }

    public finally(): FEBaseCommand {
        return this;
    }

    public setFieldContents(): FEBaseCommand {
        WebElements.MODAL_TIME_INPUT().val(this.time.value());
        WebElements.MODAL_LIGHT_INPUT().val(this.light.value());
        return this;
    }

    /**
     * Return an array in form [TIME, LIGHT_ID] based on current input
     */
    public parse(): number[] {
        let inputTime: number = <number> WebElements.MODAL_TIME_INPUT().val();

        let inputLight: number;
        if (WebElements.MODAL_LIGHT_ALLLIGHTS().is(":checked")) {
            inputLight = -1; // For now; light -1 = ALL
        } else {
            inputLight = <number>WebElements.MODAL_LIGHT_INPUT().val();
        }

        return [inputTime, inputLight];
    }

    public static submit(): void {
        let commandType = Session.get().commandModalInputType();
        let initialData: number[] = FEBaseCommand.get().parse();
        let newCommand = new CommandInput().setTime(initialData[0]).setLight(initialData[1]).setType(commandType);

        let success = false;

        switch (commandType) {
            case CommandType.BRIGHTNESS:
                let specificData_brightness = FEBrightnessCommand.get().parse();
                newCommand.setBrightness(specificData_brightness[0]).setTransition(specificData_brightness[1]);
                success = newCommand.submit();
                break;
            case CommandType.COLOR:
                let specificData_color = FEColorCommand.get().parse();
                newCommand.setRed(specificData_color[0]).setGreen(specificData_color[1]).setBlue(specificData_color[2]).setTransition(specificData_color[3]);
                success = newCommand.submit();
                break;
            case CommandType.PAGE:
                let specificData_page = FEPageCommand.get().parse();
                newCommand.setPage(specificData_page[0]);
                success = newCommand.submit();
                break;
            case CommandType.ON:
                let specificData_on = FEOnCommand.get().parse();
                newCommand.setTransition(specificData_on[0]);
                success = newCommand.submit();
                break;
            case CommandType.OFF:
                let specificData_off = FEOffCommand.get().parse();
                newCommand.setTransition(specificData_off[0]);
                success = newCommand.submit();
                break;
        }

        if (!success) {
            alert("Not all fields have valid input. Please check and try again.");
            return;
        } else {
            BaseModal.hide(WebElements.COMMAND_MODAL);
        }
    }
}
