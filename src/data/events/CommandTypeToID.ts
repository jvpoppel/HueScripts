import {CommandType} from "./lightCommand";

export class CommandTypeToID {

  /**
   * Change the input fields in the 'Add new Command' modal based on which type of command
   * the user wants to add
   *          0 = Brightness
   *          1 = Color
   *          2 = On
   *          3 = Off
   *          4 = Page
   *          5 = Stop
   * @param type Original CommandType
   * @returns number following scheme from above
   */
  public static from(type: CommandType): number {
    switch(type) {
      case CommandType.BRIGHTNESS:
        return 0;
      case CommandType.COLOR:
        return 1;
      case CommandType.ON:
        return 2;
      case CommandType.OFF:
        return 3;
      case CommandType.PAGE:
        return 4;
      case CommandType.STOP:
        return 5;
    }
    throw new Error("CommandType " + type + " could not be parsed in CommandTypeToID");
  }
}
