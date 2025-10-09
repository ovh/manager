import { vitest, describe, it, expect, beforeEach } from 'vitest';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { render } from '@/setupTest';
import { UpdateNameModal } from '../UpdateNameModal.component';
import { UpdateNameModalProps } from '../UpdateNameModal.props';

const mockUpdateDisplayName = vitest.fn();
const mockOnClose = vitest.fn();

const defaultProps: UpdateNameModalProps = {
  headline: 'Update Name',
  inputLabel: 'Display Name',
  updateDisplayName: mockUpdateDisplayName,
};

const renderComponent = (props: Partial<UpdateNameModalProps> = {}) => {
  return render(<UpdateNameModal {...defaultProps} {...props} />);
};

describe('UpdateNameModal', () => {
  beforeEach(() => {
    vitest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render with required props', () => {
      renderComponent();

      expect(screen.getByText('Update Name')).toBeInTheDocument();
      expect(screen.getByText('Display Name')).toBeInTheDocument();
      expect(screen.getByText('Annuler')).toBeInTheDocument();
      expect(screen.getByText('Confirmer')).toBeInTheDocument();
    });

    it('should render with all optional props', () => {
      renderComponent({
        description: 'Please enter a new name',
        defaultValue: 'John Doe',
        cancelButtonLabel: 'Cancel',
        confirmButtonLabel: 'Update',
        pattern: '^[a-zA-Z\\s]+$',
        patternMessage: 'Only letters and spaces allowed',
      });

      expect(screen.getByText('Please enter a new name')).toBeInTheDocument();
      expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('Update')).toBeInTheDocument();
      expect(
        screen.getByText('Only letters and spaces allowed'),
      ).toBeInTheDocument();
    });

    it('should not render when isOpen is false', () => {
      renderComponent({ isOpen: false });

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should render error message when error prop is provided', () => {
      renderComponent({ error: 'Name already exists' });
      expect(screen.getByText(/Name already exists/)).toBeInTheDocument();
    });

    it('should not render description when description prop is not provided', () => {
      renderComponent();
      expect(
        screen.queryByText('Please enter a new name'),
      ).not.toBeInTheDocument();
    });

    it('should not render pattern message when patternMessage prop is not provided', () => {
      renderComponent();
      expect(
        screen.queryByText('Only letters and spaces allowed'),
      ).not.toBeInTheDocument();
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete user workflow', async () => {
      renderComponent({
        description: 'Please enter your new name',
        defaultValue: 'Old Name',
        pattern: '^[a-zA-Z\\s]+$',
        patternMessage: 'Only letters and spaces allowed',
        onClose: mockOnClose,
      });

      expect(
        screen.getByText('Please enter your new name'),
      ).toBeInTheDocument();
      expect(screen.getByDisplayValue('Old Name')).toBeInTheDocument();

      const input = screen.getByLabelText('Display Name');
      fireEvent.change(input, { target: { value: 'New Name' } });

      await waitFor(() => {
        expect(input).not.toHaveAttribute('aria-invalid', 'true');
      });

      const confirmButton = screen.getByText('Confirmer');
      fireEvent.click(confirmButton);

      expect(mockUpdateDisplayName).toHaveBeenCalledWith('New Name');
    });

    it('should handle error state workflow', () => {
      renderComponent({
        error: 'Name already exists',
        onClose: mockOnClose,
      });

      expect(screen.getByText(/Name already exists/)).toBeInTheDocument();

      const cancelButton = screen.getByText('Annuler');
      fireEvent.click(cancelButton);

      expect(mockOnClose).toHaveBeenCalled();
    });
  });
});
