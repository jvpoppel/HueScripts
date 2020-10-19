import {TSMap} from "typescript-map";
import {LightCommand} from "../data/events/lightCommand";
import {Session} from "../static/session";
import {Page} from "../data/page";

export class Queue {
    private queue: TSMap<number, Set<LightCommand>>;

    constructor() {
        this.queue = new TSMap<number, Set<LightCommand>>();
        this.parse();
    }

    /**
     * Parse the currently selected page (retrieve from Session class) into an Event Queue.
     */
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

    /**
     * Add a set of commands to given time in the queue
     * @param time time to add commands to
     * @param commandSet commands to add to time
     */
    private addCommandSetToTime(time: number, commandSet: Set<LightCommand>): void {
        // If there is already a set mapped to { time }, add all commands to that existing set
        if (this.queue.keys().indexOf(time) > 0) {
            commandSet.forEach(lightCommand => this.queue.get(time).add(lightCommand));
        } else {
            this.queue.sortedSet(time, commandSet);
        }
    }

    /**
     * Return all keys of the queue, sorted ascending.
     * All keys of the queue correspond with all times on which one, or multiple event(s) happen(s).
     */
    public eventTimes(): number[] {
        let keys: number[] = this.queue.keys();
        return keys.sort(function (a: number, b: number) {
            return a - b;
        });
    }

    /**
     * Return the TSMap object in which all queue data is stored.
     */
    public map(): TSMap<number, Set<LightCommand>> {
        return this.queue;
    }
}
