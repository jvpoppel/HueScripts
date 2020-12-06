import {LightCommand} from "../../../data/events/lightCommand";
import {Row} from "../../../data/row";

export class FERow {
    public static generate(row: Row): string {
        let command: LightCommand = row.getCommand();
        let light: string = "";
        if (command.light != undefined) {
            if (command.light == -1) {
                light = "All";
            } else {
                light += command.light;
            }
        }

        return  "<tr onclick=\"alert('Hoi " + row.getTime()+ "')\">" +
                  "<td>" + row.getTime() + "</td>" +
                  "<td>" + light + "</td>" +
                  "<td>" + command.type + "</td>" +
                  "<td>" + command.formattedValuesWithoutTransition() + "</td>" +
                  "<td>" + command.getTransitionTime() + "</td>" +
                "</tr>";
    }
}
