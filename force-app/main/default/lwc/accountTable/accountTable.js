import { LightningElement, api, wire } from 'lwc';
import getCasesByAccountId from '@salesforce/apex/CaseController.getCasesByAccountId';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';

const COLUMNS = [
    { label: 'Case number', fieldName: 'CaseNumber' },
    { label: 'Type', fieldName: 'Type' },
    { label: 'SubType', fieldName: 'Subtype__c' },
    { label: 'Reason', fieldName: 'Reason' },
    { label: 'Contact name', fieldName: 'ContactId' },
    {
        type: 'button-icon',
        typeAttributes: {
            iconName: 'utility:info',
            name: 'view_info',
            variant: 'bare',
            alternativeText: 'Information'
        },
        initialWidth: 50
    },
];

export default class AccountTable extends LightningElement {
    @api recordId;
    columns = COLUMNS;
    cases = [];
    isCreateModalOpen = false;
    isInfoModalOpen = false;
    searchTerm = '';
    selectedCase = {};

    @wire(getCasesByAccountId, { accountId: '$recordId' })
    wiredAccount(result) {
        this.wiredCasesResult = result;
        const { data, error } = result;

        if (data) {
            this.cases = data.map(c => ({
                ...c,
                ContactName: c.Contact ? c.Contact.Name : '',
                ContactEmail: c.Contact ? c.Contact.Email : '',
                ContactPhone: c.Contact ? c.Contact.Phone : ''
            }))
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

    handleOpenCreateModal() {
        this.isCreateModalOpen = true;
    }

    handleCloseCreateModal() {
        this.isCreateModalOpen = false;
    }

    handleCreateSuccess() {
        this.handleCloseCreateModal();
        this.showToast('Éxito', 'Caso creado correctamente', 'success');
        return refreshApex(this.wiredAccount);
    }

    handleCreateError(event) {
        this.showToast('Error', event.detail.message, 'error');
    }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        if (actionName === 'view_info') {
            this.selectedCase = row;
            this.isInfoModalOpen = true;
        }
    }

    handleCloseInfoModal() {
        this.isInfoModalOpen = false;
    }

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }
}
