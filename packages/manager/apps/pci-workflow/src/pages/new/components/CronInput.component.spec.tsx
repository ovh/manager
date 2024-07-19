import { act, fireEvent, render, waitFor } from '@testing-library/react';
import { describe, it } from 'vitest';
import {
  OdsInputValueChangeEventDetail,
  OsdsInput,
} from '@ovhcloud/ods-components';
import { CronInput } from './CronInput.component';
import { TWorkflowScheduling } from '@/pages/new/hooks/useWorkflowStepper';

describe('CronInput Component', () => {
  const initialScheduling = {
    minutes: '0',
    hour: '12',
    dom: '1',
    month: '1',
    dow: '*',
    rotation: 1,
    maxExecutionCount: 10,
  } as TWorkflowScheduling;

  it('renders CronInput component successfully', () => {
    const { getByText } = render(
      <CronInput scheduling={initialScheduling} onInput={() => {}} />,
    );
    expect(getByText(/pci_workflow_create_cron_title/i)).toBeInTheDocument();
  });

  it('updates minute field on user input', () => {
    const { getByTestId } = render(
      <CronInput scheduling={initialScheduling} onInput={() => {}} />,
    );
    const minuteInput = getByTestId(`cronInput-input_minutes`);
    act(() => {
      fireEvent.change(minuteInput, { target: { value: '15' } });
    });
    expect(minuteInput).toHaveValue('15');
  });

  it('displays error for invalid minute input', () => {
    const { getByTestId, getByText } = render(
      <CronInput scheduling={initialScheduling} onInput={() => {}} />,
    );
    const minuteInput = getByTestId(`cronInput-input_minutes`);
    act(() => {
      fireEvent.change(minuteInput, { target: { value: '60' } });
      ((minuteInput as unknown) as OsdsInput).odsValueChange.emit(({
        detail: { value: '60' },
      } as unknown) as OdsInputValueChangeEventDetail);
    });
    waitFor(() => {
      expect(getByText(/pci_workflow_create_cron_minutes/i)).toHaveClass(
        'text-error',
      );
    });
  });

  it('renders helper components for month and day of week fields', () => {
    const { getByText } = render(
      <CronInput scheduling={initialScheduling} onInput={() => {}} />,
    );
    expect(getByText('pci_workflow_create_cron_month')).toBeInTheDocument();
    expect(getByText('pci_workflow_create_cron_dow')).toBeInTheDocument();
  });
});
