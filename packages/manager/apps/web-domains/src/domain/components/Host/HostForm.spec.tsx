import '@/common/setupTests';
import { PropsWithChildren } from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
  within,
} from '@/common/utils/test.provider';
import { vi } from 'vitest';
import { FormProvider, useForm } from 'react-hook-form';
import HostForm from '@/domain/components/Host/HostForm';
import { IpsSupportedEnum } from '@/domain/enum/hostConfiguration.enum';
import { serviceInfoDetail } from '@/domain/__mocks__/serviceInfoDetail';
import { DrawerActionEnum } from '@/common/enum/common.enum';

const mocks = vi.hoisted(() => ({
  getHostnameErrorMessageMock: vi.fn(),
  getIpsErrorMessageMock: vi.fn(),
  tranformIpsStringToArrayMock: vi.fn((value: string | undefined) => {
    if (!value) return [];
    return value
      .split(',')
      .map((v) => v.trim())
      .filter((v) => v !== '');
  }),
}));

vi.mock('@/domain/utils/utils', () => ({
  makeHostValidators: vi.fn((hostsTargetSpec, serviceName, t) => ({
    noDuplicate: (value: string) =>
      mocks.getHostnameErrorMessageMock(value, serviceName, hostsTargetSpec) ||
      true,
    validSyntax: (value: string) =>
      mocks.getHostnameErrorMessageMock(value, serviceName, hostsTargetSpec) ||
      true,
  })),
  makeIpsValidator: vi.fn((ipsSupported) => ({
    noDuplicate: (value: string) => {
      const ipsArray = mocks.tranformIpsStringToArrayMock(value);
      return mocks.getIpsErrorMessageMock(ipsArray, ipsSupported) || true;
    },
    validIps: (value: string) => {
      const ipsArray = mocks.tranformIpsStringToArrayMock(value);
      return mocks.getIpsErrorMessageMock(ipsArray, ipsSupported) || true;
    },
  })),
  transformIpsStringToArray: mocks.tranformIpsStringToArrayMock,
}));

type FormValues = {
  host: string;
  ips: string;
};

function FormWrapper({ children }: PropsWithChildren) {
  const methods = useForm<FormValues>({
    mode: 'all',
    defaultValues: { host: '', ips: '' },
    criteriaMode: 'all',
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
}

const defaultProps = {
  drawerAction: DrawerActionEnum.Add,
  ipsSupported: IpsSupportedEnum.All,
  serviceName: 'testdomain-puweb.com',
  hostsTargetSpec: serviceInfoDetail.targetSpec.hostsConfiguration.hosts,
};

const renderHostForm = (props = {}) =>
  render(
    <FormWrapper>
      <HostForm {...defaultProps} {...props} />
    </FormWrapper>,
  );

const {
  getHostnameErrorMessageMock,
  getIpsErrorMessageMock,
  tranformIpsStringToArrayMock,
} = mocks;

describe('HostForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    tranformIpsStringToArrayMock.mockImplementation((value: string | undefined) => {
      if (!value) return [];
      return value
        .split(',')
        .map((v) => v.trim())
        .filter((v) => v !== '');
    });
  });

  it('renders host and ips inputs', () => {
    renderHostForm();

    expect(screen.getByTestId('host-form')).toBeInTheDocument();

    const textboxes = screen.getAllByRole('textbox');
    expect(textboxes).toHaveLength(2);
  });

  it('displays hostname error when validation fails in Add mode', async () => {
    getHostnameErrorMessageMock.mockReturnValue(
      'domain_tab_hosts_drawer_add_invalid_host_format',
    );

    renderHostForm();

    const [hostInput] = screen.getAllByRole('textbox');
    const hostField = hostInput.closest('[data-testid="form-field"]') as HTMLElement;

    await act(async () => {
      fireEvent.change(hostInput, { target: { value: 'bad-host' } });
      fireEvent.blur(hostInput);
    });

    await waitFor(() => {
      expect(getHostnameErrorMessageMock).toHaveBeenCalledWith(
        'bad-host',
        'testdomain-puweb.com',
        serviceInfoDetail.targetSpec.hostsConfiguration.hosts,
      );
    });

    await waitFor(() => {
      const errorElement = within(hostField).getByTestId('form-field-error');
      expect(errorElement).toBeInTheDocument();
      expect(errorElement).toHaveTextContent(
        'domain_tab_hosts_drawer_add_invalid_host_format',
      );
    });
  });

  it('does not validate hostname in Modify mode and input is readonly', () => {
    renderHostForm({ drawerAction: DrawerActionEnum.Modify });

    const [hostInput] = screen.getAllByRole('textbox');

    expect(hostInput).toHaveAttribute('readonly');
  });

  it('displays ips error when validation fails', async () => {
    getIpsErrorMessageMock.mockReturnValue(
      'domain_tab_hosts_drawer_add_invalid_ips_format',
    );

    renderHostForm();

    const [, ipsInput] = screen.getAllByRole('textbox');
    const ipsField = ipsInput.closest('[data-testid="form-field"]') as HTMLElement;

    await act(async () => {
      fireEvent.change(ipsInput, { target: { value: 'not-an-ip' } });
      fireEvent.blur(ipsInput);
    });

    await waitFor(() => {
      expect(getIpsErrorMessageMock).toHaveBeenCalledWith(
        ['not-an-ip'],
        IpsSupportedEnum.All,
      );
    });

    await waitFor(() => {
      const errorElement = within(ipsField).getByTestId('form-field-error');
      expect(errorElement).toBeInTheDocument();
      expect(errorElement).toHaveTextContent(
        'domain_tab_hosts_drawer_add_invalid_ips_format',
      );
    });
  });

  it('shows warning message when ips list is not empty', async () => {
    renderHostForm();

    const [, ipsInput] = screen.getAllByRole('textbox');

    await act(async () => {
      fireEvent.change(ipsInput, { target: { value: '1.2.3.4' } });
    });

    await waitFor(() => {
      expect(
        screen.getByText('domain_tab_hosts_drawer_add_form_warning_message'),
      ).toBeInTheDocument();
    });

    expect(
      screen.getByText('domain_tab_hosts_drawer_add_form_warning_list_ipv4'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('domain_tab_hosts_drawer_add_form_warning_list_ipv6'),
    ).toBeInTheDocument();
  });

  it('uses different suffix background between Add and Modify modes', () => {
    const { unmount } = renderHostForm({ drawerAction: DrawerActionEnum.Add });

    const suffixAdd = screen.getByText('.testdomain-puweb.com');
    expect(suffixAdd.className).toContain('bg-white');

    unmount();

    renderHostForm({ drawerAction: DrawerActionEnum.Modify });

    const suffixModify = screen.getByText('.testdomain-puweb.com');
    expect(suffixModify.className).toContain(
      'bg-[var(--ods-color-neutral-50)]',
    );
  });
});
