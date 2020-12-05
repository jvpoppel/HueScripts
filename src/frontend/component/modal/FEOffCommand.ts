import {InputField} from "../InputField";
import {WebElements} from "../../../static/webElements";
import {FEBaseCommand} from "./FEBaseCommand";
import {CommandType} from "../../../data/events/lightCommand";
import {Logger} from "../../../util/logger";

export class FEOffCommand {
    private transitionTime: InputField;
    private time: number;
    private light: number;


    private static instance: FEOffCommand;

    private constructor() {
        this.transitionTime = new InputField('Transition time:', WebElements.MODAL_TRANSITION_INPUT(), 0);
        this.time = 0;
        this.light = 1;
    }

    public static get(): FEOffCommand {
        if (this.instance == null) {
            this.instance = new FEOffCommand();
        }
        return this.instance;
    }

    public content(): string {
        FEBaseCommand.get().updateTime(this.time).updateLight(this.light).and().setCommandType(CommandType.OFF);

        let result: string = FEBaseCommand.get().beginOfForm();
        result +='       <div class="row">\n' +
            '                <div class="col-md-4 text-right">\n' +
            '                    <label>' + this.transitionTime.label() + '</label>\n' +
            '                </div>\n' +
            '                <div class="col-md-2 text-left">\n' +
            '                    <input class="rowInput" type="number" min="0" max="900" value="' + this.transitionTime.value() + '" id="commandTransitionInput">\n' +
            '                </div>\n' +
            '                <div class="col-md-6"></div>\n' +
            '            </div>\n' +
            '        </div>'

        return result;
    }

    public updateLight(light: number): FEOffCommand {
        this.light = light;
        return this;
    }

    public updateTime(time: number): FEOffCommand {
        this.time = time;
        return this;
    }

    public setFieldContents(): FEOffCommand {
        FEBaseCommand.get().setFieldContents();
        WebElements.MODAL_TRANSITION_INPUT().val(this.transitionTime.value());
        return this;
    }

    public parse(): number[] {
        let inputTransition = <number> WebElements.MODAL_TRANSITION_INPUT().val();

        return [inputTransition];
    }
}
