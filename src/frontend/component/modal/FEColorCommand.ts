import {InputField} from "../InputField";
import {WebElements} from "../../../static/webElements";
import {FEBaseCommand} from "./FEBaseCommand";
import {CommandType} from "../../../data/events/lightCommand";
import {Logger} from "../../../util/logger";

export class FEColorCommand {

    private time: number;
    private redLevel: InputField;
    private greenLevel: InputField;
    private blueLevel: InputField;
    private transitionTime: InputField;
    private light: number;

    private static instance: FEColorCommand;

    private constructor() {
        this.time = 0;
        this.redLevel = new InputField('Red', WebElements.MODAL_RED_INPUT(), 0);
        this.greenLevel = new InputField('Green', WebElements.MODAL_GREEN_INPUT(), 0);
        this.blueLevel = new InputField('Blue', WebElements.MODAL_BLUE_INPUT(), 0);
        this.transitionTime = new InputField('Transition time:', WebElements.MODAL_TRANSITION_INPUT(), 0);
        this.light = 1;
    }

    public static get(): FEColorCommand {
        if (this.instance == null) {
            this.instance = new FEColorCommand();
        }
        return this.instance;
    }

    public content(): string {
        FEBaseCommand.get().updateTime(this.time).updateLight(this.light).and().setCommandType(CommandType.COLOR);
        let result: string = FEBaseCommand.get().beginOfForm();

        result +='       <div class="row">\n' +
            '                <div class="col-md-4 text-right">\n' +
            '                    <label>' + this.redLevel.label() + ', ' + this.greenLevel.label() +', ' + this.blueLevel.label() +':</label>\n' +
            '                </div>\n' +
            '                <div class="col-md-1 text-left">\n' +
            '                    <input class="rowInput" type="number" min="0" max="255" value="' + this.redLevel.value() + '" id="commandRedInput">' +
            '                </div><div class="col-md-1 text-left">\n' +
            '                    <input class="rowInput" type="number" min="0" max="255" value="' + this.greenLevel.value() + '" id="commandGreenInput">' +
            '                </div><div class="col-md-1 text-left">\n' +
            '                    <input class="rowInput" type="number" min="0" max="255" value="' + this.blueLevel.value() + '" id="commandBlueInput">\n' +
            '                </div>\n' +
            '                <div class="col-md-5"></div>\n' +
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

    public setFieldContents(): FEColorCommand {
        FEBaseCommand.get().setFieldContents();
        WebElements.MODAL_RED_INPUT().val(this.redLevel.value());
        WebElements.MODAL_GREEN_INPUT().val(this.greenLevel.value());
        WebElements.MODAL_BLUE_INPUT().val(this.blueLevel.value());
        WebElements.MODAL_TRANSITION_INPUT().val(this.transitionTime.value());
        return this;
    }

    public parse(): number[] {
        let inputRed = <number> WebElements.MODAL_RED_INPUT().val();
        let inputGreen = <number> WebElements.MODAL_GREEN_INPUT().val();
        let inputBlue = <number> WebElements.MODAL_BLUE_INPUT().val();
        let inputTransition = <number> WebElements.MODAL_TRANSITION_INPUT().val();

        return [inputRed, inputGreen, inputBlue, inputTransition];


    }
}
