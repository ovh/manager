import { vitest } from 'vitest';
import { render } from '@/setupTest';
import { UpdateNameModal } from '../UpdateNameModal.component';

const mockUpdateDisplayName = vitest.fn();
const mockOnClose = vitest.fn();

describe('UpdateNameModal Snapshot Tests', () => {
  afterEach(() => {
    vitest.resetAllMocks();
  });

  describe('Basic Modal States', () => {
    it('should render basic modal with required props', () => {
      const { container } = render(
        <UpdateNameModal
          headline="Update Name"
          inputLabel="Display Name"
          updateDisplayName={mockUpdateDisplayName}
        />,
      );
      console.log('container.parentElement', container.parentElement);

      expect(container.parentElement).toMatchSnapshot();
    });

    it('should render modal with all optional props', () => {
      const { container } = render(
        <UpdateNameModal
          headline="Update Display Name"
          description="Please enter a new display name for your account"
          inputLabel="Display Name"
          defaultValue="John Doe"
          isLoading={false}
          onClose={mockOnClose}
          updateDisplayName={mockUpdateDisplayName}
          error=""
          cancelButtonLabel="Cancel"
          confirmButtonLabel="Update"
          pattern="^[a-zA-Z\\s]+$"
          patternMessage="Only letters and spaces allowed"
          isOpen={true}
        />,
      );

      expect(container.parentElement).toMatchSnapshot();
    });

    it('should render modal when closed', () => {
      const { container } = render(
        <UpdateNameModal
          headline="Update Name"
          inputLabel="Display Name"
          updateDisplayName={mockUpdateDisplayName}
          isOpen={false}
        />,
      );

      expect(container.parentElement).toMatchSnapshot();
    });
  });

  describe('Loading States', () => {
    it('should render modal in loading state', () => {
      const { container } = render(
        <UpdateNameModal
          headline="Update Name"
          inputLabel="Display Name"
          updateDisplayName={mockUpdateDisplayName}
          isLoading={true}
        />,
      );

      expect(container.parentElement).toMatchSnapshot();
    });

    it('should render modal with loading state and default value', () => {
      const { container } = render(
        <UpdateNameModal
          headline="Update Name"
          inputLabel="Display Name"
          defaultValue="Current Name"
          updateDisplayName={mockUpdateDisplayName}
          isLoading={true}
        />,
      );

      expect(container.parentElement).toMatchSnapshot();
    });
  });

  describe('Error States', () => {
    it('should render modal with error message', () => {
      const { container } = render(
        <UpdateNameModal
          headline="Update Name"
          inputLabel="Display Name"
          updateDisplayName={mockUpdateDisplayName}
          error="Name already exists"
        />,
      );

      expect(container.parentElement).toMatchSnapshot();
    });

    it('should render modal with error and description', () => {
      const { container } = render(
        <UpdateNameModal
          headline="Update Name"
          description="Please enter a new name"
          inputLabel="Display Name"
          updateDisplayName={mockUpdateDisplayName}
          error="Invalid name format"
        />,
      );

      expect(container.parentElement).toMatchSnapshot();
    });
  });

  describe('Pattern Validation States', () => {
    it('should render modal with pattern validation', () => {
      const { container } = render(
        <UpdateNameModal
          headline="Update Name"
          inputLabel="Display Name"
          updateDisplayName={mockUpdateDisplayName}
          pattern="^[a-zA-Z\\s]+$"
          patternMessage="Only letters and spaces allowed"
        />,
      );

      expect(container.parentElement).toMatchSnapshot();
    });

    it('should render modal with pattern validation and default value', () => {
      const { container } = render(
        <UpdateNameModal
          headline="Update Name"
          inputLabel="Display Name"
          defaultValue="John Doe"
          updateDisplayName={mockUpdateDisplayName}
          pattern="^[a-zA-Z\\s]+$"
          patternMessage="Only letters and spaces allowed"
        />,
      );

      expect(container.parentElement).toMatchSnapshot();
    });

    it('should render modal with complex pattern validation', () => {
      const { container } = render(
        <UpdateNameModal
          headline="Update Name"
          inputLabel="Display Name"
          updateDisplayName={mockUpdateDisplayName}
          pattern="^[a-zA-Z0-9_-]{3,20}$"
          patternMessage="3-20 characters, letters, numbers, underscore, and dash only"
        />,
      );

      expect(container.parentElement).toMatchSnapshot();
    });
  });

  describe('Custom Button Labels', () => {
    it('should render modal with custom button labels', () => {
      const { container } = render(
        <UpdateNameModal
          headline="Update Name"
          inputLabel="Display Name"
          updateDisplayName={mockUpdateDisplayName}
          cancelButtonLabel="Go Back"
          confirmButtonLabel="Save Changes"
        />,
      );

      expect(container.parentElement).toMatchSnapshot();
    });

    it('should render modal with custom confirm button only', () => {
      const { container } = render(
        <UpdateNameModal
          headline="Update Name"
          inputLabel="Display Name"
          updateDisplayName={mockUpdateDisplayName}
          confirmButtonLabel="Save"
        />,
      );

      expect(container.parentElement).toMatchSnapshot();
    });

    it('should render modal with custom cancel button only', () => {
      const { container } = render(
        <UpdateNameModal
          headline="Update Name"
          inputLabel="Display Name"
          updateDisplayName={mockUpdateDisplayName}
          cancelButtonLabel="Back"
        />,
      );

      expect(container.parentElement).toMatchSnapshot();
    });
  });

  describe('Edge Cases', () => {
    it('should render modal with empty default value', () => {
      const { container } = render(
        <UpdateNameModal
          headline="Update Name"
          inputLabel="Display Name"
          defaultValue=""
          updateDisplayName={mockUpdateDisplayName}
        />,
      );

      expect(container.parentElement).toMatchSnapshot();
    });

    it('should render modal with null default value', () => {
      const { container } = render(
        <UpdateNameModal
          headline="Update Name"
          inputLabel="Display Name"
          defaultValue={undefined}
          updateDisplayName={mockUpdateDisplayName}
        />,
      );

      expect(container.parentElement).toMatchSnapshot();
    });

    it('should render modal without onClose handler', () => {
      const { container } = render(
        <UpdateNameModal
          headline="Update Name"
          inputLabel="Display Name"
          updateDisplayName={mockUpdateDisplayName}
        />,
      );

      expect(container.parentElement).toMatchSnapshot();
    });

    it('should render modal with long text content', () => {
      const { container } = render(
        <UpdateNameModal
          headline="This is a very long headline that might wrap to multiple lines in the modal"
          description="This is a very long description text that contains a lot of information about what the user should do when updating their display name. It might wrap to multiple lines and should be displayed properly in the modal."
          inputLabel="Display Name"
          defaultValue="This is a very long default value that might exceed the input field width"
          updateDisplayName={mockUpdateDisplayName}
          error="This is a very long error message that might wrap to multiple lines in the error display area"
          patternMessage="This is a very long pattern message that explains the validation rules in detail and might wrap to multiple lines"
        />,
      );

      expect(container.parentElement).toMatchSnapshot();
    });

    it('should render modal with special characters in text', () => {
      const { container } = render(
        <UpdateNameModal
          headline="Update Name & Details"
          description="Please enter your name (required field)"
          inputLabel="Name:"
          defaultValue="John & Jane Doe"
          updateDisplayName={mockUpdateDisplayName}
          error="Error: Invalid characters found!"
          patternMessage="Allowed: letters, numbers, & spaces"
        />,
      );

      expect(container.parentElement).toMatchSnapshot();
    });
  });

  describe('Combined States', () => {
    it('should render modal with loading, error, and pattern validation', () => {
      const { container } = render(
        <UpdateNameModal
          headline="Update Name"
          description="Please enter a valid name"
          inputLabel="Display Name"
          defaultValue="John"
          updateDisplayName={mockUpdateDisplayName}
          isLoading={true}
          error="Name too short"
          pattern="^[a-zA-Z\\s]{5,}$"
          patternMessage="Minimum 5 characters, letters and spaces only"
        />,
      );

      expect(container.parentElement).toMatchSnapshot();
    });

    it('should render modal with all features enabled', () => {
      const { container } = render(
        <UpdateNameModal
          headline="Update Display Name"
          description="Please enter a new display name for your account. This name will be visible to other users."
          inputLabel="Display Name"
          defaultValue="Current Display Name"
          isLoading={false}
          onClose={mockOnClose}
          updateDisplayName={mockUpdateDisplayName}
          error=""
          cancelButtonLabel="Cancel Changes"
          confirmButtonLabel="Save New Name"
          pattern="^[a-zA-Z\\s]{2,50}$"
          patternMessage="2-50 characters, letters and spaces only"
          isOpen={true}
        />,
      );

      expect(container.parentElement).toMatchSnapshot();
    });
  });
});
