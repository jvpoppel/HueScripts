import {TSMap} from "typescript-map";
import {Page} from "../data/page";
import {Row} from "../data/row";
import {Logger} from "./logger";
import {LightCommand} from "../data/events/lightCommand";
import {BrightnessCommand} from "../data/events/brightnessCommand";
import {ColorCommand} from "../data/events/colorCommand";
import {OnCommand} from "../data/events/onCommand";
import {OffCommand} from "../data/events/offCommand";
import {PageCommand} from "../data/events/pageCommand";

type PageInput = {
    id: number;
    sequence: SequenceInput;
}

type SequenceInput = {
    pageRows: Map<number, Array<RowInput>>;
}

type RowInput = {
    time: string;
    command: CommandInput;
}

type CommandInput = {
    light: string;
    values: any[];
    type: string;
    forTest: boolean;
    originalValues?: string[];
}

export class PageMapParser {
    public static for(input: string): TSMap<number, Page> {
        let result: TSMap<number, Page> = new TSMap<number, Page>();
        let json: Array<PageInput>;
        console.log(input);
        try {
            json = JSON.parse(input);
        } catch (e) {
            Logger.getLogger().error("PageMapParser: Caught error in JSON.parse: \n" + e);
        }

        for (let pageId: number = 1; pageId <= 6; pageId ++) {
            result.set(pageId, this.parsePage(json[pageId]));
        }
        console.log("result");
        console.log(result);
        return result;
    }

    private static parsePage(input: PageInput): Page {
        console.log("parsepage");
        console.log(input);
        let result: Page = new Page(input.id);

        let rowsMap: Map<number, Array<RowInput>> = input.sequence.pageRows;
        console.log("pagerows");
        console.log(rowsMap);

        let pageRows: IterableIterator<number> = rowsMap.keys();
        let nextTime: IteratorResult<number, any> = pageRows.next();
        
        while (nextTime.done == false) {
            let time = nextTime.value;
            let timeCommands = input.sequence.pageRows.get(time).values();
            let nextRow: IteratorResult<RowInput, any> = timeCommands.next();
            while (nextRow.done == false) {
                result.getSequence().addRow(time, this.parseRow(nextRow.value));
            }
        }

        return result;
    }

    private static parseRow(input: RowInput): Row {
        console.log("parserow");
        console.log(input);
        let time: string = input.time;

        return new Row(+time, this.parseCommand(input.command));
    }

    private static parseCommand(input: CommandInput): LightCommand {
        console.log("parsecommand");
        console.log(input);
        switch(input.type) {
            case "Brightness":
                return new BrightnessCommand(
                    +input.light,
                    input.values,
                    input.forTest
                );
            case "Color":
                return new ColorCommand(
                    +input.light,
                    input.values,
                    input.forTest
                );
            case "On":
                return new OnCommand(
                    +input.light,
                    input.values,
                    input.forTest
                );
            case "Off":
                return new OffCommand(
                    +input.light,
                    input.values,
                    input.forTest
                );
            case "Page":
                return new PageCommand(
                    input.values,
                    input.forTest
                );
        }

        throw Error("Invalid Command found in JSON input:\n" + JSON.stringify(input));
    }

}
