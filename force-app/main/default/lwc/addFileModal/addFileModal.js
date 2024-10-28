import { LightningElement, api } from 'lwc';

export default class AddFileModal extends LightningElement {
    @api caseData;
    uploadedFiles;

    get acceptedFormats() {
        return ['.pdf', '.png'];
    }

    handleUploadFinished(event) {
        const newFiles = event.detail.files;

        this.uploadedFiles = this.uploadedFiles
            ? [...this.uploadedFiles, ...newFiles]
            : [...newFiles];
    }

    handleSuccess() {
        this.dispatchEvent(new CustomEvent('success', { detail: `${this.uploadedFiles.length} files uploaded correctly.` }));
    }

    closeModal() {
        this.dispatchEvent(new CustomEvent('close'));
    }
}