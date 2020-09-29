export class InputField {
    private readonly fieldLabel: string;
    private readonly fieldWebElement: JQuery<HTMLElement>;

    constructor(label: string, webElement: JQuery<HTMLElement>) {
        this.fieldLabel = label;
        this.fieldWebElement = webElement;
    }

    public label(): string {
        return this.fieldLabel;
    }

    public webElement(): JQuery<HTMLElement> {
        return this.fieldWebElement;
    }


}
