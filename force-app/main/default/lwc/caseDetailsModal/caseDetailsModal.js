import { LightningElement, api } from 'lwc';

export default class CaseDetailsModal extends LightningElement {
    @api caseData;

    closeModal() {
        this.dispatchEvent(new CustomEvent('close'));
    }
}