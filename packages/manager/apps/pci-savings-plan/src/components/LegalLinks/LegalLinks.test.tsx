import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import React from 'react';
import { render, waitFor } from '@/utils/testProvider';
import LegalLinks from './LegalLinks';
import { SavingsPlanContract } from '@/types';
import { US_LEGAL_LINKS } from '@/constants';
import { queryClient } from '@/App';

const MOCK_CONTRACTS: SavingsPlanContract[] = [
  {
    content: '',
    name: 'Conditions générales de services',
    url:
      'https://storage.gra.cloud.ovh.net/v1/AUTH_325716a587c64897acbef9a4a4726e38/contracts/9973515-contrat_genServices-FR-15.1.pdf',
  },
  {
    content: '',
    name: 'CONDITIONS PARTICULIERES DES SERVICES PUBLIC CLOUD',
    url:
      'https://storage.gra.cloud.ovh.net/v1/AUTH_325716a587c64897acbef9a4a4726e38/contracts/17fe120-Conditions_particulieres_OVH_Stack-ALL-17.0.pdf',
  },
];

let currentRegion: string | undefined;

const server = setupServer(
  http.get('/engine/apiv6/services?resourceName=789', () =>
    HttpResponse.json([123]),
  ),
  http.get('/engine/apiv6/services/789/savingsPlans/contracts', () =>
    HttpResponse.json(currentRegion === 'US' ? [] : MOCK_CONTRACTS),
  ),
);

vi.mock('@/hooks/useProject', () => ({
  useProjectId: () => '123',
}));

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useRouteLoaderData: () => ({
      serviceId: 789,
    }),
  };
});

vi.mock('@ovh-ux/manager-react-shell-client', async (importOriginal) => {
  const actual = await importOriginal<
    typeof import('@ovh-ux/manager-react-shell-client')
  >();
  const { createContext } = await import('react');
  return {
    ...actual,
    ShellContext: createContext({
      shell: {},
      environment: {
        getRegion: () => currentRegion,
      },
    }),
  };
});

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  queryClient.clear();
});
afterAll(() => server.close());

describe('LegalLinks', async () => {
  it('renders the legal links correctly', async () => {
    currentRegion = undefined;
    const { container } = render(<LegalLinks />);

    await waitFor(() => {
      MOCK_CONTRACTS.forEach((contract) => {
        expect(
          container.querySelector(
            `[label='${contract.name}'][href='${contract.url}']`,
          ),
        ).toBeInTheDocument();
      });
    });
  });

  it('renders the hardcoded US legal links when region is US (API returns no contract)', async () => {
    currentRegion = 'US';
    const { container } = render(<LegalLinks />);

    await waitFor(() => {
      Object.entries(US_LEGAL_LINKS).forEach(([name, url]) => {
        expect(
          container.querySelector(`[label='${name}'][href='${url}']`),
        ).toBeInTheDocument();
      });
    });
  });
});
