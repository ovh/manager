import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, waitFor } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';
import {
  ClusterRetention,
  RetentionTypeEnum,
} from '../../data/types/dbaas/logs';
import DataStreamRetention, {
  DATA_STREAM_RETENTION_LOADING_TEST_ID,
} from './DataStreamRetention.component';

const useLogRetentionMockValue: any = {
  data: {
    isSupported: true,
    retentionId: '123',
    retentionType: RetentionTypeEnum.LOGS_COLD_STORAGE,
    duration: 'P1M',
  },
  isPending: false,
  error: null,
};

vi.mock('../../data/hooks/useLogRetention', () => ({
  useLogRetention: vi.fn(() => useLogRetentionMockValue),
}));

const shellContext = {
  environment: {
    getUser: vi.fn(),
    getUserLocale: vi.fn().mockReturnValue('fr_FR'),
    getRegion: vi.fn(),
  },
};

const renderComponent = () => {
  const queryClient = new QueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <ShellContext.Provider
        value={(shellContext as unknown) as ShellContextType}
      >
        <DataStreamRetention
          retentionId="retentionId"
          clusterId="clusterId"
          serviceName="serviceName"
        />
      </ShellContext.Provider>
    </QueryClientProvider>,
  );
};

describe('data-stream retention status', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render skeleton when loading retention data', () => {
    useLogRetentionMockValue.isPending = true;
    const { getByTestId } = renderComponent();

    expect(getByTestId(DATA_STREAM_RETENTION_LOADING_TEST_ID)).toBeVisible();
  });

  it('should render error message when api return an error', () => {
    useLogRetentionMockValue.error = new Error();

    const { getByText } = renderComponent();

    waitFor(() => expect(getByText('error_datagrid_cell')).toBeVisible());
  });

  type TTestCases = {
    duration: ClusterRetention['duration'];
    displayedValue: string;
  };

  const testCases: TTestCases[] = [
    {
      duration: 'P1M',
      displayedValue: '1 month',
    },
    { duration: undefined, displayedValue: '-' },
  ];

  it.each(testCases)(
    'should render $displayedValue for duration $duration',
    ({ duration, displayedValue }) => {
      useLogRetentionMockValue.isPending = false;
      useLogRetentionMockValue.error = null;
      useLogRetentionMockValue.data.duration = duration;
      const { getByText, queryByText, queryByTestId } = renderComponent();

      expect(
        queryByTestId(DATA_STREAM_RETENTION_LOADING_TEST_ID),
      ).not.toBeInTheDocument();
      expect(queryByText('error_datagrid_cell')).not.toBeInTheDocument();

      expect(getByText(displayedValue)).toBeVisible();
    },
  );
});
