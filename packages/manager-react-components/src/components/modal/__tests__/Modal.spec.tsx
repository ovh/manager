import { vi, describe, it, beforeEach } from 'vitest';
import { MODAL_COLOR } from '@ovhcloud/ods-react';
import { fireEvent, screen, within } from '@testing-library/react';
import { renderModal, heading, ModalContent, actions } from './ModalTest.utils';

describe('Modal Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays the basic modal', () => {
    renderModal({ heading, children: <ModalContent /> });
    expect(screen.queryByText(heading)).toBeInTheDocument();
    expect(screen.queryByTestId('test-input')).toBeInTheDocument();
  });

  it('displays the modal with actions and calls onClick', () => {
    renderModal({ heading, children: <ModalContent />, ...actions });
    const primaryButton = screen.getByTestId('primary-button');
    const secondaryButton = screen.getByTestId('secondary-button');

    expect(primaryButton.textContent).toBe('Confirm');
    expect(primaryButton.className).toContain('default');
    expect(primaryButton).not.toBeDisabled();

    expect(secondaryButton.textContent).toBe('Cancel');
    expect(secondaryButton.className).toContain('ghost');
    expect(secondaryButton).not.toBeDisabled();

    fireEvent.click(primaryButton);
    expect(actions.primaryButton.onClick).toHaveBeenCalled();

    fireEvent.click(secondaryButton);
    expect(actions.secondaryButton.onClick).toHaveBeenCalled();
  });

  it('displays loading Modal', () => {
    renderModal({
      heading,
      children: <ModalContent />,
      ...actions,
      loading: true,
    });

    expect(screen.queryByLabelText('Test Input')).not.toBeInTheDocument();
    expect(screen.queryByTestId('primary-button')).not.toBeInTheDocument();
    expect(screen.queryByTestId('secondary-button')).not.toBeInTheDocument();
    expect(
      within(screen.getByTestId('spinner')).queryByRole('progressbar'),
    ).toBeInTheDocument();
  });

  it('displays disabled primary and secondary buttons', () => {
    renderModal({
      heading,
      children: <ModalContent />,
      ...{
        primaryButton: {
          ...actions.primaryButton,
          disabled: true,
        },
        secondaryButton: {
          ...actions.secondaryButton,
          disabled: true,
        },
      },
    });

    const primaryButton = screen.getByTestId('primary-button');
    const secondaryButton = screen.getByTestId('secondary-button');

    expect(primaryButton).toBeDisabled();
    expect(secondaryButton).toBeDisabled();

    fireEvent.click(primaryButton);
    expect(actions.primaryButton.onClick).not.toHaveBeenCalled();

    fireEvent.click(secondaryButton);
    expect(actions.secondaryButton.onClick).not.toHaveBeenCalled();
  });

  it('displays loading primary and secondary buttons', () => {
    renderModal({
      heading,
      children: <ModalContent />,
      ...{
        primaryButton: {
          ...actions.primaryButton,
          loading: true,
        },
        secondaryButton: {
          ...actions.secondaryButton,
          loading: true,
        },
      },
    });

    expect(
      within(screen.getByTestId('primary-button')).queryByRole('progressbar'),
    ).toBeInTheDocument();
    expect(
      within(screen.getByTestId('secondary-button')).queryByRole('progressbar'),
    ).toBeInTheDocument();
  });

  it('displays he modal whith new test ids', () => {
    renderModal({
      heading,
      children: <ModalContent />,
      ...{
        primaryButton: {
          ...actions.primaryButton,
          testId: 'new-primary-button-testid',
        },
        secondaryButton: {
          ...actions.secondaryButton,
          testId: 'new-secondary-button-testid',
        },
      },
    });

    expect(screen.getByTestId('new-primary-button-testid')).toBeInTheDocument();
    expect(
      screen.getByTestId('new-secondary-button-testid'),
    ).toBeInTheDocument();
  });

  it('displays the modal with critical type', () => {
    renderModal({
      heading,
      children: <ModalContent />,
      ...actions,
      type: MODAL_COLOR.critical,
    });

    const primaryButton = screen.getByTestId('primary-button');

    expect(primaryButton.className).toContain('critical');
  });
});
