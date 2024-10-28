import { LightningElement, api } from 'lwc';

export default class CreateCaseModal extends LightningElement {
    @api recordId;

    handleSuccess() {
        this.dispatchEvent(new CustomEvent('success', { detail: 'Case created correctly' }));
    }

    handleError(event) {
        this.dispatchEvent(new CustomEvent('error', { detail: event.detail }));
    }

    closeModal() {
        this.dispatchEvent(new CustomEvent('close'));
    }
}