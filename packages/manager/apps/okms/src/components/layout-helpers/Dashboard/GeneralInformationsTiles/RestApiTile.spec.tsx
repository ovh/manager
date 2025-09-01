import React from 'react';
import { describe, vi } from 'vitest';
import { screen, render, waitFor } from '@testing-library/react';
import { getOdsButtonByLabel } from '@ovh-ux/manager-core-test-utils';
import { OKMS } from '@/types/okms.type';
import RestApiTile from './RestApiTile';
import { REST_ENDPOINT_LABEL, SWAGGER_UI_LABEL } from './RestApiTile.constants';

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

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (translationKey: string) => translationKey,
  }),
}));

describe('RestApiTile component tests suite', () => {
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

  const renderComponent = (okms: OKMS) =>
    render(<RestApiTile okmsData={okms} />);

  test('Should display REST API tile with only all mandatory data', async () => {
    const { container } = renderComponent(kms);

    await waitFor(async () => {
      expect(screen.getByText(REST_ENDPOINT_LABEL)).toBeVisible();

      expect(
        container.querySelector(`ods-clipboard[value="${kms.restEndpoint}"]`),
      ).toBeVisible();

      expect(screen.getByText(SWAGGER_UI_LABEL)).toBeVisible();
      expect(
        container.querySelector(
          `ods-link[href="${kms.swaggerEndpoint}"][label="${kms.swaggerEndpoint}"]`,
        ),
      ).toBeVisible();

      const downloadLink = await getOdsButtonByLabel({
        container,
        label: 'key_management_service_dashboard_button_label_download_ca',
        isLink: true,
      });

      expect(downloadLink).toBeVisible();
    });
  });
});
