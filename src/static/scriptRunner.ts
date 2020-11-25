import {Queue} from "../model/queue";
import {LightCommand} from "../data/events/lightCommand";
import {WebElements} from "./webElements";
import {Logger} from "../util/logger";

export class ScriptRunner {
    private static instance: ScriptRunner;
    private stopped: boolean;
    private running: boolean;

    private constructor() {
        this.stopped = false;
        this.running = false;
    }

    public static get() {
        if (this.instance == null) {
            this.instance = new ScriptRunner();
        }
        return this.instance;
    }

    public async start() {
        if (this.running) {
            Logger.getLogger().warn("ScriptRunner got START command, but is already running");
            return;
        }
        Logger.getLogger().info("ScriptRunner STARTED");
        let queue = new Queue();
        let time: number = 0;
        let eventTimes: string[] = queue.eventTimes();
        let lastIndex: number = 0; // Contains the last used index of eventTimes
        while (!this.stopped) {
            this.running = true;
            ScriptRunner.updateFrontendTimer(time);
            let startTimeOfTick = Date.now();

            if (eventTimes[lastIndex] === time.toString(10)) {
                queue.commandsAtTime(time.toString(10)).forEach(function (command: LightCommand) {
                    command.execute();
                });
                if ((lastIndex + 1) < eventTimes.length) {
                    lastIndex ++;
                }
            }
            let deltaTime = Date.now() - startTimeOfTick;
            if (deltaTime < 100) {
                await this.sleep(100 - deltaTime);
            } else {
                Logger.getLogger().warn("Tick at time " + time + " took " + deltaTime + "ms, skipping wait");
            }

            time++;
        }
        Logger.getLogger().info("ScriptRunner STOPPED");
        this.stopped = false;
        this.running = false;
        return;
    }

    public stop() {
        Logger.getLogger().debug("ScriptRunner: set STOP-value to TRUE");
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
}
