import {FEBaseCommand} from "./FEBaseCommand";
import {CommandType} from "../../../data/events/lightCommand";

export class FEOffCommand {
    private time: number;
    private light: number;


    private static instance: FEOffCommand;

    private constructor() {
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

        return FEBaseCommand.get().beginOfForm();
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
        return this;
    }

    public parse(): number[] {

        return [];
    }
}
