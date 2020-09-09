/**
 * Enum-ish implementation for getting all jQuery selectors in other classess.
 */
export class WebElements {

    /*
            MAIN PAGE
     */
    static readonly SEQUENCE_AREA: JQuery<HTMLElement>                      = $("#divTable");
    static readonly SEQUENCE_TABLE: JQuery<HTMLElement>                     = $("#cmdTable");
    static readonly SEQUENCE_START: JQuery<HTMLElement>                     = $("#startBtn");
    static readonly SEQUENCE_STOP: JQuery<HTMLElement>                      = $("#stopBtn");
    static readonly TIMER: JQuery<HTMLElement>                              = $("#timer");
    static readonly AUDIO_SELECT:JQuery<HTMLElement>                        = $("#audioBtn");
    static readonly ADD_ROW_BUTTON: JQuery<HTMLElement>                     = $("#addBtn");
    static readonly SHOW_LIGHT_TEST: JQuery<HTMLElement>                    = $("#infBtn");
    static readonly SHOW_LOAD_SEQUENCE: JQuery<HTMLElement>                 = $("#loadBtn");
    static readonly SHOW_SAVE_SEQUENCE: JQuery<HTMLElement>                 = $("#saveBtn");
    static readonly CLEAR_SEQUENCE: JQuery<HTMLElement>                     = $("#clearBtn");
    static SEQUENCE_ROW_EDIT_BUTTON(rowNumber: number): JQuery<HTMLElement> { return $("#rowEdit_"+rowNumber);  }
    static SEQUENCE_ROW(rowNumber: number): JQuery<HTMLElement>             { return $("#row" + rowNumber);  }
    static PAGE_BUTTON(pageNumber: number): JQuery<HTMLElement>             { return $("#btnSelectPage" + pageNumber);  }

    /*
            MODALS
     */
    static readonly IP_MODAL: JQuery<HTMLElement>       = $('#ipModal');
    static readonly BRIDGE_SELECT: JQuery<HTMLElement>  = $('#bridgeModal');
    static readonly BRIDGE_SUCCESS: JQuery<HTMLElement> = $('#successModal');
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
    static readonly EDIT_ROW_MODAL_ROW_NUMBER: JQuery<HTMLElement>  = $("#editRowID");
    static readonly EDIT_ROW_MODAL_LIGHT: JQuery<HTMLElement>       = $("#editRowLight");
    static readonly EDIT_ROW_MODAL_TIME: JQuery<HTMLElement>        = $("#editRowTime");
    static readonly EDIT_ROW_MODAL_VALUE: JQuery<HTMLElement>       = $("#editRowValue");
    static readonly EDIT_ROW_MODAL_COMMAND: JQuery<HTMLElement>     = $('#editRowCommand :selected');

    /*
            BRIDGE SELECT MODAL
     */
    static readonly BRIDGE_SELECTED_IP: JQuery<HTMLElement> = $('#bridgeSelect :selected');
    static readonly BRIDGE_SELECT_IP_SELECT: JQuery<HTMLElement> = $('#btnBridgeSelect');

    /*
            SAVE SEQUENCE MODAL
     */
    static readonly SAVE_SEQUENCE_TEXTAREA: JQuery<HTMLElement> = $("#saveArea");

    /*
            LIGHT SELECT MODAL
     */
    static readonly LIGHT_MODAL_TABLE: JQuery<HTMLElement> = $("#lightTable");

    /*
            ADD ROW MODAL
     */
    static readonly ADD_ROW_MODAL_TIME: JQuery<HTMLElement>      = $("#addRowTime");
    static readonly ADD_ROW_MODAL_LIGHT: JQuery<HTMLElement>     = $("#addRowLight");
    static readonly ADD_ROW_MODAL_COMMAND: JQuery<HTMLElement>   = $('#addRowCommand :selected');
    static readonly ADD_ROW_MODAL_VALUE: JQuery<HTMLElement>     = $("#addRowValue");
    static readonly ADD_ROW_MODAL_SUBMIT: JQuery<HTMLElement>    = $("#btnRowSubmit");

    /*
            LOAD SEQUENCE MODAL
     */
    static readonly LOAD_SEQUENCE_SUBMIT: JQuery<HTMLElement> = $("#btnSubmitLoadModal")
}