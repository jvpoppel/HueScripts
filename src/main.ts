import {WebElements} from "./static/webElements";
import {BaseModal} from "./static/baseModal";
import {HueAccount} from "./service/hueAccount";
import {HueAPIService} from "./service/hueAPIService";
import {Session} from "./static/session";
import {Logger} from "./util/logger";
import {Sequence} from "./data/sequence";
import {FEBrightnessCommand} from "./frontend/component/modal/FEBrightnessCommand";
import {FEColorCommand} from "./frontend/component/modal/FEColorCommand";
import {CommandType} from "./data/events/lightCommand";
import {ScriptRunner} from "./static/scriptRunner";
import {Row} from "./data/row";
import {FERow} from "./frontend/component/data/FERow";
import {FEPageCommand} from "./frontend/component/modal/FEPageCommand";

$(() => {
    new Main();
})

export class Main {


    constructor() {

        if (!HueAccount.exists()) {
            HueAccount.create();
        } else {
            HueAPIService.updateSessionLights();
        }

        this.setupBaseEventListeners();
        Session.get().changeToPage(1);
    }

    /**
     * Delete a row
     */
    public delRow() {
        alert("Del Row!");
    }

    /**
     * Edit the current row
     */
    public editRow() {
        alert("Edit Row!");
    }

    /**
     * Call the method to parse the user input
     */
    public submitLoadModal() {
        alert("Submit load modal");
    }

    /**
     * Start the current sequence.
     * Don't do anything with the async nature of this method,
     * the start method in ScriptRunner contains the loop.
     * Awaiting this will not allow you to stop it.
     */
    public async startSequence() {
        ScriptRunner.get().start();
    }

    /**
     * Stop the current sequence
     */
    public stopSequence() {
        ScriptRunner.get().stop();
    }

    /**
     * Open the modal to test the lights
     */
    public modalLightTest() {
        alert ("Modal light test");
        // TODO: Add lights to modal
        BaseModal.show(WebElements.LIGHT_MODAL);
    }

    /**
     * Open the modal to save the current page
     */
    public openSaveSequenceModal() {
        console.log(JSON.stringify(Session.get().currentPage().getSequence().rows()));
        BaseModal.show(WebElements.SAVE_SEQUENCE);
    }

    /**
     * Remove everything in the current sequence (page)
     */
    public clearSequence(): void {
        Session.get().currentPage().getSequence().clear();
    }

    /**
     * Change the input fields in the 'Add new Command' modal based on which type of command
     * the user wants to add
     * @param cmdId numeric value representing the available commands;
     *          0 = Brightness
     *          1 = Color
     *          2 = On
     *          3 = Off
     *          4 = Page
     */
    public commandModalChangeInputField(cmdId: number) {
        switch (cmdId) {
            case 0:
                WebElements.COMMAND_MODAL_INPUTAREA.html(FEBrightnessCommand.get().content());
                FEBrightnessCommand.get().setFieldContents();
                Session.get().setCommandModalInputType(CommandType.BRIGHTNESS);
                break;
            case 1:
                WebElements.COMMAND_MODAL_INPUTAREA.html(FEColorCommand.get().content());
                FEColorCommand.get().setFieldContents();
                Session.get().setCommandModalInputType(CommandType.COLOR);
                break;
            case 4:
                WebElements.COMMAND_MODAL_INPUTAREA.html(FEPageCommand.get().content());
                FEPageCommand.get().setFieldContents();
                Session.get().setCommandModalInputType(CommandType.PAGE);
                break;
            default:
                Logger.getLogger().warn("CommandModal input change called with invalid ID " + cmdId);
        }
    }

    /**
     * This method will bind all event listeners to the DOM model
     */
    private setupBaseEventListeners() {
        WebElements.EDIT_ROW_MODAL_DELETE.get()[0].addEventListener("click", (e:Event) => this.delRow());
        WebElements.EDIT_ROW_MODAL_SUBMIT.get()[0].addEventListener("click", (e:Event) => this.editRow());
        WebElements.ADD_ROW_BUTTON.get()[0].addEventListener("click", (e:Event) => BaseModal.show(WebElements.COMMAND_MODAL));
        WebElements.SHOW_LIGHT_TEST.get()[0].addEventListener("click", (e:Event) => this.modalLightTest());
        WebElements.SHOW_LOAD_SEQUENCE.get()[0].addEventListener("click", (e:Event) => BaseModal.show(WebElements.LOAD_SEQUENCE));
        WebElements.SHOW_SAVE_SEQUENCE.get()[0].addEventListener("click", (e:Event) => this.openSaveSequenceModal());
        WebElements.CLEAR_SEQUENCE.get()[0].addEventListener("click", (e:Event) => this.clearSequence());

        WebElements.BRIDGE_SELECT_CONFIRM.get()[0].addEventListener("click", (e:Event) => HueAPIService.createAccountOnIP());

        WebElements.LOAD_SEQUENCE_SUBMIT.get()[0].addEventListener("click", (e:Event) => this.submitLoadModal());

        WebElements.SEQUENCE_START.get()[0].addEventListener("click", (e:Event) => this.startSequence());
        WebElements.SEQUENCE_STOP.get()[0].addEventListener("click", (e:Event) => this.stopSequence());
        WebElements.AUDIO_SELECT.get()[0].addEventListener("click", (e:Event) => BaseModal.show(WebElements.SOUND_MODAL));

        WebElements.COMMAND_MODAL_CMDBRIGHTNESS.get()[0].addEventListener("click",(e:Event) => this.commandModalChangeInputField(0));
        WebElements.COMMAND_MODAL_CMDCOLOR.get()[0].addEventListener("click",(e:Event) => this.commandModalChangeInputField(1));
        WebElements.COMMAND_MODAL_CMDON.get()[0].addEventListener("click",(e:Event) => this.commandModalChangeInputField(2));
        WebElements.COMMAND_MODAL_CMDOFF.get()[0].addEventListener("click",(e:Event) => this.commandModalChangeInputField(3));
        WebElements.COMMAND_MODAL_CMDPAGE.get()[0].addEventListener("click",(e:Event) => this.commandModalChangeInputField(4));
    }
}
