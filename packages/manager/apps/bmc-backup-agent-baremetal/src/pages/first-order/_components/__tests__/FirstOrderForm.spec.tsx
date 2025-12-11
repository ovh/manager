import React from 'react';
import { ReactNode } from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { BAREMETAL_MOCK } from '@ovh-ux/backup-agent/mocks/baremetals/baremetals.mocks';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { FirstOrderFormComponent } from '../first-order-form/FirstOrderForm.component';

vi.mock('@ovh-ux/manager-module-order', () => ({
  useOrderURL: () => 'https://test',
}));

vi.mock('@ovh-ux/manager-react-shell-client', () => ({
  useNavigationGetUrl: () => 'https://test',
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');

  return {
    ...actual,
    useNavigate: () => vi.fn(),
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
  Trans: vi
    .fn()
    .mockImplementation(({ children }: { children: React.ReactNode }) => <p>{children}</p>),
}));

// --- Mock translation ---
vi.mock('@ovhcloud/ods-components/react', () => ({
  OdsMessage: vi
    .fn()
    .mockImplementation(({ children }: { children: React.ReactNode }) => <p>{children}</p>),
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

const { useBaremetalsListMock } = vi.hoisted(() => ({
  useBaremetalsListMock: vi
    .fn()
    .mockReturnValue({ flattenData: undefined, isLoading: true, isError: false }),
}));

vi.mock('@ovh-ux/backup-agent/data/hooks/baremetal/useBaremetalsList', () => {
  return {
    useBaremetalsList: useBaremetalsListMock,
  };
});

vi.mock('@/hooks/onboarding/useOnboardingData', () => ({
  useOnboardingContent: () => ({
    productName: 'TestProduct',
    productCategory: 'Category',
    brand: 'BrandX',
    title: 'Welcome!',
    heroImage: { src: '/hero.png', alt: 'Hero alt' },
    tiles: [
      { id: '1', key: 'discover', linkKey: 'discover' },
      { id: '2', key: 'faq', linkKey: 'faq' },
    ],
  }),
}));

// --- Mock manager-react-components ---
interface OnboardingLayoutProps {
  title: string;
  img?: { src: string; alt: string };
  description: ReactNode;
  orderButtonLabel: string;
}

vi.mock('@/components/onboarding/onboardingLayout/OnboardingLayout.component', () => ({
  OnboardingLayout: ({ title, img, description }: OnboardingLayoutProps) => (
    <div>
      <h1 data-testid="title">{title}</h1>
      {img && <img data-testid="hero" src={img.src} alt={img.alt} />}
      <div data-testid="description">{description}</div>
    </div>
  ),
}));

const getSelectBaremetal = () => screen.getByTestId('select-baremetal');

describe('FirstOrderFormComponent', () => {
  it.each([[true], [false]])(
    'renders onboarding and expected disabled if no baremetal : $expectedDisabled',
    async (isLoadingMock) => {
      useBaremetalsListMock.mockReturnValue({
        flattenData: BAREMETAL_MOCK,
        isLoading: isLoadingMock,
        isError: false,
      });

      render(<FirstOrderFormComponent />);

      await waitFor(
        () => expect(getSelectBaremetal()).toHaveAttribute('data-disabled', `${isLoadingMock}`),
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

    render(<FirstOrderFormComponent />);

    await waitFor(() => expect(screen.getAllByRole('option').length).toBe(BAREMETAL_MOCK.length));

    await user.click(
      screen.getByRole('button', { name: `translated_${NAMESPACES.ACTIONS}:start` }),
    );

    await waitFor(() =>
      expect(screen.getByText(`translated_${NAMESPACES.FORM}:required_field`)).toBeInTheDocument(),
    );

    await waitFor(() => expect(getSelectBaremetal()).toHaveAttribute('data-disabled', 'false'), {
      timeout: 1000,
    });
    await user.selectOptions(getSelectBaremetal(), ['baremetal-server-1']);

    await waitFor(
      () =>
        expect(
          screen.queryByText(`translated_${NAMESPACES.FORM}:error_required_field`),
        ).not.toBeInTheDocument(),
      { timeout: 1000 },
    );
  });
});
