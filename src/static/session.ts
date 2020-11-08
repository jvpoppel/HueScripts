import {TSMap} from "typescript-map";
import {Page} from "../data/page";
import {WebElements} from "./webElements";
import {CommandType} from "../data/events/lightCommand";

export class Session {

    private static instance: Session;

    private currentPageID: number;
    private foundLights: Array<number>;
    private pagesMap: TSMap<number, Page>;
    private currentCommandModalType: CommandType;

    private constructor() {

        this.currentPageID = 1;
        this.foundLights = new Array<number>();
        this.pagesMap = new TSMap<number, Page>();
        for (let i = 1; i <= 6; i++) {
            let pageNumber = i;
            this.pagesMap.set(pageNumber, new Page(pageNumber));
            WebElements.PAGE_BUTTON(pageNumber).get()[0].addEventListener("click", (e:Event) => this.changeToPage(pageNumber));
        }
    }

    public static get(): Session {
        if (this.instance === undefined) {
            this.instance = new Session();
        }
        return this.instance;
    }

    public page(): number {
        return this.currentPageID;
    }

    public lights(): Array<number> {
        return this.foundLights;
    }

    public commandModalInputType(): CommandType {
        return this.currentCommandModalType;
    }

    public setCommandModalInputType(commandModalInputType: CommandType) {
        this.currentCommandModalType = commandModalInputType;
        return this;
    }

    public pageMap(): TSMap<number, Page> {
        return this.pagesMap;
    }

    public currentPage(): Page {
        return this.pagesMap.get(this.currentPageID);
    }

    public changeToPage(page: number): Session {
        if (page < 1 || page > 6) {
            throw Error("Tried to change to a non-existent page.");
        }
        this.currentPageID = page;
        return this;
    }

    public newLight(newLight: number): Session {
        this.foundLights.push(newLight);
        return this;
    }
}
