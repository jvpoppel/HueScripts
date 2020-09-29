import {InputField} from "../InputField";
import {WebElements} from "../../../static/webElements";

export class FEBaseCommand {

    private time: InputField;
    private light: InputField;

    private static instance: FEBaseCommand;

    private constructor() {
        this.time = new InputField('Time:', WebElements.MODAL_TIME_INPUT(), 0);
        this.light = new InputField('Light ID:', WebElements.MODAL_LIGHT_INPUT(), null);

    }

    public static get() {
        if (this.instance == null) {
            this.instance = new FEBaseCommand();
        }
        return this.instance;
    }

    public beginOfForm(): string {
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
            '            </div>\n' +
            '            <div class="row">\n' +
            '                <div class="col-md-4 text-right">\n' +
            '                    <label>' + this.light.label() + '</label>\n' +
            '                </div>\n' +
            '                <div class="col-md-2 text-left">\n' +
            '                    <select class="rowInput" id="commandLightInput"><option>1</option></select>\n' +
            '                </div>\n' +
            '                <div class="col-md-6"></div>\n' +
            '            </div>\n';

        return result;
    }

    public updateTime(time: number): FEBaseCommand {
        this.time.setValue(time);
        return this;
    }

    public updateLight(light: number): FEBaseCommand {
        this.time.setValue(light);
        return this;
    }
}