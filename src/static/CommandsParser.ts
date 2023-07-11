import {CommandType, LightCommand} from "../data/events/lightCommand";
import {CombinedCommand} from "../data/api/CombinedCommand";
import {Session} from "./session";
import {BrightnessCommand} from "../data/events/brightnessCommand";
import {ColorCommand} from "../data/events/colorCommand";
import {HueAPIService} from "../service/hueAPIService";

export class CommandsParser {


  public static forCommands(commands: Set<LightCommand>): void {
    let possibleCommands: CombinedCommand[] = new CombinedCommand[Session.get().lights().length]
    // HI BESCHONKEN JOHAN HIERO
    // OP DIT MOMENT IS LIHGHTS EEN NUMBER ARRAY, DIT DIENT EEN SET VAN COMBINEDCOMMANDS TE WORDEN, OP BASIS VAN WELKE LIGHT ID'S ER ZIJN.
    // DEZE ZIJN nmlk NIET OP VOLGORDE. ER KAN PRIMA EEN ID MISSEN.
    // VERVOLGENS DIENT UIT DE SET VAN LIGHT IDS DE NODIGE COMBINEDCOMMAND GEPAKT TE WORDEN
    // ideetjes hierover: maak voor elk light ID een combinedCommand, vervolgens hierop een boolean 'change' oid die enkel op TRUE wordt gezet als er een waarde gezet is voor deze
    // lamp dit command. Zoiets. Succes ermee. Ik ga slapen. Joe.

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
