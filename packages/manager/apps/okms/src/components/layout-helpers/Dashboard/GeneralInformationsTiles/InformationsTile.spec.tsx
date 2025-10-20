import React from 'react';
import { describe, vi } from 'vitest';
import { screen, render, waitFor } from '@testing-library/react';
import { OKMS } from '@/types/okms.type';
import InformationsTile from './InformationsTile';
import { okmsMock } from '@/mocks/kms/okms.mock';
import { kmsServicesMock } from '@/mocks/services/services.mock';

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
    ...okmsMock[0],
    iam: {
      ...okmsMock[0].iam,
      displayName: kmsServicesMock.resource.displayName,
    },
  };

  test('Should display information tile with only all mandatory data', async () => {
    const { container } = render(
      <InformationsTile
        okmsData={kms}
        okmsDisplayName={kmsServicesMock.resource.displayName}
      />,
    );

    await waitFor(() => {
      expect(
        screen.getByText('key_management_service_dashboard_field_label_name'),
      ).toBeVisible();
      expect(
        screen.getByText(kmsServicesMock.resource.displayName),
      ).toBeVisible();

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
