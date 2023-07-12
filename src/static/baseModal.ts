import {WebElements} from "./webElements";

export class BaseModal {

    /**
     * Show method: Defines backdrop and makes the modal show
     */
    public static show(element: JQuery<HTMLElement>) {

        if (!WebElements.COMMAND_MODAL_DISCARD.get()[0].classList.contains("hidden")) {
            WebElements.COMMAND_MODAL_DISCARD.get()[0].classList.add('hidden');
        }

        element.modal({backdrop: "static"});
        element.modal('show');
    }

    /**
     * Hide method: Closes the modal
     */
    public static hide(element: JQuery<HTMLElement>) {
        element.modal('hide');
    }
}
