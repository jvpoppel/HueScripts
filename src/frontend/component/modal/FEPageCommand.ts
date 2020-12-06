import {InputField} from "../InputField";
import {WebElements} from "../../../static/webElements";
import {FEBaseCommand} from "./FEBaseCommand";
import {CommandType} from "../../../data/events/lightCommand";
import {Logger} from "../../../util/logger";

export class FEPageCommand {


    private pageNumber: InputField;
    private time: number;
    private page: number;


    private static instance: FEPageCommand;

    private constructor() {
        this.pageNumber = new InputField('Page:', WebElements.MODAL_PAGE_INPUT(), 1);
        this.time = 0;
        this.page = 1;
    }

    public static get(): FEPageCommand {
        if (this.instance == null) {
            this.instance = new FEPageCommand();
        }
        return this.instance;
    }

    public content(): string {
        FEBaseCommand.get().updateTime(this.time).and().setCommandType(CommandType.PAGE);

        let result: string = FEBaseCommand.get().beginOfForm(true);
        result +='       <div class="row">\n' +
            '                <div class="col-md-4 text-right">\n' +
            '                    <label>' + this.pageNumber.label() + '</label>\n' +
            '                </div>\n' +
            '                <div class="col-md-3 text-left">\n' +
            '                    <input class="rowInput" type="number" min="1" max="6" value="' + this.pageNumber.value() + '" id="commandPageInput">\n' +
            '                </div>\n' +
            '                <div class="col-md-5"></div>\n' +
            '            </div>\n' +
            '        </div>';

        return result;
    }

    public updatePage(page: number): FEPageCommand {
        this.page = page;
        return this;
    }

    public updateTime(time: number): FEPageCommand {
        this.time = time;
        return this;
    }

    public setFieldContents(): FEPageCommand {
        FEBaseCommand.get().setFieldContents();
        WebElements.MODAL_PAGE_INPUT().val(this.pageNumber.value());
        return this;
    }

    public parse(): number[] {
        let inputPage = <number> WebElements.MODAL_PAGE_INPUT().val();

        return [inputPage];
    }
}
