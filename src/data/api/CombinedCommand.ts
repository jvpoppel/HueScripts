import {ColorCommand} from "../events/colorCommand";
import {BrightnessCommand} from "../events/brightnessCommand";

export class CombinedCommand {

  private on: boolean | undefined = false;
  private bri: BrightnessCommand | undefined = undefined;
  private xy: ColorCommand | undefined = undefined;
  private transitionTime: number | undefined = undefined;
  private light: number;

  constructor(light: number) {
    this.light = light;
  }

  public turnOn(): CombinedCommand {
    this.on = true;
    return this;
  }

  public turnOff(): CombinedCommand {
    this.on = false;
    return this;
  }

  public setBrightness(bri: BrightnessCommand): CombinedCommand {
    this.bri = bri;
    return this;
  }

  public setColor(xy: ColorCommand): CombinedCommand {
    this.xy = xy;
    return this;
  }

  public build(): any {
    let result = {};
    if (this.on !== undefined) {
      result['on'] = this.on;
    }
    if (this.bri !== undefined) {
      if (this.bri.getTransitionTime() !== "") {
        this.transitionTime = +this.bri.values[1];
      }
      result['bri'] = +this.bri.values[0];
    }
    if (this.xy !== undefined) {
      if (this.xy.values.length == 3) {
        this.transitionTime = +this.xy.values[3];
      }
      result['xy'] = [+this.xy.values[0], +this.xy.values[1]];
    }

    if (this.transitionTime !== undefined) {
      result['transitiontime'] = this.transitionTime;
    }

    return result;
  }
}
