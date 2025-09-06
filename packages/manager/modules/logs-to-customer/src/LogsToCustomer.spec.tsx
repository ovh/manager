import { screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { logKindsMock } from './data/mocks/logKind.mock';
import { renderTest } from './test-utils';

describe('LogsToCustomer module', () => {
  it('should display an error if /log/kind api is KO', async () => {
    await renderTest({ isLogKindsKO: true });

    await waitFor(() => expect(screen.getByTestId('logKinds-error')).toBeVisible(), {
      timeout: 10_000,
    });
  });

  it('should render a loading state when the api request is pending', async () => {
    await renderTest();

    expect(screen.getByTestId('logKinds-spinner')).toBeVisible();
  });

  it('should render an empty state when there is no log kinds', async () => {
    await renderTest({ nbLogKind: 0 });

    await waitFor(
      () => expect(screen.getByText('log_kind_empty_state_description')).toBeDefined(),
      {
        timeout: 10_000,
      },
    );
  });

  it('should not render the log kind select when there is only one log kind', async () => {
    await renderTest({ nbLogKind: 1 });

    await waitFor(() => expect(screen.queryByTestId('logKindSelect')).not.toBeInTheDocument(), {
      timeout: 10_000,
    });
    expect(screen.queryByText('log_kind_selector_select_label')).not.toBeInTheDocument();
    expect(screen.queryByText(logKindsMock?.[0]?.displayName ?? '')).not.toBeInTheDocument();
  });

  it('should render the log kind select when there is 2 or more log kinds', async () => {
    await renderTest();

    await waitFor(() => expect(screen.queryByTestId('logKindSelect')).toBeInTheDocument(), {
      timeout: 10_000,
    });
    expect(screen.queryByText('log_kind_selector_select_label')).toBeInTheDocument();
    expect(screen.queryAllByTestId('logKindOption')).toHaveLength(logKindsMock.length);
  });
});
