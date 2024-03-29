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

    /*
     * Returns pageMap with cleared 'Rows For Edit'
     */
    public pageMap(): TSMap<number, Page> {
        this.pagesMap.keys().forEach(key => this.pagesMap.get(key).getSequence().clearRowForEdit());
        return this.pagesMap;
    }

    public currentPage(): Page {
        return this.pagesMap.get(this.currentPageID);
    }

    public changeToPage(page: number): Session {
        if (page < 1 || page > 6) {
            throw Error("Tried to change to a non-existent page.");
        }
        WebElements.PAGE_BUTTON(Session.get().currentPageID).removeClass('btn-secondary');
        WebElements.PAGE_BUTTON(Session.get().currentPageID).addClass('btn-light');
        this.currentPageID = page;
        this.pageMap().get(page).getSequence().updateFrontend();
        WebElements.PAGE_BUTTON(page).addClass('btn-secondary');
        WebElements.PAGE_BUTTON(page).removeClass('btn-light');
        return this;
    }

    public newLight(newLight: number): Session {
        this.foundLights.push(newLight);
        return this;
    }

    public setPageMap(pageMap: TSMap<number, Page>): void {
        this.pagesMap = pageMap;
        this.changeToPage(1);
    }
}
