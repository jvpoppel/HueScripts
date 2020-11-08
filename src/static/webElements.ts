/**
 * Enum-ish implementation for getting all jQuery selectors in other classess.
 */
export class WebElements {


    /*
            MAIN PAGE
     */
    static ALL_SEQUENCE_ROWS(): HTMLElement[]                               { return $("#sequence tr").toArray()};
    static readonly SEQUENCE_AREA: JQuery<HTMLElement>                      = $("#divTable");
    static readonly SEQUENCE_TABLE: JQuery<HTMLElement>                     = $("#sequence");
    static readonly SEQUENCE_START: JQuery<HTMLElement>                     = $("#startBtn");
    static readonly SEQUENCE_STOP: JQuery<HTMLElement>                      = $("#stopBtn");
    static TIMER(): JQuery<HTMLElement>                                     { return $("#timer"); }
    static readonly AUDIO_SELECT:JQuery<HTMLElement>                        = $("#audioBtn");
    static readonly ADD_ROW_BUTTON: JQuery<HTMLElement>                     = $("#addBtn");
    static readonly SHOW_LIGHT_TEST: JQuery<HTMLElement>                    = $("#infBtn");
    static readonly SHOW_LOAD_SEQUENCE: JQuery<HTMLElement>                 = $("#loadBtn");
    static readonly SHOW_SAVE_SEQUENCE: JQuery<HTMLElement>                 = $("#saveBtn");
    static readonly CLEAR_SEQUENCE: JQuery<HTMLElement>                     = $("#clearBtn");
    static SEQUENCE_ROW_EDIT_BUTTON(rowNumber: number): JQuery<HTMLElement> { return $("#rowEdit_"+rowNumber);  }
    static SEQUENCE_ROW(rowNumber: number): JQuery<HTMLElement>             { return $("#row" + rowNumber);  }
    static PAGE_BUTTON(pageNumber: number): JQuery<HTMLElement>             { return $("#btnSelectPage" + pageNumber);  }

    static readonly TEST_COMMAND_MODAL: JQuery<HTMLElement>                 = $("#commandBtn");

    /*
            MODALS
     */
    static readonly IP_MODAL: JQuery<HTMLElement>       = $('#ipModal');
    static readonly BRIDGE_LINK: JQuery<HTMLElement>    = $('#bridgeModal');
    static readonly BRIDGE_SUCCESS: JQuery<HTMLElement> = $('#successModal');
    static readonly COMMAND_MODAL: JQuery<HTMLElement>  = $('#commandModal');
    static readonly LOAD_SEQUENCE: JQuery<HTMLElement>  = $('#inputModal');
    static readonly SAVE_SEQUENCE: JQuery<HTMLElement>  = $("#saveModal");
    static readonly LIGHT_MODAL: JQuery<HTMLElement>    = $("#lightModal");
    static readonly ADD_ROW_MODAL: JQuery<HTMLElement>  = $("#rowModal");
    static readonly EDIT_ROW_MODAL: JQuery<HTMLElement> = $("#editModal");
    static readonly SOUND_MODAL: JQuery<HTMLElement>    = $("#soundModal");

    /*
            EDIT ROW MODAL
     */
    static readonly EDIT_ROW_MODAL_DELETE: JQuery<HTMLElement>      = $("#btnEditDelete");
    static readonly EDIT_ROW_MODAL_SUBMIT: JQuery<HTMLElement>      = $("#btnEditSubmit");
    static EDIT_ROW_MODAL_ROW_NUMBER(): JQuery<HTMLElement>  { return $("#editRowID"); }
    static EDIT_ROW_MODAL_LIGHT(): JQuery<HTMLElement>       { return $("#editRowLight"); }
    static EDIT_ROW_MODAL_TIME(): JQuery<HTMLElement>        { return $("#editRowTime"); }
    static EDIT_ROW_MODAL_VALUE(): JQuery<HTMLElement>       { return $("#editRowValue"); }
    static EDIT_ROW_MODAL_COMMAND(): JQuery<HTMLElement>     { return $('#editRowCommand :selected'); }

    /*
            IP MODAL
     */
    static readonly BRIDGE_SELECT_DROPDOWN: JQuery<HTMLElement> = $('#bridgeSelect');
    static readonly BRIDGE_SELECT_CONFIRM: JQuery<HTMLElement> = $('#btnBridgeSelect');
    static BRIDGE_SELECTED_IP(): JQuery<HTMLElement> { return $('#bridgeSelect :selected'); }

    /*
            SAVE SEQUENCE MODAL
     */
    static readonly SAVE_SEQUENCE_TEXTAREA: JQuery<HTMLElement> = $("#saveArea");

    /*
            LIGHT SELECT MODAL
     */
    static readonly LIGHT_MODAL_TABLE: JQuery<HTMLElement> = $("#lightTable");

    /*
        COMMAND MODAL
     */
    static readonly COMMAND_MODAL_INPUTAREA: JQuery<HTMLElement> = $("#commandModalContent");
    static readonly COMMAND_MODAL_CMDBRIGHTNESS: JQuery<HTMLElement> = $("#radioBtnBrightness");
    static readonly COMMAND_MODAL_CMDON: JQuery<HTMLElement> = $("#radioBtnOn");
    static readonly COMMAND_MODAL_CMDOFF: JQuery<HTMLElement> = $("#radioBtnOff");
    static readonly COMMAND_MODAL_CMDCOLOR: JQuery<HTMLElement> = $("#radioBtnColor");
    static readonly COMMAND_MODAL_CMDPAGE: JQuery<HTMLElement> = $("#radioBtnPage");

    static readonly COMMAND_MODAL_SUBMIT: JQuery<HTMLElement> = $("#btnCommandSubmit");

    static MODAL_TIME_INPUT(): JQuery<HTMLElement> { return $("#commandTimeInput"); }
    static MODAL_LIGHT_INPUT(): JQuery<HTMLElement> { return $("#commandLightInput"); }
    static MODAL_TRANSITION_INPUT(): JQuery<HTMLElement> { return $("#commandTransitionInput"); }
    static MODAL_BRIGHTNESS_INPUT(): JQuery<HTMLElement> { return $("#commandBrightnessInput"); }
    static MODAL_RED_INPUT(): JQuery<HTMLElement> { return $("#commandRedInput"); }
    static MODAL_GREEN_INPUT(): JQuery<HTMLElement> { return $("#commandGreenInput"); }
    static MODAL_BLUE_INPUT(): JQuery<HTMLElement> { return $("#commandBlueInput"); }
    static MODAL_PAGE_INPUT(): JQuery<HTMLElement> { return $("#commandPageInput"); }

    /*
            LOAD SEQUENCE MODAL
     */
    static readonly LOAD_SEQUENCE_SUBMIT: JQuery<HTMLElement> = $("#btnSubmitLoadModal")
}
