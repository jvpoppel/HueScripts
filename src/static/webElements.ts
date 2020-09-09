/**
 * Enum-ish implementation for getting all jQuery selectors in other classess.
 */
export class WebElements {

    /*
            MAIN PAGE
     */
    static readonly SEQUENCE_AREA: JQuery<HTMLElement>                      = $("#divTable");
    static readonly SEQUENCE_TABLE: JQuery<HTMLElement>                     = $("#cmdTable");
    static readonly TIMER: JQuery<HTMLElement>                              = $("#timer");
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
    static readonly BRIDGE_SELECT_IP: JQuery<HTMLElement> = $('#bridgeSelect :selected');

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

}