import React from 'react';
import 'element-internals-polyfill';
import '@testing-library/jest-dom';
import { vi, describe, expect } from 'vitest';
import { render } from '@/utils/test.provider';
import { platformMock, accountMock, domainMock } from '@/api/_mock_';
import { DomainType } from '@/api/domain';
import ModalDiagnosticMX from '../ModalDiagnosticMX';
import domainDiagnosticTranslation from '@/public/translations/domains/diagnostic/Messages_fr_FR.json';

vi.mock('@/hooks', () => {
  return {
    usePlatform: vi.fn(() => ({
      platformId: platformMock[0].id,
    })),
    useGenerateUrl: vi.fn(),
    useDomain: vi.fn().mockImplementation((id: string) => ({
      data: domainMock.find((domain: DomainType) => id === domain.id),
      isLoading: false,
    })),
  };
});

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
  MemoryRouter: vi.fn(() => <ModalDiagnosticMX />),
  useSearchParams: vi.fn(() => [
    new URLSearchParams({
      domainId: domainMock[0].id,
    }),
  ]),
}));

vi.mock('@ovh-ux/manager-react-shell-client', () => ({
  ShellContext: React.createContext({
    environment: {
      getUser: () => ({
        ovhSubsidiary: 'FR',
      }),
    },
  }),
}));

vi.mock('@ovh-ux/manager-react-components', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNotifications: vi.fn(() => ({
      addError: () => vi.fn(),
      addSuccess: () => vi.fn(),
    })),
  };
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Domain diagnostic srv modal', () => {
  it('should be displayed', () => {
    const { getByTestId } = render(<ModalDiagnosticMX />);
    const modal = getByTestId('modal');
    expect(modal).toHaveProperty(
      'headline',
      domainDiagnosticTranslation.zimbra_domain_modal_diagnostic_mx_title,
    );
    expect(getByTestId('diagnostic-mx-modal-secondary-btn')).toBeEnabled();
  });

  // TODO:
  // check render when domain is ovh and whn it is not
});
