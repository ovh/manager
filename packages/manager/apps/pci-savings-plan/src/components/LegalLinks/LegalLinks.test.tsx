import '@testing-library/jest-dom';
import { screen, waitFor } from '@testing-library/react';
import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import React from 'react';
import { vi } from 'vitest';
import { render } from '@/utils/testProvider';
import LegalLinks from './LegalLinks';
import { SavingsPlanContract } from '@/types';

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

const server = setupServer(
  http.get('/engine/apiv6/services?resourceName=undefined', ({ request }) => {
    console.log('called  engine api v6 ', request.url);
    return HttpResponse.json([123]);
  }),
  http.get(
    '/engine/apiv6/services/123/savingsPlans/contracts',
    ({ request }) => {
      console.log('called notiffications', request.url);
      return HttpResponse.json(MOCK_CONTRACTS);
    },
  ),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('LegalLinks', async () => {
  it('renders the legal links correctly', async () => {
    render(<LegalLinks />);

    await waitFor(() => {
      expect(screen.getByText(MOCK_CONTRACTS[0].name)).toBeInTheDocument();
      expect(screen.getByText(MOCK_CONTRACTS[1].name)).toBeInTheDocument();
    });
  });
});
