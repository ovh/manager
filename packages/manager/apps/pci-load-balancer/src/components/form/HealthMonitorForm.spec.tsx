import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import HealthMonitorForm, {
  HealthMonitorFormProps,
} from './HealthMonitorForm.component';
import { TLoadBalancerPool } from '@/api/data/pool';
import { THealthMonitorFormState } from '@/api/data/health-monitor';

describe('HealthMonitorForm Component', () => {
  const mockProps = {
    title: 'Health Monitor Form',
    associatedPool: ({ protocol: 'HTTP' } as unknown) as TLoadBalancerPool,
    formState: ({
      type: '',
      name: '',
      delay: 5,
      timeout: 3,
      maxRetries: 3,
      maxRetriesDown: 3,
    } as unknown) as THealthMonitorFormState,
    isEditing: false,
    isPending: false,
    submitLabel: 'Submit',
    onChange: vi.fn(),
    onSubmit: vi.fn(),
    onCancel: vi.fn(),
  } as HealthMonitorFormProps;

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should disable submit button when form is invalid', () => {
    render(<HealthMonitorForm {...mockProps} />);

    const submitButton = screen.getByTestId('HealthMonitorForm-submit_button');

    expect(submitButton).toBeDisabled();
  });

  it('should enable submit button when form is valid', () => {
    render(
      <HealthMonitorForm
        {...mockProps}
        formState={{
          ...mockProps.formState,
          type: 'http',
          name: 'ValidName',
        }}
      />,
    );

    const submitButton = screen.getByTestId('HealthMonitorForm-submit_button');

    expect(submitButton).not.toBeDisabled();
  });

  it('should show urlPath and expectedCode fields when type is HTTP', () => {
    render(
      <HealthMonitorForm
        {...mockProps}
        formState={{
          ...mockProps.formState,
          type: 'http',
        }}
      />,
    );

    expect(screen.getByTestId('HealthMonitorForm_urlPath_field')).toBeVisible();

    expect(
      screen.getByTestId('HealthMonitorForm_expectedCode_field'),
    ).toBeVisible();
  });

  it('should show urlPath and expectedCode fields when type is HTTPs', () => {
    render(
      <HealthMonitorForm
        {...mockProps}
        formState={{
          ...mockProps.formState,
          type: 'https',
        }}
      />,
    );

    expect(screen.getByTestId('HealthMonitorForm_urlPath_field')).toBeVisible();

    expect(
      screen.getByTestId('HealthMonitorForm_expectedCode_field'),
    ).toBeVisible();
  });

  it('should hide urlPath and expectedCode when type is not HTTP or HTTPS', () => {
    render(
      <HealthMonitorForm
        {...mockProps}
        formState={{
          ...mockProps.formState,
          type: 'tcp',
        }}
      />,
    );

    expect(screen.queryByTestId('HealthMonitorForm_urlPath_field')).toBeNull();

    expect(
      screen.queryByTestId('HealthMonitorForm_expectedCode_field'),
    ).toBeNull();
  });

  it('should display a spinner when isPending is true', () => {
    render(<HealthMonitorForm {...mockProps} isPending />);

    expect(screen.getByTestId('HealthMonitorForm-spinner')).toBeVisible();
  });

  it('should handle form submission correctly', async () => {
    render(
      <HealthMonitorForm
        {...mockProps}
        formState={{
          ...mockProps.formState,
          type: 'http',
          name: 'ValidName',
        }}
      />,
    );

    const submitButton = screen.getByTestId('HealthMonitorForm-submit_button');

    act(() => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(mockProps.onSubmit).toHaveBeenCalled();
    });
  });

  it('should call onCancel when the cancel button is clicked', async () => {
    render(<HealthMonitorForm {...mockProps} />);

    const cancelButton = screen.getByTestId('HealthMonitorForm-cancel_button');

    act(() => {
      fireEvent.click(cancelButton);
    });

    await waitFor(() => {
      expect(mockProps.onCancel).toHaveBeenCalledOnce();
    });
  });
});
