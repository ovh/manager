import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { useToast } from '@datatr-ux/uxlib';
import { UseQueryResult } from '@tanstack/react-query';
import ai from '@/types/AI';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import Labels from './Labels.component';
import * as labelsApi from '@/data/api/ai/job/label/label.api';
import { mockedJob, mockedJobSpec } from '@/__tests__/helpers/mocks/job/job';

describe('Configuration component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();

    vi.mock('@/pages/jobs/[jobId]/Job.context', () => ({
      useJobData: vi.fn(() => ({
        projectId: 'projectId',
        job: {
          ...mockedJob,
          spec: {
            ...mockedJobSpec,
            labels: { key: 'value' },
          },
        },
        jobQuery: {} as UseQueryResult<ai.job.Job, Error>,
      })),
    }));

    vi.mock('@/data/api/ai/job/label/label.api', () => ({
      editLabel: vi.fn((labels) => labels),
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders Configuration', async () => {
    render(<Labels />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('labels-container')).toBeTruthy();
  });

  it('trigger add label onSuccess', async () => {
    render(<Labels />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('labels-container')).toBeTruthy();
    expect(screen.getByTestId('label-add-button')).toBeTruthy();

    act(() => {
      fireEvent.change(screen.getByTestId('key-input-field'), {
        target: {
          value: 'newKey',
        },
      });
      fireEvent.change(screen.getByTestId('value-input-field'), {
        target: {
          value: 'newValue',
        },
      });
      fireEvent.click(screen.getByTestId('label-add-button'));
    });

    await waitFor(() => {
      expect(labelsApi.editLabel).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'labelToastSuccessTitle',
        description: 'labelToastSuccessDescription',
      });
    });
  });

  it('trigger delete label onSuccess', async () => {
    render(<Labels />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('labels-container')).toBeTruthy();
    expect(screen.getByTestId('button_key')).toBeTruthy();
    act(() => {
      fireEvent.click(screen.getByTestId('button_key'));
    });

    await waitFor(() => {
      expect(labelsApi.editLabel).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'labelToastSuccessTitle',
        description: 'labelToastSuccessDescription',
      });
    });
  });
});
