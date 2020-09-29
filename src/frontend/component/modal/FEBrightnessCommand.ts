import {InputField} from "../InputField";
import {WebElements} from "../../../static/webElements";

export class FEBrightnessCommand {

    private time: InputField;
    private brightnessLevel: InputField;
    private transitionTime: InputField;
    private light: InputField;

    private static instance: FEBrightnessCommand;

    private constructor() {
        this.time = new InputField('Time:', WebElements.MODAL_TIME_INPUT(), 0);
        this.brightnessLevel = new InputField('Brightness:', WebElements.MODAL_BRIGHTNESS_INPUT(), 0);
        this.transitionTime = new InputField('Transition time:', WebElements.MODAL_TRANSITION_INPUT(), 0);
        this.light = new InputField('Light ID:', WebElements.MODAL_LIGHT_INPUT(), null);
    }

    public static get(): FEBrightnessCommand {
        if (this.instance == null) {
            this.instance = new FEBrightnessCommand();
        }
        return this.instance;
    }

    public content(): string {
        let result: string = "";

        result += '<table class="table">\n' +
                '      <tr>\n' +
                    '      <td>' + this.time.label() + '</td>\n' +
                    '      <td>\n' +
                    '          <input class="rowInput" type="number" min="1" max="999999" value="' + this.time.value() + '" id="commandTimeInput">\n' +
                    '      </td>\n' +
                    '      <td>(1 second &rArr; value 10)</td>\n' +
                    '      </tr>\n' +
                '      <tr>\n' +
                    '      <td>' + this.light.label() + '</td>\n' +
                    '      <td>\n' +
                    '      <select class="rowInput" id="commandLightInput"><option>1</option></select>\n' +
                    '      </td>\n' +
                    '      <td></td>\n' +
                '      </tr>\n' +
                '      <tr>\n' +
                    '      <td>' + this.brightnessLevel.label() + '</td>\n' +
                    '      <td>\n' +
                    '          <input class="rowInput" type="number" min="0" max="255" value="' + this.brightnessLevel.value() + '" id="commandBrightnessInput">\n' +
                    '      </td>\n' +
                    '      <td></td>\n' +
                '      </tr>\n' +
                '      <tr>\n' +
                    '      <td>' + this.transitionTime.label() + '</td>\n' +
                    '      <td>\n' +
                    '          <input class="rowInput" type="number" min="1" max="999999" value="' + this.transitionTime.value() + '" id="commandTransitionInput">\n' +
                    '      </td>\n' +
                    '      <td></td>\n' +
                '      </tr>\n' +
                '      </table>'


        return result;
    }
}
