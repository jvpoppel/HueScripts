import {WebElements} from "./static/webElements";
import {BaseModal} from "./static/baseModal";
import {HueAccount} from "./service/hueAccount";
import {HueAPIService} from "./service/hueAPIService";
import {Session} from "./static/session";
import {Logger} from "./util/logger";
import {FEBrightnessCommand} from "./frontend/component/modal/FEBrightnessCommand";
import {FEColorCommand} from "./frontend/component/modal/FEColorCommand";
import {CommandType} from "./data/events/lightCommand";
import {ScriptRunner} from "./static/scriptRunner";
import {FEPageCommand} from "./frontend/component/modal/FEPageCommand";
import {FEOnCommand} from "./frontend/component/modal/FEOnCommand";
import {FEOffCommand} from "./frontend/component/modal/FEOffCommand";
import {PageMapParser} from "./util/pageMapParser";
import {FEStopCommand} from "./frontend/component/modal/FEStopCommand";
import {FETestLights} from "./frontend/component/modal/FETestLights";

$(() => {
    new Main();
})

export class Main {

    private static instance: Main;

    public static get(): Main {
        return Main.instance;
    }


    constructor() {

        if (!HueAccount.exists()) {
            HueAccount.create();
        }
        if (Session.get().lights().length == 0) {
            HueAPIService.updateSessionLights();
        }

        this.setupBaseEventListeners();
        Session.get().changeToPage(1);
        Main.instance = this;
    }

    public setupRowEventListeners(id: string) {
        console.log("Setup " + id);
        WebElements.SEQUENCE_ROW_EDIT_BUTTON(id).get()[0].addEventListener("click",(e:Event) => this.editRow(id));
        WebElements.SEQUENCE_ROW_DELETE_BUTTON(id).get()[0].addEventListener("click",(e:Event) => this.delRow(id));
    }

    public removeRowEventListeners(id: string) {
        console.log("Remove " + id);
        WebElements.SEQUENCE_ROW_EDIT_BUTTON(id).get()[0].removeEventListener("click",(e:Event) => this.editRow(id));
        WebElements.SEQUENCE_ROW_DELETE_BUTTON(id).get()[0].removeEventListener("click",(e:Event) => this.delRow(id));
    }

    /**
     * Delete a row
     */
    public delRow(id: string) {
        Session.get().currentPage().getSequence().deleteRow(Session.get().currentPage().getSequence().getRowById(id));
    }

    /**
     * Edit the current row
     */
    public editRow(id: string) {
        BaseModal.show(WebElements.EDIT_ROW_MODAL);
    }

    /**
     * Call the method to parse the user input
     */
    public submitLoadModal() {
        Session.get().setPageMap(PageMapParser.for(WebElements.LOAD_SEQUENCE_TEXTAREA().get(0).value));
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
    public async modalLightTest() {
        await FETestLights.createLightTable().then(() => BaseModal.show(WebElements.LIGHT_MODAL));

    }

    /**
     * Open the modal to save the current page
     */
    public openSaveSequenceModal() {
        BaseModal.show(WebElements.SAVE_SEQUENCE);
        WebElements.SAVE_SEQUENCE_TEXTAREA.get(0).textContent = "";
        WebElements.SAVE_SEQUENCE_TEXTAREA.get(0).textContent = JSON.stringify(Session.get().pageMap().toJSON(), this.Set_toJSON);
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
            case 2:
                WebElements.COMMAND_MODAL_INPUTAREA.html(FEOnCommand.get().content());
                FEOnCommand.get().setFieldContents();
                Session.get().setCommandModalInputType(CommandType.ON);
                break;
            case 3:
                WebElements.COMMAND_MODAL_INPUTAREA.html(FEOffCommand.get().content());
                FEOffCommand.get().setFieldContents();
                Session.get().setCommandModalInputType(CommandType.OFF);
                break;
            case 4:
                WebElements.COMMAND_MODAL_INPUTAREA.html(FEPageCommand.get().content());
                FEPageCommand.get().setFieldContents();
                Session.get().setCommandModalInputType(CommandType.PAGE);
                break;
            case 5:
                WebElements.COMMAND_MODAL_INPUTAREA.html(FEStopCommand.get().content());
                FEPageCommand.get().setFieldContents();
                Session.get().setCommandModalInputType(CommandType.STOP);
                break;
            default:
                Logger.getLogger().warn("CommandModal input change called with invalid ID " + cmdId);
        }
    }

    private static audioChangeEvent() {
        let files = WebElements.SOUND_FILE_INPUT().get(0).files;
        WebElements.SOUND_PLAYER().get(0).src = URL.createObjectURL(files[0]);
        WebElements.SOUND_PLAYER().get(0).load();
    }

    /**
     * This method will bind all event listeners to the DOM model
     */
    private setupBaseEventListeners() {
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
        WebElements.SOUND_SUBMIT.get()[0].addEventListener("click", (e: Event) => Main.audioChangeEvent());

        WebElements.COMMAND_MODAL_CMDBRIGHTNESS.get()[0].addEventListener("click",(e:Event) => this.commandModalChangeInputField(0));
        WebElements.COMMAND_MODAL_CMDCOLOR.get()[0].addEventListener("click",(e:Event) => this.commandModalChangeInputField(1));
        WebElements.COMMAND_MODAL_CMDON.get()[0].addEventListener("click",(e:Event) => this.commandModalChangeInputField(2));
        WebElements.COMMAND_MODAL_CMDOFF.get()[0].addEventListener("click",(e:Event) => this.commandModalChangeInputField(3));
        WebElements.COMMAND_MODAL_CMDPAGE.get()[0].addEventListener("click",(e:Event) => this.commandModalChangeInputField(4));
        WebElements.COMMAND_MODAL_CMDSTOP.get()[0].addEventListener("click",(e:Event) => this.commandModalChangeInputField(5));
    }

    private Set_toJSON(key, value): any {
        if (typeof value === 'object' && value instanceof Set) {
            return Array.from(value);
        }
        return value;
    }
}
