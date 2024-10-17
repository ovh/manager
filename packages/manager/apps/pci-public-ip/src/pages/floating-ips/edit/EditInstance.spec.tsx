import {
  QueryClient,
  QueryClientProvider,
  UseMutationResult,
  UseQueryResult,
} from '@tanstack/react-query';
import { act, fireEvent, render } from '@testing-library/react';
import { describe, vi } from 'vitest';
import {
  OdsSelectValueChangeEventDetail,
  OsdsSelect,
} from '@ovhcloud/ods-components';
import EditInstancePage from './EditInstance.page';

import * as useFloatingIPModule from '@/api/hooks/useFloatingIP';
import * as useInstanceModule from '@/api/hooks/useInstance';
import { FloatingIP, Instance } from '@/interface';

type UseUpdateInstanceReturnType = UseMutationResult<
  any,
  Error,
  void,
  unknown
> & { attach: () => void };

vi.mock('react-router-dom', () => ({
  useNavigate: () => ({
    navigate: vi.fn(),
  }),
  useParams: () => {
    return {
      projectId: 'project-id-param',
      ipId: '1234THU9',
    };
  },
  useSearchParams: () => [new URLSearchParams()],
}));

const renderEditInstancePage = () => {
  const queryClient = new QueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <EditInstancePage />
    </QueryClientProvider>,
  );
};

describe('EditInstancePage tests', () => {
  it('should display spinner when a floatingIP fetch isLoading.', () => {
    vi.spyOn(useFloatingIPModule, 'useAllFloatingIP').mockReturnValue({
      data: [],
      isLoading: true,
    } as UseQueryResult<FloatingIP[]>);
    vi.spyOn(useInstanceModule, 'useFilteredInstance').mockReturnValue({
      filteredInstances: [],
      isLoading: false,
    });

    const { getByTestId } = renderEditInstancePage();

    expect(getByTestId('editInstancePage_spinner-loading')).toBeVisible();
  });

  it('should display spinner when a instances fetch isLoading', () => {
    vi.spyOn(useFloatingIPModule, 'useAllFloatingIP').mockReturnValue({
      data: [],
      isLoading: false,
    } as UseQueryResult<FloatingIP[]>);
    vi.spyOn(useInstanceModule, 'useFilteredInstance').mockReturnValue({
      filteredInstances: [],
      isLoading: true,
    });

    const { getByTestId } = renderEditInstancePage();

    expect(getByTestId('editInstancePage_spinner-loading')).toBeVisible();
  });

  it('should display spinner when a the updateInstance isPending', () => {
    vi.spyOn(useFloatingIPModule, 'useAllFloatingIP').mockReturnValue({
      data: [],
      isLoading: false,
    } as UseQueryResult<FloatingIP[]>);
    vi.spyOn(useInstanceModule, 'useFilteredInstance').mockReturnValue({
      filteredInstances: [],
      isLoading: false,
    });
    /**
     * TODO: type the return correctly
     */
    vi.spyOn(useFloatingIPModule, 'useUpdateInstance').mockReturnValue(({
      isPending: true,
      attach: vi.fn(),
    } as unknown) as UseUpdateInstanceReturnType);

    const { getByTestId } = renderEditInstancePage();

    expect(getByTestId('editInstancePage_spinner-loading')).toBeVisible();
  });

  it('should display spinner when all pending and loading are false', () => {
    vi.spyOn(useFloatingIPModule, 'useAllFloatingIP').mockReturnValue({
      data: [],
      isLoading: false,
    } as UseQueryResult<FloatingIP[]>);
    vi.spyOn(useInstanceModule, 'useFilteredInstance').mockReturnValue({
      filteredInstances: [],
      isLoading: false,
    });
    vi.spyOn(useFloatingIPModule, 'useUpdateInstance').mockReturnValue(({
      isPending: false,
    } as unknown) as UseUpdateInstanceReturnType);

    const { queryByTestId } = renderEditInstancePage();

    expect(
      queryByTestId('editInstancePage_spinner-loading'),
    ).not.toBeInTheDocument();
  });

  it('should display noInstance info message when the filteredInstance array is empty', () => {
    vi.spyOn(useFloatingIPModule, 'useAllFloatingIP').mockReturnValue({
      data: [],
      isLoading: false,
    } as UseQueryResult<FloatingIP[]>);
    vi.spyOn(useInstanceModule, 'useFilteredInstance').mockReturnValue({
      filteredInstances: [],
      isLoading: false,
    });
    vi.spyOn(useFloatingIPModule, 'useUpdateInstance').mockReturnValue(({
      isPending: false,
    } as unknown) as UseUpdateInstanceReturnType);

    const { queryByTestId } = renderEditInstancePage();

    expect(queryByTestId('editInstancePage_message_noInstance')).toBeVisible();
  });

  it('should select the first element of filteredInstance by default', () => {
    vi.spyOn(useFloatingIPModule, 'useAllFloatingIP').mockReturnValue({
      data: [],
      isLoading: false,
    } as UseQueryResult<FloatingIP[]>);

    const filteredInstances = [
      {
        id: 'id-instance-1',
        name: 'instance-1',
        ipAddresses: [
          {
            ip: 'ip-1',
            type: 'type-1',
            version: 1,
            networkId: 'networkId-1',
            gatewayIp: 'gatewayIp-1',
          },
        ],
      },
      {
        id: 'id-instance-2',
        name: 'instance-2',
        ipAddresses: [
          {
            ip: 'ip-2',
            type: 'type-2',
            version: 2,
            networkId: 'networkId-2',
            gatewayIp: 'gatewayIp-2',
          },
        ],
      },
    ] as Instance[];

    vi.spyOn(useInstanceModule, 'useFilteredInstance').mockReturnValue({
      filteredInstances,
      isLoading: false,
    });
    vi.spyOn(useFloatingIPModule, 'useUpdateInstance').mockReturnValue(({
      isPending: false,
    } as unknown) as UseUpdateInstanceReturnType);

    const { getByTestId } = renderEditInstancePage();
    const selectInstance = getByTestId('editInstancePage_select_instance');

    expect(selectInstance).toHaveValue(filteredInstances[0].id);
  });

  it('should select the ipAddresses linked to the selected instance when instance select changes', () => {
    vi.spyOn(useFloatingIPModule, 'useAllFloatingIP').mockReturnValue({
      data: [],
      isLoading: false,
    } as UseQueryResult<FloatingIP[]>);

    const filteredInstances = [
      {
        id: 'id-instance-1',
        name: 'instance-1',
        ipAddresses: [
          {
            ip: 'ip-1',
            type: 'type-1',
            version: 1,
            networkId: 'networkId-1',
            gatewayIp: 'gatewayIp-1',
          },
        ],
      },
      {
        id: 'id-instance-2',
        name: 'instance-2',
        ipAddresses: [
          {
            ip: 'ip-2',
            type: 'type-2',
            version: 2,
            networkId: 'networkId-2',
            gatewayIp: 'gatewayIp-2',
          },
        ],
      },
    ] as Instance[];

    vi.spyOn(useInstanceModule, 'useFilteredInstance').mockReturnValue({
      filteredInstances,
      isLoading: false,
    });
    vi.spyOn(useFloatingIPModule, 'useUpdateInstance').mockReturnValue(({
      isPending: false,
    } as unknown) as UseUpdateInstanceReturnType);

    const { getByTestId } = renderEditInstancePage();
    const selectInstance = (getByTestId(
      'editInstancePage_select_instance',
    ) as unknown) as OsdsSelect;
    const selectIPAddresses = (getByTestId(
      'editInstancePage_select_IPAddresses',
    ) as unknown) as OsdsSelect;

    expect(selectInstance).toHaveValue(filteredInstances[0].id);
    expect(selectIPAddresses).toHaveValue(
      filteredInstances[0].ipAddresses[0].ip,
    );

    act(() => {
      selectInstance.odsValueChange.emit({
        value: filteredInstances[1].id,
      } as OdsSelectValueChangeEventDetail);
    });

    expect(selectInstance).toHaveValue(filteredInstances[1].id);
    expect(selectIPAddresses).toHaveValue(
      filteredInstances[1].ipAddresses[0].ip,
    );
  });

  it("should display warning message when the selected ipAddress haven't a gatewayIp", () => {
    vi.spyOn(useFloatingIPModule, 'useAllFloatingIP').mockReturnValue({
      data: [],
      isLoading: false,
    } as UseQueryResult<FloatingIP[]>);

    const filteredInstances = [
      {
        id: 'id-instance-1',
        name: 'instance-1',
        ipAddresses: [
          {
            ip: 'ip-1',
            type: 'type-1',
            version: 1,
            networkId: 'networkId-1',
            gatewayIp: null,
          },
        ],
      },
    ] as Instance[];

    vi.spyOn(useInstanceModule, 'useFilteredInstance').mockReturnValue({
      filteredInstances,
      isLoading: false,
    });
    vi.spyOn(useFloatingIPModule, 'useUpdateInstance').mockReturnValue(({
      isPending: false,
    } as unknown) as UseUpdateInstanceReturnType);

    const { getByTestId } = renderEditInstancePage();

    expect(
      getByTestId('editInstancePage_message_noGatewayIPFound'),
    ).toBeVisible();
  });

  it('should not disable the submit button when the isPending equal false', () => {
    vi.spyOn(useFloatingIPModule, 'useAllFloatingIP').mockReturnValue({
      data: [],
      isLoading: false,
    } as UseQueryResult<FloatingIP[]>);
    const filteredInstances = [
      {
        id: 'id-instance-1',
        name: 'instance-1',
        ipAddresses: [
          {
            ip: 'ip-1',
            type: 'type-1',
            version: 1,
            networkId: 'networkId-1',
            gatewayIp: 'gatewayIp-1',
          },
        ],
      },
    ] as Instance[];
    vi.spyOn(useInstanceModule, 'useFilteredInstance').mockReturnValue({
      filteredInstances,
      isLoading: false,
    });
    vi.spyOn(useFloatingIPModule, 'useUpdateInstance').mockReturnValue(({
      isPending: false,
    } as unknown) as UseUpdateInstanceReturnType);

    const { getByTestId } = renderEditInstancePage();
    const submitButton = getByTestId('editInstancePage_button-submit');

    expect(submitButton).not.toHaveAttribute('disabled');
  });

  it('should call the attach mutation when the submit button click is triggered', () => {
    vi.spyOn(useFloatingIPModule, 'useAllFloatingIP').mockReturnValue({
      data: [],
      isLoading: false,
    } as UseQueryResult<FloatingIP[]>);
    const filteredInstances = [
      {
        id: 'id-instance-1',
        name: 'instance-1',
        ipAddresses: [
          {
            ip: 'ip-1',
            type: 'type-1',
            version: 1,
            networkId: 'networkId-1',
            gatewayIp: 'gatewayIp-1',
          },
        ],
      },
    ] as Instance[];
    vi.spyOn(useInstanceModule, 'useFilteredInstance').mockReturnValue({
      filteredInstances,
      isLoading: false,
    });
    const mockedAttach = vi.fn();
    vi.spyOn(useFloatingIPModule, 'useUpdateInstance').mockReturnValue(({
      isPending: false,
      attach: mockedAttach,
    } as unknown) as UseUpdateInstanceReturnType);

    const { getByTestId } = renderEditInstancePage();
    const submitButton = getByTestId('editInstancePage_button-submit');

    act(() => {
      fireEvent.click(submitButton);
    });

    expect(mockedAttach).toHaveBeenCalledTimes(1);
  });
});
