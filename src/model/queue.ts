import {TSMap} from "typescript-map";
import {LightCommand} from "../data/events/lightCommand";

export class Queue {
    private queue: TSMap<number, Set<LightCommand>>;

    constructor() {
        this.queue = new TSMap<number, Set<LightCommand>>();
        this.parse();
    }

    private parse(): void {
        return;
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
