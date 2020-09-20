import { Page } from "./data/page";
import { TSMap } from "typescript-map";
import { WebElements } from "./static/webElements";
import { BaseModal } from "./static/baseModal";
import {HueAccount} from "./service/hueAccount";
import {HueAPIService} from "./service/hueAPIService";

$(() => {
    new Main();
})

export class Main {
    pagesMap: TSMap<number, Page> = new TSMap<number, Page>();

    constructor() {
        for (let i = 1; i <= 6; i++) {
            let pageNumber = i;
            this.pagesMap.set(pageNumber, new Page(pageNumber));
            WebElements.PAGE_BUTTON(pageNumber).get()[0].addEventListener("click", (e:Event) => this.changePage(pageNumber));
        }

        if (!HueAccount.exists()) {
            HueAccount.create();
        }

        this.setupBaseEventListeners();
    }

    public addRow() {
        alert("Add Row!");
    }

    public delRow() {
        alert("Del Row!");
    }

    public editRow() {
        alert("Edit Row!");
    }

    public modalSelectIP() {
        alert("Modal select ip");
    }

    public submitLoadModal() {
        alert("Submit load modal");
    }

    public startSequence() {
        alert("Start Sequence");
    }

    public stopSequence() {
        alert("Stop Sequence");
    }

    public modalLightTest() {
        alert ("Modal light test");
        // TODO: Add lights to modal
        BaseModal.show(WebElements.LIGHT_MODAL);
    }

    public openSaveSequenceModal() {
        alert("Save sequence modal");
        // var cnvData = JSON.stringify(sequence);
        BaseModal.show(WebElements.SAVE_SEQUENCE);
    }

    public clearSequence() {
        alert ("Clear sequence!");
    }

    public changePage(page: number) {
        alert ("Change to page " + page);
    }

    /**
     * This method will bind all event listeners to the DOM model
     */
    private setupBaseEventListeners() {
        WebElements.ADD_ROW_MODAL_SUBMIT.get()[0].addEventListener("click", (e:Event) => this.addRow());
        WebElements.EDIT_ROW_MODAL_DELETE.get()[0].addEventListener("click", (e:Event) => this.delRow());
        WebElements.EDIT_ROW_MODAL_SUBMIT.get()[0].addEventListener("click", (e:Event) => this.editRow());
        WebElements.ADD_ROW_BUTTON.get()[0].addEventListener("click", (e:Event) => BaseModal.show(WebElements.ADD_ROW_MODAL));
        WebElements.SHOW_LIGHT_TEST.get()[0].addEventListener("click", (e:Event) => this.modalLightTest());
        WebElements.SHOW_LOAD_SEQUENCE.get()[0].addEventListener("click", (e:Event) => BaseModal.show(WebElements.LOAD_SEQUENCE));
        WebElements.SHOW_SAVE_SEQUENCE.get()[0].addEventListener("click", (e:Event) => this.openSaveSequenceModal());
        WebElements.CLEAR_SEQUENCE.get()[0].addEventListener("click", (e:Event) => this.clearSequence());

        WebElements.BRIDGE_SELECT_CONFIRM.get()[0].addEventListener("click", (e:Event) => HueAPIService.createAccountOnIP());

        WebElements.LOAD_SEQUENCE_SUBMIT.get()[0].addEventListener("click", (e:Event) => this.submitLoadModal());

        WebElements.SEQUENCE_START.get()[0].addEventListener("click", (e:Event) => this.startSequence());
        WebElements.SEQUENCE_STOP.get()[0].addEventListener("click", (e:Event) => this.stopSequence());
        WebElements.AUDIO_SELECT.get()[0].addEventListener("click", (e:Event) => BaseModal.show(WebElements.SOUND_MODAL));
    }
}
