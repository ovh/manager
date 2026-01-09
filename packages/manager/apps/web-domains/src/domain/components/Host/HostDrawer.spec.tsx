import '@/common/setupTests';
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@/common/utils/test.provider';
import { vi } from 'vitest';
import HostDrawer from '@/domain/components/Host/HostDrawer';
import { DrawerActionEnum } from '@/common/enum/common.enum';
import { serviceInfoDetail } from '@/domain/__mocks__/serviceInfoDetail';
import { useUpdateDomainResource } from '@/domain/hooks/data/query';

vi.mock('@/domain/hooks/data/query', () => ({
  useUpdateDomainResource: vi.fn(),
}));

const addSuccess = vi.fn();
const addError = vi.fn();
const clearNotifications = vi.fn();

vi.mock('@ovh-ux/manager-react-components', async (importOriginal) => {
  const actual = (await importOriginal()) as typeof import('@ovh-ux/manager-react-components');

  return {
    ...actual,
    useNotifications: () => ({
      addSuccess,
      addError,
      clearNotifications,
    }),
  };
});

describe('HostDrawer', () => {
  const updateDomain = vi.fn();

  const sampleHost = serviceInfoDetail.targetSpec.hostsConfiguration.hosts[0];

  const baseProps = {
    setDrawer: vi.fn(),
    ipv4Supported: true,
    ipv6Supported: true,
    multipleIPsSupported: true,
    serviceName: 'example.com',
    checksum: serviceInfoDetail.checksum,
    targetSpec: serviceInfoDetail.targetSpec,
    hostData: sampleHost,
  };

  const defaultPropsAdd = {
    ...baseProps,
    drawer: { isOpen: true, action: DrawerActionEnum.Add },
  };

  const defaultPropsModify = {
    ...baseProps,
    drawer: { isOpen: true, action: DrawerActionEnum.Modify },
    hostData: sampleHost,
  };

  const getPrimaryButton = () => {
    const drawer = screen.getByTestId('drawer');
    const button = drawer.querySelector(
      'ods-button[variant="default"]',
    ) as HTMLElement | null;

    if (!button) {
      throw new Error('Primary button not found');
    }

    return button;
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useUpdateDomainResource).mockReturnValue({
      updateDomain,
      isUpdateDomainPending: false,
    } as any);
  });

  it('renders the drawer with add title and suffix .serviceName in Add mode', () => {
    render(<HostDrawer {...defaultPropsAdd} />);

    expect(screen.getByTestId('drawer')).toBeInTheDocument();
    expect(
      screen.getByText('domain_tab_hosts_drawer_add_title'),
    ).toBeInTheDocument();

    expect(screen.getByText('.example.com')).toBeInTheDocument();
  });

  it('submits form and calls updateDomain on valid input in Add mode', async () => {
    render(<HostDrawer {...defaultPropsAdd} />);

    const [hostInput, ipsInput] = screen.getAllByRole('textbox');

    fireEvent.change(hostInput, { target: { value: 'test' } });
    fireEvent.change(ipsInput, { target: { value: '1.2.3.4' } });

    const primaryButton = getPrimaryButton();

    await waitFor(() => {
      expect(primaryButton).not.toBeDisabled();
    });

    fireEvent.click(primaryButton);

    await waitFor(() => {
      expect(updateDomain).toHaveBeenCalledTimes(1);
    });

    const [[payload, callbacks]] = updateDomain.mock.calls as [
      [
        any,
        {
          onSuccess: () => void;
          onError: (e: unknown) => void;
          onSettled: () => void;
        },
      ],
    ];

    expect(payload).toMatchObject({
      currentTargetSpec: serviceInfoDetail.targetSpec,
      updatedSpec: {
        hostsConfiguration: {
          hosts: expect.arrayContaining([
            expect.objectContaining({
              host: 'test.example.com',
              ips: ['1.2.3.4'],
            }),
          ]),
        },
      },
    });

    callbacks.onSuccess();
    expect(addSuccess).toHaveBeenCalledWith(
      'domain_tab_hosts_drawer_add_success_message',
    );

    callbacks.onSettled();
    expect(clearNotifications).toHaveBeenCalled();
  });

  it('calls addError when updateDomain fails in Add mode', async () => {
    render(<HostDrawer {...defaultPropsAdd} />);

    const [hostInput, ipsInput] = screen.getAllByRole('textbox');

    fireEvent.change(hostInput, { target: { value: 'fail' } });
    fireEvent.change(ipsInput, { target: { value: '1.1.1.1' } });

    const primaryButton = getPrimaryButton();

    await waitFor(() => {
      expect(primaryButton).not.toBeDisabled();
    });

    fireEvent.click(primaryButton);

    await waitFor(() => {
      expect(updateDomain).toHaveBeenCalled();
    });

    const [[, callbacks]] = updateDomain.mock.calls as [
      [
        any,
        {
          onSuccess: () => void;
          onError: (e: unknown) => void;
          onSettled: () => void;
        },
      ],
    ];

    callbacks.onError('Some error');
    expect(addError).toHaveBeenCalledWith(
      'domain_tab_hosts_drawer_add_error_message',
    );
  });

  it('prefills form and uses modify success message in Modify mode', async () => {
    render(<HostDrawer {...defaultPropsModify} />);

    expect(
      screen.getByText('domain_tab_hosts_drawer_modify_title'),
    ).toBeInTheDocument();

    const [hostInput, ipsInput] = screen.getAllByRole('textbox');

    const expectedHostPrefix = sampleHost.host.split('.')[0];
    const expectedIps = String(sampleHost.ips);

    expect(hostInput).toHaveValue(expectedHostPrefix);
    expect(ipsInput).toHaveValue(expectedIps);

    fireEvent.change(hostInput, { target: { value: 'updated-host' } });
    fireEvent.change(ipsInput, { target: { value: '9.9.9.9' } });

    const primaryButton = getPrimaryButton();

    await waitFor(() => {
      expect(primaryButton).not.toBeDisabled();
    });

    fireEvent.click(primaryButton);

    await waitFor(() => {
      expect(updateDomain).toHaveBeenCalledTimes(1);
    });

    const [[payload, callbacks]] = updateDomain.mock.calls as [
      [
        any,
        {
          onSuccess: () => void;
          onError: (e: unknown) => void;
          onSettled: () => void;
        },
      ],
    ];

    expect(payload).toMatchObject({
      currentTargetSpec: serviceInfoDetail.targetSpec,
      updatedSpec: {
        hostsConfiguration: {
          hosts: expect.arrayContaining([
            expect.objectContaining({
              host: 'updated-host.example.com',
              ips: ['9.9.9.9'],
            }),
          ]),
        },
      },
    });

    callbacks.onSuccess();
    expect(addSuccess).toHaveBeenCalledWith(
      'domain_tab_hosts_drawer_modify_success_message',
    );

    callbacks.onSettled();
    expect(clearNotifications).toHaveBeenCalled();
  });
});
