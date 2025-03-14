import React from 'react';
import { describe, vi } from 'vitest';
import { screen, render, waitFor } from '@testing-library/react';
import { OKMS } from '@/types/okms.type';
import KmipTile from './KmipTile';
import { KMIP_ENPOINT_LABEL, KMIP_RSA_LABEL } from './KmipTile.constants';

vi.mock('@ovh-ux/manager-react-shell-client', () => ({
  useOvhTracking: () => ({ trackClick: vi.fn() }),
}));

vi.mock('react-router-dom', async () => {
  const router = await vi.importActual<typeof import('react-router-dom')>(
    'react-router-dom',
  );
  return {
    ...router,
    useNavigate: () => vi.fn(),
  };
});

describe('KmipTile component tests suite', () => {
  const kms: OKMS = {
    id: 'id',
    region: 'region',
    kmipEndpoint: 'https://kmip-endpoint',
    restEndpoint: 'https://rest-endpoint',
    swaggerEndpoint: 'https://swagger-endpoint',
    kmipObjectCount: 1,
    serviceKeyCount: 2,
    iam: {
      displayName: 'name',
      id: 'id',
      urn: 'urn:resource',
    },
  };

  const renderComponent = (okms: OKMS) => render(<KmipTile okmsData={okms} />);

  test('Should display KMIP tile with only all mandatory data', async () => {
    const { container } = renderComponent(kms);

    await waitFor(() => {
      expect(screen.getByText(KMIP_ENPOINT_LABEL)).toBeVisible();
      expect(
        container.querySelector(`ods-clipboard[value="${kms.kmipEndpoint}"]`),
      ).toBeVisible();

      expect(screen.queryByText(KMIP_RSA_LABEL)).not.toBeInTheDocument();
    });
  });

  test('Should display KMIP tile with all kms data', async () => {
    const kmipRsaEndpoint = 'https://kmip-rsa-endpoint';
    const kmsData: OKMS = { ...kms, kmipRsaEndpoint };

    const { container } = renderComponent(kmsData);

    await waitFor(() => {
      expect(screen.getByText(KMIP_RSA_LABEL)).toBeVisible();
      expect(
        container.querySelector(`ods-clipboard[value="${kmipRsaEndpoint}"]`),
      ).toBeVisible();
    });
  });
});
