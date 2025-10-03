import { vitest } from 'vitest';
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
    const { container } = render(<DeleteModal {...sharedProps} />);
    expect(container.parentElement).toMatchSnapshot();
  });

  it('renders loading modal', () => {
    const { container } = render(<DeleteModal {...sharedProps} isLoading />);
    expect(container.parentElement).toMatchSnapshot();
  });

  it('renders modal with error', () => {
    const { container } = render(
      <DeleteModal {...sharedProps} error="Test error message" />,
    );
    expect(container.parentElement).toMatchSnapshot();
  });

  it('renders modal with custom service type', () => {
    const { container } = render(
      <DeleteModal {...sharedProps} serviceTypeName="Custom Service" />,
    );
    expect(container.parentElement).toMatchSnapshot();
  });

  it('renders modal with children content', () => {
    const { container } = render(
      <DeleteModal {...sharedProps}>
        <div>Additional content</div>
      </DeleteModal>,
    );
    expect(container.parentElement).toMatchSnapshot();
  });
});
