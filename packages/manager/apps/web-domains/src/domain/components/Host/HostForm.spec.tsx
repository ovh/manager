import '@/common/setupTests';
import { PropsWithChildren } from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@/common/utils/test.provider';
import { vi } from 'vitest';
import { FormProvider, useForm } from 'react-hook-form';
import HostForm from '@/domain/components/Host/HostForm';
import {
  DrawerActionEnum,
  IpsSupportedEnum,
} from '@/domain/enum/hostConfiguration.enum';
import { serviceInfoDetail } from '@/domain/__mocks__/serviceInfoDetail';

const mocks = vi.hoisted(() => ({
  getHostnameErrorMessageMock: vi.fn(),
  getIpsErrorMessageMock: vi.fn(),
  tranformIpsStringToArrayMock: vi.fn((value: string) =>
    value
      .split(',')
      .map((v) => v.trim())
      .filter((v) => v !== ''),
  ),
}));

vi.mock('@/domain/utils/utils', () => ({
  getHostnameErrorMessage: mocks.getHostnameErrorMessageMock,
  getIpsErrorMessage: mocks.getIpsErrorMessageMock,
  tranformIpsStringToArray: mocks.tranformIpsStringToArrayMock,
}));

type FormValues = {
  host: string;
  ips: string;
};

function FormWrapper({ children }: PropsWithChildren) {
  const methods = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: { host: '', ips: '' },
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
    tranformIpsStringToArrayMock.mockImplementation((value: string) =>
      value
        .split(',')
        .map((v) => v.trim())
        .filter((v) => v !== ''),
    );
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

    fireEvent.change(hostInput, { target: { value: 'bad-host' } });
    fireEvent.blur(hostInput);

    await waitFor(() => {
      expect(getHostnameErrorMessageMock).toHaveBeenCalledWith(
        'bad-host',
        'testdomain-puweb.com',
        serviceInfoDetail.targetSpec.hostsConfiguration.hosts,
      );
    });

    expect(
      await screen.findByText(
        'domain_tab_hosts_drawer_add_invalid_host_format',
      ),
    ).toBeInTheDocument();
  });

  it('does not validate hostname in Modify mode and input is readonly', async () => {
    renderHostForm({ drawerAction: DrawerActionEnum.Modify });

    const [hostInput] = screen.getAllByRole('textbox');

    expect(hostInput).toHaveAttribute('readonly');

    fireEvent.change(hostInput, { target: { value: 'bad-host' } });
    fireEvent.blur(hostInput);

    await waitFor(() => {
      expect(getHostnameErrorMessageMock).not.toHaveBeenCalled();
    });
  });

  it('displays ips error when validation fails', async () => {
    getIpsErrorMessageMock.mockReturnValue(
      'domain_tab_hosts_drawer_add_invalid_ips_format',
    );

    renderHostForm();

    const [, ipsInput] = screen.getAllByRole('textbox');

    fireEvent.change(ipsInput, { target: { value: 'not-an-ip' } });
    fireEvent.blur(ipsInput);

    await waitFor(() => {
      expect(getIpsErrorMessageMock).toHaveBeenCalledWith(
        ['not-an-ip'],
        IpsSupportedEnum.All,
      );
    });

    expect(
      await screen.findByText('domain_tab_hosts_drawer_add_invalid_ips_format'),
    ).toBeInTheDocument();
  });

  it('shows warning message when ips list is not empty', async () => {
    renderHostForm();

    const [, ipsInput] = screen.getAllByRole('textbox');

    fireEvent.change(ipsInput, { target: { value: '1.2.3.4' } });

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
