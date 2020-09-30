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

    public addRow() {
        alert("Add Row");
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

    public async startSequence() {
        let sequence: Sequence = Session.get().pageMap().get(Session.get().page()).getSequence();

        let tempTime: number = 0;

        while (tempTime <= 1000) {
            if (sequence.rows.has(tempTime)) {
                sequence.rows.get(tempTime).forEach(row =>
                    row.getCommand().execute()
                );
            }
            await new Promise(resolve => setTimeout(resolve, 100));
            tempTime ++;
        }
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

    public testCommandModal() {
        BaseModal.show(WebElements.COMMAND_MODAL);
    }

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

        WebElements.COMMAND_MODAL_CMDBRIGHTNESS.get()[0].addEventListener("click",(e:Event) => this.commandModalChangeInputField(0));
        WebElements.COMMAND_MODAL_CMDCOLOR.get()[0].addEventListener("click",(e:Event) => this.commandModalChangeInputField(1));
        WebElements.COMMAND_MODAL_CMDON.get()[0].addEventListener("click",(e:Event) => this.commandModalChangeInputField(2));
        WebElements.COMMAND_MODAL_CMDOFF.get()[0].addEventListener("click",(e:Event) => this.commandModalChangeInputField(3));

        WebElements.TEST_COMMAND_MODAL.get()[0].addEventListener("click", (e:Event) => this.testCommandModal());
    }
}
