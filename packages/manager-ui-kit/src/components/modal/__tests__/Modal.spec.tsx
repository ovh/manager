import { fireEvent, screen } from '@testing-library/react';
import { beforeEach, describe, it, vi } from 'vitest';

import { MODAL_COLOR } from '@ovhcloud/ods-react';

import { ModalContent, actions, heading, renderModal } from './ModalTest.utils';

describe('Modal Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays the basic modal', () => {
    renderModal({ heading, children: <ModalContent /> });
    expect(screen.queryByText(heading)).toBeInTheDocument();
    expect(screen.queryByTestId('test-input')).toBeInTheDocument();
  });

  it('does not display modal-header if not provided', () => {
    renderModal({ children: <ModalContent /> });
    expect(screen.queryByRole('heading', { level: 4 })).not.toBeInTheDocument();
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
    expect(screen.getByTestId('spinner').querySelector('[data-ods="spinner"]')).toBeInTheDocument();
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

    const primaryButton = screen.getByTestId('primary-button');
    const secondaryButton = screen.getByTestId('secondary-button');

    expect(primaryButton.querySelector('[data-ods="spinner"]')).toBeInTheDocument();
    expect(secondaryButton.querySelector('[data-ods="spinner"]')).toBeInTheDocument();
  });

  it('displays the modal with new test ids', () => {
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
    expect(screen.getByTestId('new-secondary-button-testid')).toBeInTheDocument();
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
  it('should display the basic modal with steps', () => {
    renderModal({
      heading,
      children: <ModalContent />,
      ...actions,
      type: MODAL_COLOR.critical,
      step: { current: 1, total: 5 },
    });
    expect(screen.getByTestId('step-placeholder')).toBeVisible();
    expect(screen.getByText(heading)).toBeVisible();
  });

  it('should not display the step count', () => {
    renderModal({
      heading,
      children: <ModalContent />,
      ...actions,
      type: MODAL_COLOR.critical,
      step: { total: 5 },
    });
    expect(screen.queryByTestId('step-placeholder')).not.toBeInTheDocument();
    expect(screen.getByText(heading)).toBeVisible();
  });
});
