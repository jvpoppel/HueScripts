import {TSMap} from "typescript-map";
import {LightCommand} from "../data/events/lightCommand";
import {Session} from "../static/session";
import {Page} from "../data/page";

export class Queue {
    private queue: TSMap<string, Set<LightCommand>>;

    constructor() {
        this.queue = new TSMap<string, Set<LightCommand>>();
        this.parse();
    }

    /**
     * Parse the currently selected page (retrieve from Session class) into an Event Queue.
     */
    private parse(): void {
        let currentPage: Page = Session.get().currentPage();
        let pageTimes: number[] = currentPage.getSequence().rows().keys();

        for (let i = 0; i < pageTimes.length; i ++) {
            let time = pageTimes[i];
            let commandSet = new Set<LightCommand>();
            currentPage.getSequence().rows().get(time).forEach(function (row) {
                commandSet.add(row.getCommand());
            });
            this.addCommandSetToTime(time.toString(10), commandSet);
        }

        return;
    }

    /**
     * Add a set of commands to given time in the queue
     * @param time time to add commands to
     * @param commandSet commands to add to time
     */
    private addCommandSetToTime(time: string, commandSet: Set<LightCommand>): void {

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
    public eventTimes(): string[] {
        return this.queue.keys().sort((a,b) => 0 - (parseInt(a) > parseInt(b) ? -1 : 1));
    }

    /**
     * Return the TSMap object in which all queue data is stored.
     */
    public map(): TSMap<string, Set<LightCommand>> {
        return this.queue;
    }

    /**
     * Return the Light Command set at time, input as string, will be parsed in this function.
     */
    public commandsAtTime(time: string): Set<LightCommand> {
        return this.queue.get(time);
    }
}
