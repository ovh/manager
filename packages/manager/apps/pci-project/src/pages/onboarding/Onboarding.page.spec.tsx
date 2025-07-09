import { ReactNode, SyntheticEvent } from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ShellContextType } from '@ovh-ux/manager-react-shell-client';
import OnboardingPage from './Onboarding.page';
import { createWrapper, shellContext } from '@/wrapperRenders';

function createCustomWrapper({
  region,
  ovhSubsidiary,
  kycValidated,
}: {
  region: string;
  ovhSubsidiary: string;
  kycValidated?: boolean;
}) {
  const customShellContext = {
    ...shellContext,
    environment: {
      getUser: () => ({ ovhSubsidiary }),
      getRegion: () => region,
      kycValidated,
    },
  };
  return createWrapper((customShellContext as unknown) as ShellContextType);
}

vi.mock('react-router-dom', async () => {
  const mod = await vi.importActual('react-router-dom');
  return {
    ...mod,
    useNavigate: vi.fn(),
    Navigate: () => null,
  };
});

vi.mock('@ovhcloud/ods-components/react', async () => {
  const mod = await vi.importActual('@ovhcloud/ods-components/react');
  return {
    ...mod,
    OdsText: ({ children }: { children: ReactNode }) => (
      <p className="ods-text">{children}</p>
    ),
    OdsMessage: ({ children }: { children: ReactNode }) => (
      <div className="ods-message">{children}</div>
    ),
    OdsCheckbox: ({
      name,
      inputId,
      isChecked,
      onOdsChange,
      children,
    }: {
      name: string;
      inputId: string;
      isChecked: boolean;
      onOdsChange: (e: SyntheticEvent) => void;
      children: ReactNode;
    }) => (
      <>
        <input
          type="checkbox"
          id={inputId}
          name={name}
          checked={isChecked}
          onChange={(e) => onOdsChange(e)}
        />
        {children}
      </>
    ),
    OdsLink: ({ label, href }: { label: string; href: string }) => (
      <a href={href}>{label}</a>
    ),
  };
});

vi.mock('@/data/hooks/useCart', async () => ({
  useContractAgreements: vi.fn().mockReturnValue({
    data: [
      { name: 'mock-contract-name-1', url: 'mock-contract-url-1' },
      { name: 'mock-contract-name-2', url: 'mock-contract-url-2' },
      { name: 'mock-contract-name-3', url: 'mock-contract-url-3' },
    ],
  }),
  useCreateCart: vi.fn().mockReturnValue({ data: null }),
  useFinalizeCart: vi.fn().mockReturnValue({ data: null }),
}));

vi.mock('@/pages/onboarding/DiscoveryGuard.component', () => ({
  default: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

describe('OnboardingPage', () => {
  describe('Regions others than US', () => {
    const wrapper = createCustomWrapper({ region: 'FR', ovhSubsidiary: 'FR' });

    it('does not display the US version of the page', () => {
      const { queryByTestId } = render(<OnboardingPage />, { wrapper });
      expect(queryByTestId('discovery-page')).toBeVisible();
      expect(queryByTestId('discovery-page-us')).toBeNull();
    });
  });

  describe('US region', () => {
    const wrapper = createCustomWrapper({ region: 'US', ovhSubsidiary: 'US' });

    it('displays a different page than non-US region', () => {
      const { queryByTestId } = render(<OnboardingPage />, { wrapper });
      expect(queryByTestId('discovery-page-us')).toBeVisible();
      expect(queryByTestId('discovery-page')).toBeNull();
    });

    it('show a link to project creation as call to action', () => {
      const { getByTestId } = render(<OnboardingPage />, { wrapper });
      expect(getByTestId('project-creation-redirection-cta')).toBeVisible();
    });
  });

  describe('IT subsidiary', () => {
    it('display italy-specific agreement', () => {
      const { getByTestId } = render(<OnboardingPage />, {
        wrapper: createCustomWrapper({ region: 'IT', ovhSubsidiary: 'IT' }),
      });
      const commonContractAgreements = getByTestId('contracts-agreements');
      const italyContractsAgreement = getByTestId('italy-agreements');
      expect(commonContractAgreements).toBeVisible();
      expect(italyContractsAgreement).toBeVisible();
    });
  });

  it('KYC in Indian subsidiary', () => {
    const wrapper = createCustomWrapper({ region: 'IN', ovhSubsidiary: 'IN' });
    const { getByTestId } = render(<OnboardingPage />, { wrapper });
    expect(getByTestId('kyc-message')).toBeVisible();
  });
});
