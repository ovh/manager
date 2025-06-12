import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { UseQueryResult } from '@tanstack/react-query';
import { useToast } from '@datatr-ux/uxlib';
import ai from '@/types/AI';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import Labels from './Labels.component';
import * as labelsApi from '@/data/api/ai/app/label/label.api';
import { mockedApp, mockedAppSpec } from '@/__tests__/helpers/mocks/app/app';

describe('Configuration component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();

    vi.mock('@/pages/apps/[appId]/App.context', () => ({
      useAppData: vi.fn(() => ({
        projectId: 'projectId',
        app: {
          ...mockedApp,
          spec: {
            ...mockedAppSpec,
            labels: { key: 'value' },
          },
        },
        appQuery: {} as UseQueryResult<ai.app.App, Error>,
      })),
    }));

    vi.mock('@/data/api/ai/app/label/label.api', () => ({
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
      });
    });
  });
});
