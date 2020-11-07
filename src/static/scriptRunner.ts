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
        let eventTimes: string[] = queue.eventTimes();
        let lastIndex: number = 0; // Contains the last used index of eventTimes

        console.log(eventTimes);

        while (!this.stopped) {
            ScriptRunner.updateFrontendTimer(time);

            if (eventTimes[lastIndex] === time.toString(10)) {
                queue.commandsAtTime(time.toString(10)).forEach(function (command: LightCommand) {
                    command.execute();
                });
                if ((lastIndex + 1) < eventTimes.length) {
                    lastIndex ++;
                }
            }
            await this.sleep(100);
            time++;
        }

        ScriptRunner.resetCommands(queue);
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

    private static updateFrontendTimer(time: number) {
        let result: string = "";
        if (time < 10) {
            result = "0." + time;
        } else {
            result = (time - ( time % 10 )) / 10 + "." + ( time%10 );
        }
        WebElements.TIMER().html("Timer: " + result);
    }

    /**
     * Reset the 'Executed' value of all commands in queue.
     * @param queue Queue of commands, which should all be reset.
     */
    private static resetCommands(queue: Queue) {
        queue.map().values().forEach(set => set.forEach(command => command.reset()));
    }
}
