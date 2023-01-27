import {CommandType, LightCommand} from "../data/events/lightCommand";
import {CombinedCommand} from "../data/api/CombinedCommand";
import {Session} from "./session";
import {BrightnessCommand} from "../data/events/brightnessCommand";
import {ColorCommand} from "../data/events/colorCommand";
import {HueAPIService} from "../service/hueAPIService";

export class CommandsParser {


  public static forCommands(commands: Set<LightCommand>): void {
    let possibleCommands: CombinedCommand[] = new CombinedCommand[Session.get().lights().length]

    // Parse all commands on time
    commands.forEach(command => {1
      if (command.light == -1) {
        for (let l = 0; l < possibleCommands.length; l ++) {
          if (possibleCommands[l + 1] == undefined) {
            possibleCommands[l + 1] = new CombinedCommand(command.light);
          }
          CommandsParser.parseCommand(possibleCommands[l + 1], command);
        }
      } else if (possibleCommands[command.light - 1] == undefined) {
        possibleCommands[command.light - 1] = new CombinedCommand(command.light);
      }
      CommandsParser.parseCommand(possibleCommands[command.light - 1], command);
    });

    // Send PUT requests when applicable
    for (let i = 0; i < possibleCommands.length; i ++) {
      if (possibleCommands[i + 1] !== undefined) {
        HueAPIService.setLightState(i + 1, JSON.stringify(possibleCommands[i + 1].build()));
      }
    }
  }

  private static parseCommand(combination: CombinedCommand, command: LightCommand): void {
    switch (command.type) {
      case CommandType.ON:
        combination.turnOn();
        break;
      case CommandType.OFF:
        combination.turnOff();
        break;
      case CommandType.BRIGHTNESS:
        combination.setBrightness(<BrightnessCommand> command);
        break;
      case CommandType.COLOR:
        combination.setColor(<ColorCommand> command);
        break;
      default:
        break;
    }
  }
}
