/**
 * @author Johan van Poppel ( https://github.com/jvpoppel/HueScripts )
 */

import { CommandType, LightCommand } from "./lightCommand";
import {HueAPIService} from "../../service/hueAPIService";
import {Logger} from "../../util/logger";
import {Session} from "../../static/session";
import {ScriptRunner} from "../../static/scriptRunner";

/**
 * HueScripts OffCommand Class
 * Implementation of the LightCommand interface, specifying a light that should turn off
 */
export class StopCommand implements LightCommand {
  values: any[];
  light: number;
  type: CommandType;
  forTest: boolean;
  transitionTime: string;

  constructor(light: number, values: any[], forTest: boolean = false) {
    if (values.length > 0) {
      throw Error("StopCommand had too many values");
    }
    this.light = light;
    this.values = values;
    this.type = CommandType.STOP;
    this.forTest = forTest;

    this.transitionTime = "";

    if (forTest) {
      Logger.getLogger().warn("StopCommand created for testing.");
    }
  }

  public execute(): boolean {

    Logger.getLogger().debug("Perform 'StopCommand'");

    // In testing, exclude the API service as this will not work.
    if (!this.forTest) {
      ScriptRunner.get().stop();
    }

    return true;
  }

  public formattedValuesWithoutTransition(): string {
    return "";
  }

  public getTransitionTime(): string {
    return this.transitionTime;
  }

  public getType(): CommandType {
    return this.type;
  }

  public toString(): string {
    return "StopCommand";
  }

}
