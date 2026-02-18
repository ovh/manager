import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { AutoRestartColumn } from './AutoRestartColumn';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';

describe('AutoRestartColumn', () => {
  it('renders pending state instead of expiry date when job is waiting for resources', async () => {
    render(
      <AutoRestartColumn
        timeoutAutoRestart={false}
        timeoutAt="2026-01-28T13:55:10Z"
        statusCode="JOB_PENDING"
        translationNamespace="ai-tools/jobs"
      />,
      {
        wrapper: RouterWithQueryClientWrapper,
      },
    );

    expect(screen.getByText('waitingResourceLabel')).toBeTruthy();

    fireEvent.click(screen.getByTestId('pending-timeout-info-trigger'));

    await waitFor(() => {
      expect(screen.getByText('pendingTimeoutHint')).toBeTruthy();
    });
  });
});
