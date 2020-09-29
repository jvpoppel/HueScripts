export class InputField {
    private readonly fieldLabel: string;
    private readonly fieldWebElement: JQuery<HTMLElement>;
    private fieldValue: any;

    constructor(label: string, webElement: JQuery<HTMLElement>, value: any) {
        this.fieldLabel = label;
        this.fieldWebElement = webElement;
        this.fieldValue = value;
    }

    public label(): string {
        return this.fieldLabel;
    }

    public webElement(): JQuery<HTMLElement> {
        return this.fieldWebElement;
    }

    public value(): any {
        return this.fieldValue;
    }

    public setValue(value: any): InputField {
        this.fieldValue = value;
        return this;
    }


}
