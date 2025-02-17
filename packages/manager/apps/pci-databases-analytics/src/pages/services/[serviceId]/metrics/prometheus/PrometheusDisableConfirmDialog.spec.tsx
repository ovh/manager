import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PrometheusDisableConfirmDialog from './PrometheusDisableConfirmDialog.component';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('PrometheusDisableConfirmDialog', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render the confirmation dialog with correct title and description', () => {
    render(
      <PrometheusDisableConfirmDialog onCancel={vi.fn()} onConfirm={vi.fn()} />,
    );

    expect(
      screen.getByTestId('prometheus-disable-confirm-dialog'),
    ).toBeInTheDocument();
    expect(screen.getByText('confirmDisableDialogTitle')).toBeInTheDocument();
    expect(
      screen.getByText('confirmDisableDialogDescription'),
    ).toBeInTheDocument();
  });

  it('should call onCancel when the cancel button is clicked', () => {
    const onCancelMock = vi.fn();

    render(
      <PrometheusDisableConfirmDialog
        onCancel={onCancelMock}
        onConfirm={vi.fn()}
      />,
    );

    const cancelButton = screen.getByTestId(
      'prometheus-disable-confirm-dialog-cancel-button',
    );
    fireEvent.click(cancelButton);

    expect(onCancelMock).toHaveBeenCalled();
  });

  it('should call onConfirm when the confirm button is clicked', () => {
    const onConfirmMock = vi.fn();

    render(
      <PrometheusDisableConfirmDialog
        onCancel={vi.fn()}
        onConfirm={onConfirmMock}
      />,
    );

    const confirmButton = screen.getByTestId(
      'prometheus-disable-confirm-dialog-confirm-button',
    );
    fireEvent.click(confirmButton);

    expect(onConfirmMock).toHaveBeenCalled();
  });

  it('should display the correct cancel and confirm button labels', () => {
    render(
      <PrometheusDisableConfirmDialog onCancel={vi.fn()} onConfirm={vi.fn()} />,
    );

    expect(
      screen.getByTestId('prometheus-disable-confirm-dialog-cancel-button'),
    ).toHaveTextContent('confirmDisableDialogCancel');
    expect(
      screen.getByTestId('prometheus-disable-confirm-dialog-confirm-button'),
    ).toHaveTextContent('confirmDisableDialogConfirm');
  });
});
