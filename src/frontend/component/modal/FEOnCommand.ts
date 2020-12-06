import {FEBaseCommand} from "./FEBaseCommand";
import {CommandType} from "../../../data/events/lightCommand";

export class FEOnCommand {
    private time: number;
    private light: number;


    private static instance: FEOnCommand;

    private constructor() {
        this.time = 0;
        this.light = 1;
    }

    public static get(): FEOnCommand {
        if (this.instance == null) {
            this.instance = new FEOnCommand();
        }
        return this.instance;
    }

    public content(): string {
        FEBaseCommand.get().updateTime(this.time).updateLight(this.light).and().setCommandType(CommandType.ON);

        return FEBaseCommand.get().beginOfForm();
    }

    public updateLight(light: number): FEOnCommand {
        this.light = light;
        return this;
    }

    public updateTime(time: number): FEOnCommand {
        this.time = time;
        return this;
    }

    public setFieldContents(): FEOnCommand {
        FEBaseCommand.get().setFieldContents();
        return this;
    }

    public parse(): number[] {
        return [];
    }
}
