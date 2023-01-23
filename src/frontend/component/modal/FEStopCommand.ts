import {FEBaseCommand} from "./FEBaseCommand";
import {CommandType} from "../../../data/events/lightCommand";

export class FEStopCommand {
  private time: number;
  private light: number;


  private static instance: FEStopCommand;

  private constructor() {
    this.time = 0;
    this.light = 1;
  }

  public static get(): FEStopCommand {
    if (this.instance == null) {
      this.instance = new FEStopCommand();
    }
    return this.instance;
  }

  public content(): string {
    FEBaseCommand.get().updateTime(this.time).and().setCommandType(CommandType.STOP);

    return FEBaseCommand.get().beginOfForm(true);
  }

  public updateLight(light: number): FEStopCommand {
    this.light = light;
    return this;
  }

  public updateTime(time: number): FEStopCommand {
    this.time = time;
    return this;
  }

  public setFieldContents(): FEStopCommand {
    FEBaseCommand.get().setFieldContents();
    return this;
  }

  public parse(): number[] {

    return [];
  }
}
