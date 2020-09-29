import {InputField} from "../InputField";
import {WebElements} from "../../../static/webElements";
import {FEBaseCommand} from "./FEBaseCommand";

export class FEBrightnessCommand {


    private brightnessLevel: InputField;
    private transitionTime: InputField;
    private time: number;
    private light: number;


    private static instance: FEBrightnessCommand;

    private constructor() {
        this.brightnessLevel = new InputField('Brightness:', WebElements.MODAL_BRIGHTNESS_INPUT(), 0);
        this.transitionTime = new InputField('Transition time:', WebElements.MODAL_TRANSITION_INPUT(), 0);
        this.time = 0;
        this.light = 1;
    }

    public static get(): FEBrightnessCommand {
        if (this.instance == null) {
            this.instance = new FEBrightnessCommand();
        }
        return this.instance;
    }

    public content(): string {
        FEBaseCommand.get().updateTime(this.time).updateLight(this.light);

        let result: string = FEBaseCommand.get().beginOfForm();
        result +='       <div class="row">\n' +
            '                <div class="col-md-4 text-right">\n' +
            '                    <label>' + this.brightnessLevel.label() + '</label>\n' +
            '                </div>\n' +
            '                <div class="col-md-2 text-left">\n' +
            '                    <input class="rowInput" type="number" min="0" max="255" value="' + this.brightnessLevel.value() + '" id="commandBrightnessInput">\n' +
            '                </div>\n' +
            '                <div class="col-md-6"></div>\n' +
            '            </div>\n' +
            '            <div class="row">\n' +
            '                <div class="col-md-4 text-right">\n' +
            '                    <label>' + this.transitionTime.label() + '</label>\n' +
            '                </div>\n' +
            '                <div class="col-md-2 text-left">\n' +
            '                    <input class="rowInput" type="number" min="0" max="255" value="' + this.transitionTime.value() + '" id="commandTransitionInput">\n' +
            '                </div>\n' +
            '                <div class="col-md-6"></div>\n' +
            '            </div>\n' +
            '        </div>'

        return result;
    }

    public updateLight(light: number): FEBrightnessCommand {
        this.light = light;
        return this;
    }

    public updateTime(time: number): FEBrightnessCommand {
        this.time = time;
        return this;
    }
}
