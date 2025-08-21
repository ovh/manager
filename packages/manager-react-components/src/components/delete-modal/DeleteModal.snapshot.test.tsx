import { vitest } from 'vitest';
import { waitFor } from '@testing-library/react';
import { render } from '../../utils/test.provider';
import { DeleteModal } from './DeleteModal.component';
import { DeleteModalProps } from './DeleteModal.props';

export const sharedProps: DeleteModalProps = {
  onClose: vitest.fn(),
  onConfirmDelete: vitest.fn(),
  serviceTypeName: 'serviceType',
  open: true,
};

describe('Delete Modal component', () => {
  it('renders basic modal', () => {
    const { asFragment } = render(<DeleteModal {...sharedProps} />);
    waitFor(() => {
      expect(asFragment()).toMatchSnapshot();
    });
  });

  it('renders loading modal', () => {
    const { asFragment } = render(<DeleteModal {...sharedProps} isLoading />);
    waitFor(() => {
      expect(asFragment()).toMatchSnapshot();
    });
  });

  it('renders modal with error', () => {
    const { asFragment } = render(
      <DeleteModal {...sharedProps} error="Test error message" />,
    );
    waitFor(() => {
      expect(asFragment()).toMatchSnapshot();
    });
  });

  it('renders modal with custom service type', () => {
    const { asFragment } = render(
      <DeleteModal {...sharedProps} serviceTypeName="Custom Service" />,
    );
    waitFor(() => {
      expect(asFragment()).toMatchSnapshot();
    });
  });

  it('renders modal with children content', () => {
    const { asFragment } = render(
      <DeleteModal {...sharedProps}>
        <div>Additional content</div>
      </DeleteModal>,
    );
    waitFor(() => {
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
