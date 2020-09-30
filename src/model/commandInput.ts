import {CommandType} from "../data/events/lightCommand";
import {Logger} from "../util/logger";
import {Session} from "../static/session";
import {Row} from "../data/row";
import {BrightnessCommand} from "../data/events/brightnessCommand";
import {ColorCommand} from "../data/events/colorCommand";
import {Colors} from "../util/colors";

export class CommandInput {

    private _time: number;
    private _light: number;
    private _red: number;
    private _green: number;
    private _blue: number;
    private _brightness: number;
    private _transition: number;
    private _type: CommandType;
    private logger: Logger = Logger.getLogger();

    public setTime(time: number): CommandInput {
        this._time = time;
        return this;
    }

    public setLight(light: number): CommandInput {
        this._light = light;
        return this;
    }

    public setRed(red: number): CommandInput {
        this._red = red;
        return this;
    }

    public setGreen(green: number): CommandInput {
        this._green = green;
        return this;
    }

    public setBlue(blue: number): CommandInput {
        this._blue = blue;
        return this;
    }

    public setBrightness(brightness: number): CommandInput {
        this._brightness = brightness;
        return this;
    }

    public setTransition(transition: number): CommandInput {
        this._transition = transition;
        return this;
    }

    public setType(type: number): CommandInput {
        this._type = type;
        return this;
    }

    public time(): number {
        return this._time;
    }

    public light(): number {
        return this._light;
    }

    public red(): number {
        return this._red;
    }

    public green(): number {
        return this._green;
    }

    public blue(): number {
        return this._blue;
    }

    public brightness(): number {
        return this._brightness;
    }

    public transition(): number {
        return this._transition;
    }

    public type(): CommandType {
        return this._type;
    }

    public submit(): boolean {
        if (this.type() == null) {
            this.logger.error("CommandInput: Type was not set.");
            return false;
        }

        if (this.time() == null) {
            this.logger.error("CommandInput: Time was not set.");
            return false;
        }

        if (this.light() == null) {
            this.logger.error("CommandInput: Light was not set.");
            return false;
        }

        switch (this.type()) {
            case CommandType.BRIGHTNESS:
                if (this.brightness() == null) {
                    this.logger.error("CommandInput: Brightness was not set.");
                    return false;
                }
                if (this.transition() == null) {
                    this.logger.error("CommandInput: Transition was not set.");
                    return false;
                }
                Session.get().pageMap().get(Session.get().page()).getSequence().addRow(this.time(),
                    new Row(this.time(),
                        new BrightnessCommand(this.light(), [this.brightness(), this.transition()])));
                return true;

            case CommandType.COLOR:
                if (this.transition() == null) {
                    this.logger.error("CommandInput: Transition was not set.");
                    return false;
                }
                if (this.red() == null) {
                    this.logger.error("CommandInput: Red was not set.");
                    return false;
                }
                if (this.green() == null) {
                    this.logger.error("CommandInput: Green was not set.");
                    return false;
                }
                if (this.blue() == null) {
                    this.logger.error("CommandInput: Blue was not set.");
                    return false;
                }

                let xyPoint: number[] = Colors.convertRGBtoXY(this.red(), this.green(), this.blue());

                Session.get().pageMap().get(Session.get().page()).getSequence().addRow(this.time(),
                    new Row(this.time(),
                        new ColorCommand(this.light(), [xyPoint[0], xyPoint[1], this.transition()])));
                return true;
        }
    }
}
