export class Session {

    private static instance: Session;

    private currentPage: number;

    private constructor() {

        this.currentPage = 1;
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

    public changeToPage(page: number): Session {
        this.currentPage = page;
        return this;
    }
}
