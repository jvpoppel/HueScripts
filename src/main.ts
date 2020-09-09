import { Light } from './model/light';
import { Page } from "./data/page";
import { TSMap } from "typescript-map";
import { HueLink } from "./service/hueLink";
import { WebElements } from "./static/webElements";

$(() => {
    new Main();
})

export class Main {
    pagesMap: TSMap<number, Page> = new TSMap<number, Page>();

    constructor() {
        for (var i = 1; i <= 6; i++) {
            this.pagesMap.set(i, new Page(i));
        }
        WebElements.TIMER.html("TEST!!")
    }
}