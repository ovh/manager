import React from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { DrawerProps } from '@ovh-ux/manager-react-components';

import { BAREMETAL_MOCK } from '@/mocks/baremetals/baremetals.mocks';
import { mockTenantBackupPolicies } from '@/mocks/tenant/backupPolicies.mock';

import AddConfigurationPage from '../AddConfiguration.page';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');

  return {
    ...actual,
    useNavigate: () => ({ navigate: vi.fn() }),
    Link: ({ to, children, ...props }: { to: string; children: React.ReactNode }) => (
      <a href={to} {...props}>
        {children}
      </a>
    ),
  };
});

// --- Mock translation ---
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => `translated_${key}`,
  }),
}));

// --- Mock translation ---
vi.mock('@ovhcloud/ods-components/react', () => ({
  OdsText: vi
    .fn()
    .mockImplementation(({ children }: { children: React.ReactNode }) => <p>{children}</p>),
  OdsButton: vi
    .fn()
    .mockImplementation(({ label, ...props }: { children: React.ReactNode; label: string }) => (
      <button {...props}>{label}</button>
    )),
  OdsFormField: vi
    .fn()
    .mockImplementation(
      ({ children, error, ...props }: { children: React.ReactNode; error: string }) => (
        <div {...props}>
          {children}
          {!!error && <div>{error}</div>}
        </div>
      ),
    ),
  OdsCombobox: vi
    .fn()
    .mockImplementation(
      ({
        children,
        onOdsChange,
        onOdsBlur,
        isDisabled,
        isRequired,
        ...props
      }: {
        children: React.ReactNode;
        name: string;
        onOdsChange: () => void;
        isDisabled: boolean;
        isRequired: boolean;
        onOdsBlur: () => void;
      }) => (
        <select
          onChange={onOdsChange}
          onBlur={onOdsBlur}
          data-disabled={isDisabled}
          data-required={isRequired}
          data-testid={`select-${props.name}`}
          {...props}
        >
          {children}
        </select>
      ),
    ),
  OdsComboboxItem: vi
    .fn()
    .mockImplementation(({ children, ...props }: { children: React.ReactNode }) => (
      <option {...props}>{children}</option>
    )),
}));

vi.mock('@ovh-ux/manager-react-components', () => ({
  Drawer: vi
    .fn()
    .mockImplementation(
      ({
        children,
        heading,
        primaryButtonLabel,
        onPrimaryButtonClick,
        isPrimaryButtonDisabled,
        isSecondaryButtonDisabled,
        secondaryButtonLabel,
        onSecondaryButtonClick,
        ...props
      }: DrawerProps) => (
        <section data-testid={'drawer'} {...props}>
          <h2>{heading}</h2>
          {children}
          <button onClick={onPrimaryButtonClick} data-disabled={isPrimaryButtonDisabled}>
            {primaryButtonLabel}
          </button>
          <button onClick={onSecondaryButtonClick} data-disabled={isSecondaryButtonDisabled}>
            {secondaryButtonLabel}
          </button>
        </section>
      ),
    ),
}));

const { useBaremetalsListMock, useBackupTenantPoliciesMock } = vi.hoisted(() => ({
  useBaremetalsListMock: vi
    .fn()
    .mockReturnValue({ flattenData: undefined, isLoading: true, isError: false }),
  useBackupTenantPoliciesMock: vi
    .fn()
    .mockReturnValue({ data: undefined, isLoading: true, isError: false }),
}));

vi.mock('@/data/hooks/baremetal/useBaremetalsList', () => {
  return {
    useBaremetalsList: useBaremetalsListMock,
  };
});

vi.mock('@/data/hooks/tenants/useVspcTenantBackupPolicies', () => {
  return {
    useBackupTenantPolicies: useBackupTenantPoliciesMock,
  };
});

const getSelectServer = () => screen.getByTestId('select-server');
const getSelectOs = () => screen.getByTestId('select-os');

describe('FirstOrderFormComponent', () => {
  it.each([[true], [false]])(
    'renders onboarding and expected disabled if no baremetal : $expectedDisabled',
    async (isLoadingMock) => {
      useBaremetalsListMock.mockReturnValue({
        flattenData: BAREMETAL_MOCK,
        isLoading: isLoadingMock,
        isError: false,
      });
      useBackupTenantPoliciesMock.mockReturnValue({
        data: mockTenantBackupPolicies,
        isLoading: isLoadingMock,
      });

      render(<AddConfigurationPage />);

      await waitFor(
        () => expect(getSelectServer()).toHaveAttribute('data-disabled', `${isLoadingMock}`),
        { timeout: 1000 },
      );
      await waitFor(
        () => expect(getSelectOs()).toHaveAttribute('data-disabled', `${isLoadingMock}`),
        { timeout: 1000 },
      );
    },
  );

  it('renders onboarding and expected generate order link', async () => {
    useBaremetalsListMock.mockReturnValue({
      flattenData: BAREMETAL_MOCK,
      isLoading: false,
      isError: false,
    });
    const user = userEvent.setup();

    render(<AddConfigurationPage />);

    await waitFor(() => expect(getSelectServer().children.length).toBe(BAREMETAL_MOCK.length));
    await waitFor(() =>
      expect(getSelectOs().children.length).toBe(mockTenantBackupPolicies.length),
    );

    await user.click(screen.getByRole('button', { name: `translated_${NAMESPACES.ACTIONS}:add` }));

    await waitFor(() =>
      expect(screen.getAllByText(`translated_${NAMESPACES.FORM}:required_field`).length).toBe(2),
    );

    await waitFor(() => expect(getSelectServer()).toHaveAttribute('data-disabled', 'false'), {
      timeout: 1000,
    });
    await user.selectOptions(getSelectServer(), ['baremetal-server-1']);
    await user.selectOptions(getSelectOs(), ['windows']);

    await waitFor(
      () =>
        expect(
          screen.queryByText(`translated_${NAMESPACES.FORM}:error_required_field`),
        ).not.toBeInTheDocument(),
      { timeout: 1000 },
    );
  });
});
