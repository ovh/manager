import { Mock, vitest } from 'vitest';
import '@testing-library/jest-dom';

export const sharedProps: {
  closeModal: Mock<unknown[], unknown>;
  onConfirmDelete: Mock<unknown[], unknown>;
  headline: 'headline';
  description: 'description';
  deleteInputLabel: 'deleteInputLabel';
  cancelButtonLabel: 'cancelButtonLabel';
  confirmButtonLabel: 'confirmButtonLabel';
} = {
  closeModal: vitest.fn(),
  onConfirmDelete: vitest.fn(),
  headline: 'headline',
  description: 'description',
  deleteInputLabel: 'deleteInputLabel',
  cancelButtonLabel: 'cancelButtonLabel',
  confirmButtonLabel: 'confirmButtonLabel',
};

// waiting for ODS FIX in (_a = this.modalDialog)?.close in ods-modal2.js
describe('Delete Modal component', () => {
  it('waiting for ods fix', async () => {
    expect(true).toBeTruthy();
  });
});
