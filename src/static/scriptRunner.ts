import {Queue} from "../model/queue";
import {LightCommand} from "../data/events/lightCommand";
import {WebElements} from "./webElements";
import {Logger} from "../util/logger";

export class ScriptRunner {
    private static instance: ScriptRunner;
    private stopped: boolean;

    private constructor() {
        this.stopped = false;
    }

    public static get() {
        if (this.instance == null) {
            this.instance = new ScriptRunner();
        }
        return this.instance;
    }

    public async start() {
        Logger.getLogger().info("ScriptRunner STARTED");
        let queue = new Queue();
        let time: number = 0;
        let eventTimes: number[] = queue.eventTimes();

        while (!this.stopped) {
            this.updateFrontend(time);

            if (eventTimes.indexOf(time) > 0) {
                queue.map().get(eventTimes[eventTimes.indexOf(time)]).forEach(function (command: LightCommand) {
                    command.execute();
                });
            }
            await this.sleep(100);
            time++;
            Logger.getLogger().info("ScriptRunner TIME: " + time);
        }
        this.stopped = false;
    }

    public stop() {
        Logger.getLogger().info("ScriptRunner STOPPED");
        this.stopped = true;
    }

    /**
     * Sleep function, as written by StackOverflow user Dan Dascelescu at https://stackoverflow.com/a/39914235.
     * @param ms Timeout in milliseconds
     * @return promise that is only fulfilled after @param ms time
     */
    async sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private updateFrontend(time: number) {
        let result: string = "";
        if (time < 10) {
            result = "0." + time;
        } else {
            result = (time - ( time % 10 )) / 10 + "." + ( time%10 );
        }
        WebElements.TIMER().html("Timer: " + result);
    }
}
