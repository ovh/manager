import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { ShellContext, ShellContextType } from '@ovh-ux/manager-react-shell-client';

import { logStreamsMock } from '../../data/mocks/logStream.mock';
import { logSubscriptionsMock } from '../../data/mocks/logSubscription.mock';
import { LogSubscription } from '../../data/types/dbaas/logs';
import DataStreamActions, {
  DATA_STREAM_SUBSCRIPTION_LOADING_TEST_ID,
} from './DataStreamActions.component';

const useLogSubscriptionsMockValue: {
  data: typeof logSubscriptionsMock;
  isPending: boolean;
  error: Error | null;
} = {
  data: logSubscriptionsMock,
  isPending: false,
  error: null,
};

vi.mock('../../data/hooks/useLogSubscriptions', async (importOriginal) => {
  const actual: typeof import('../../data/hooks/useLogSubscriptions') = await importOriginal();
  return {
    ...actual,
    useLogSubscriptions: vi.fn(() => useLogSubscriptionsMockValue),
  };
});

let getStreamSubscriptionMockValue: LogSubscription | undefined;

vi.mock('../../helpers/getStreamSubscription', async (importOriginal) => {
  const actual: typeof import('../../helpers/getStreamSubscription') = await importOriginal();
  return {
    ...actual,
    default: vi.fn(() => getStreamSubscriptionMockValue),
  };
});

const mockSubButton = 'mock sub button';

vi.mock('./DataStreamSubscribeButton.component', () => {
  return {
    default: vi.fn(() => <div>{mockSubButton}</div>),
  };
});

const mockUnsubButton = 'mock unsub button';

vi.mock('./DataStreamUnsubscribeButton.component', () => {
  return {
    default: vi.fn(() => <div>{mockUnsubButton}</div>),
  };
});

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
      <ShellContext.Provider value={shellContext as unknown as ShellContextType}>
        <DataStreamActions stream={logStreamsMock[0]} />
      </ShellContext.Provider>
    </QueryClientProvider>,
  );
};

describe('data-stream actions', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render skeleton when loading retention data', () => {
    useLogSubscriptionsMockValue.isPending = true;
    const { getByTestId } = renderComponent();

    expect(getByTestId(DATA_STREAM_SUBSCRIPTION_LOADING_TEST_ID)).toBeVisible();
  });

  it('should render error message when api return an error', async () => {
    useLogSubscriptionsMockValue.error = new Error();

    const { getByText } = renderComponent();

    await waitFor(() => expect(getByText('error_datagrid_cell')).toBeVisible());
  });

  type TTestCases = {
    mockedStreamSubscription: typeof getStreamSubscriptionMockValue;
    mockRender: string;
  };

  const testCases: TTestCases[] = [
    {
      mockedStreamSubscription: logSubscriptionsMock[0],
      mockRender: mockUnsubButton,
    },
    {
      mockedStreamSubscription: undefined,
      mockRender: mockSubButton,
    },
  ];

  it.each(testCases)(
    'should render $mockRender for case $mockedStreamSubscription',
    ({ mockedStreamSubscription, mockRender }) => {
      useLogSubscriptionsMockValue.isPending = false;
      useLogSubscriptionsMockValue.error = null;
      getStreamSubscriptionMockValue = mockedStreamSubscription;

      const { getByText, queryByText, queryByTestId } = renderComponent();

      expect(queryByTestId(DATA_STREAM_SUBSCRIPTION_LOADING_TEST_ID)).not.toBeInTheDocument();
      expect(queryByText('error_datagrid_cell')).not.toBeInTheDocument();

      expect(getByText(mockRender)).toBeVisible();
    },
  );
});
