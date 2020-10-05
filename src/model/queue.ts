import {TSMap} from "typescript-map";
import {LightCommand} from "../data/events/lightCommand";
import {Session} from "../static/session";
import {Page} from "../data/page";
import {Light} from "./light";

export class Queue {
    private queue: TSMap<number, Set<LightCommand>>;

    constructor() {
        this.queue = new TSMap<number, Set<LightCommand>>();
        this.parse();
    }

    private parse(): void {
        let currentPage: Page = Session.get().currentPage();
        let pageTimes: number[] = currentPage.getSequence().rows().keys();

        pageTimes.forEach(function( time: number){
            let commandSet = new Set<LightCommand>();
            currentPage.getSequence().rows().get(time).forEach(function (row) {
                commandSet.add(row.getCommand());
            });
            this.addCommandSetToTime(time, commandSet);
        });
        return;
    }

    private addCommandSetToTime(time: number, commandSet: Set<LightCommand>) {
        this.queue.sortedSet(time, commandSet);
    }

    public eventTimes(): number[] {
        let keys: number[] = this.queue.keys();
        return keys.sort(function (a: number, b: number) {
            return a - b;
        });
    }

    public map(): TSMap<number, Set<LightCommand>> {
        return this.queue;
    }
}
