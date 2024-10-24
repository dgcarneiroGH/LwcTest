import { LightningElement, api, wire, track } from 'lwc';
import getCasesByAccountId from '@salesforce/apex/CaseController.getCasesByAccountId';
import { createRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import CASE_OBJECT from '@salesforce/schema/Case';
import CASE_ACCOUNT_FIELD from '@salesforce/schema/Case.AccountId';

const COLUMNS = [
    { label: 'Número de caso', fieldName: 'CaseNumber' },
    { label: 'Tipo', fieldName: 'Type' },
    { label: 'Subtipo', fieldName: 'Subtype__c' },
    { label: 'Motivo', fieldName: 'Reason' },
    { label: 'Nombre de contacto', fieldName: 'ContactId' }
];

export default class AccountTable extends LightningElement {
    @api recordId;
    columns = COLUMNS;
    cases = [];

    @track isModalOpen = false;
    @track newCase = {};

    @wire(getCasesByAccountId, { recordId: '$recordId' })
    wiredAccount({ error, data }) {
        if (data) {
            this.cases = data;
        } else if (error) {
            console.error(error);
        }
    }

    get hasCases() {
        return this.cases.length > 0;
    }

    handleOpenModal() {
        console.log(this.recordId);

        this.newCase = { AccountId: this.recordId };
        this.isModalOpen = true;
    }

    handleCloseModal() {
        this.isModalOpen = false;
    }

    handleInputChange(event) {
        const field = event.target.dataset.id;
        this.newCase[field] = event.target.value;
    }

    handleSaveCase() {
        const inputFields = this.template.querySelectorAll('lightning-input-field');
        const allValid = [...inputFields].reduce((validSoFar, inputField) => {
            inputField.reportValidity();
            return validSoFar && inputField.checkValidity();
        }, true);

        console.log(allValid);
        if (allValid) {
            this.template.querySelector('lightning-record-edit-form').submit();
        } else {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'Por favor, complete todos los campos obligatorios.',
                    variant: 'error'
                })
            );
        }
    }

    handleSuccess() {
        this.handleCloseModal();
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Éxito',
                message: 'Caso creado correctamente.',
                variant: 'success'
            })
        );
    }

    handleError(event) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Error al crear el caso',
                message: event.detail.message,
                variant: 'error'
            })
        );
    }
}
