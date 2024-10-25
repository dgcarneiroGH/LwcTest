import { LightningElement, api, wire } from 'lwc';
import getCasesByAccountId from '@salesforce/apex/CaseController.getCasesByAccountId';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';

const COLUMNS = [
    { label: 'Case number', fieldName: 'CaseNumber' },
    { label: 'Type', fieldName: 'Type' },
    { label: 'SubType', fieldName: 'Subtype__c' },
    { label: 'Reason', fieldName: 'Reason' },
    { label: 'Contact name', fieldName: 'ContactId' }
];

export default class AccountTable extends LightningElement {
    @api recordId;
    columns = COLUMNS;
    cases = [];
    isModalOpen = false;
    searchTerm = '';

    @wire(getCasesByAccountId, { accountId: '$recordId' })
    wiredAccount(result) {
        this.wiredCasesResult = result;
        const { data, error } = result;

        if (data) {
            this.cases = data;
        } else if (error) {
            this.showToast('Error', 'Error al cargar casos', 'error');
            console.error(error);
        }
    }

    get filteredCases() {
        if (this.searchTerm) {
            return this.cases.filter(c =>
                c.Type && c.Type.toLowerCase().includes(this.searchTerm.toLowerCase())
            );
        }
        return this.cases;
    }

    handleSearchInput(event) {
        this.searchTerm = event.target.value;
    }

    handleOpenModal() {
        this.isModalOpen = true;
    }

    handleCloseModal() {
        this.isModalOpen = false;
    }

    handleSuccess() {
        this.handleCloseModal();
        this.showToast('Éxito', 'Caso creado correctamente', 'success');
        return refreshApex(this.wiredAccount);
    }

    handleError(event) {
        this.showToast('Error', event.detail.message, 'error');
    }

    handleSubmit() {
        console.log('Formulario enviado');
    }

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }
}
