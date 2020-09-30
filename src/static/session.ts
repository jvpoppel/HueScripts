import {HueAPIService} from "../service/hueAPIService";

export class Session {

    private static instance: Session;

    private currentPage: number;
    private foundLights: Array<number>;

    private constructor() {

        this.currentPage = 1;
        this.foundLights = new Array<number>();
    }



    public static get(): Session {
        if (this.instance === undefined) {
            this.instance = new Session();
        }
        return this.instance;
    }

    public page(): number {
        return this.currentPage;
    }

    public lights(): Array<number> {
        return this.foundLights;
    }

    public changeToPage(page: number): Session {
        this.currentPage = page;
        return this;
    }

    public newLight(newLight: number): Session {
        this.foundLights.push(newLight);
        return this;
    }
}
