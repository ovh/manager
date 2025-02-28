import React from 'react';
import { describe, vi } from 'vitest';
import { screen, render, waitFor } from '@testing-library/react';
import { ServiceDetails } from '@ovh-ux/manager-react-components';
import { OKMS } from '@/types/okms.type';
import InformationsTile from './InformationsTile';
import {
  KMIP_LABEL,
  KMIP_RSA_LABEL,
  SWAGGER_UI_LABEL,
} from './InformationsTile.constants';

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
    iam: {
      displayName: 'name',
      id: 'id',
      urn: 'urn:resource',
    },
  };

  const serviceInfo: ServiceDetails = {
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
  };

  const renderComponent = (okms: OKMS) =>
    render(<InformationsTile okmsData={okms} okmsServiceInfos={serviceInfo} />);

  test('Should display information tile with only all mandatory data', async () => {
    const { container } = renderComponent(kms);

    await waitFor(() => {
      expect(
        screen.getByText('key_management_service_dashboard_field_label_name'),
      ).toBeVisible();
      expect(screen.getByText(serviceInfo.resource.displayName)).toBeVisible();

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

      expect(
        screen.getByText(
          'key_management_service_dashboard_field_label_restApi',
        ),
      ).toBeVisible();

      expect(
        container.querySelector(`ods-clipboard[value="${kms.restEndpoint}"]`),
      ).toBeVisible();

      expect(screen.getByText(KMIP_LABEL)).toBeVisible();
      expect(
        container.querySelector(`ods-clipboard[value="${kms.kmipEndpoint}"]`),
      ).toBeVisible();

      expect(screen.getByText(SWAGGER_UI_LABEL)).toBeVisible();
      expect(
        container.querySelector(
          `ods-link[href="${kms.swaggerEndpoint}"][label="${kms.swaggerEndpoint}"]`,
        ),
      ).toBeVisible();

      expect(screen.queryByText(KMIP_RSA_LABEL)).not.toBeInTheDocument();
    });
  });

  test('Should display information tile with all kms data', async () => {
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
