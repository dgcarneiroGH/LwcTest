import { LightningElement, api } from 'lwc';

export default class CreateCaseModal extends LightningElement {
    @api recordId;

    handleSuccess() {
        this.dispatchEvent(new CustomEvent('success'));
    }

    handleError(event) {
        this.dispatchEvent(new CustomEvent('error', { detail: event.detail }));
    }

    handleSubmit(event) {
        console.log('Formulario enviado');
    }

    closeModal() {
        this.dispatchEvent(new CustomEvent('close'));
    }
}