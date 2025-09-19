import React from 'react';
import { describe, vi } from 'vitest';
import { screen, render, waitFor } from '@testing-library/react';
import { ServiceDetails } from '@ovh-ux/manager-react-components';
import { OKMS } from '@/types/okms.type';
import InformationsTile from './InformationsTile';

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

describe('InformationsTile component tests suite', () => {
  const kms: OKMS = {
    id: 'id',
    region: 'region',
    kmipEndpoint: 'https://kmip-endpoint',
    restEndpoint: 'https://rest-endpoint',
    swaggerEndpoint: 'https://swagger-endpoint',
    kmipObjectCount: 1,
    serviceKeyCount: 2,
    secretCount: 3,
    iam: {
      displayName: 'name',
      id: 'id',
      urn: 'urn:resource',
    },
  };

  const serviceInfo = ({
    resource: {
      displayName: 'kms display name',
      name: 'name',
      product: null,
      resellingProvider: null,
      state: null,
    },
    billing: null,
    customer: null,
    parentServiceId: null,
    route: null,
    serviceId: null,
    tags: null,
  } as unknown) as ServiceDetails;

  test('Should display information tile with only all mandatory data', async () => {
    const { container } = render(
      <InformationsTile
        okmsData={kms}
        okmsDisplayName={serviceInfo.resource.displayName}
      />,
    );

    await waitFor(() => {
      expect(
        screen.getByText('key_management_service_dashboard_field_label_name'),
      ).toBeVisible();
      expect(screen.getByText(serviceInfo.resource.displayName)).toBeVisible();
      expect(screen.getByLabelText('edit')).toBeVisible();

      expect(
        screen.getByText('key_management_service_dashboard_field_label_id'),
      ).toBeVisible();
      expect(
        container.querySelector(`ods-clipboard[value="${kms.id}"]`),
      ).toBeVisible();

      expect(
        screen.getByText('key_management_service_dashboard_field_label_urn'),
      ).toBeVisible();
      expect(
        container.querySelector(`ods-clipboard[value="${kms.iam.urn}"]`),
      ).toBeVisible();

      expect(
        screen.getByText('key_management_service_dashboard_field_label_region'),
      ).toBeVisible();
      expect(screen.getByText(`region_${kms.region}`)).toBeVisible();
    });
  });
});
