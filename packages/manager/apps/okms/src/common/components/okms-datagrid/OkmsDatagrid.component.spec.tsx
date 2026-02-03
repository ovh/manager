import React from 'react';

import { MemoryRouter } from 'react-router-dom';

import { okmsMock } from '@key-management-service/mocks/kms/okms.mock';
import { render, screen } from '@testing-library/react';
import { describe, it, vi } from 'vitest';

import { labels } from '@/common/utils/tests/init.i18n';
import { testWrapperBuilder } from '@/common/utils/tests/testWrapperBuilder';
import { SERVICE_KEYS_LABEL } from '@/constants';

import { OkmsDatagrid } from './OkmsDatagrid.component';
import { OkmsDatagridType } from './okmsDatagrid.type';

vi.mock('react-router-dom', async (importOriginal) => {
  const module: typeof import('react-router-dom') = await importOriginal();
  return {
    ...module,
    useNavigate: () => vi.fn(),
    useHref: vi.fn((link: string) => link),
    useSearchParams: vi.fn(),
  };
});

vi.mock('@ovh-ux/manager-module-common-api', async (importOriginal) => {
  const module: typeof import('@ovh-ux/manager-module-common-api') = await importOriginal();
  return {
    ...module,
    useServiceDetails: vi.fn(() => ({
      data: { data: { resource: { state: 'mockedState' } } },
    })),
  };
});

const columns = {
  name: labels.listing.key_management_service_listing_name_cell,
  id: labels.listing.key_management_service_listing_id_cell,
  status: labels.listing.key_management_service_listing_status_cell,
  secretCount: labels.listing.key_management_service_listing_secret_cell,
  kmipCount: labels.listing.key_management_service_listing_kmip_cell,
  servicekeyCount: SERVICE_KEYS_LABEL,
  region: labels.listing.key_management_service_listing_region_cell,
  terminate: labels.listing.key_management_service_listing_terminate,
};

describe('Okms Datagrid tests suite', () => {
  const renderComponent = async (type: OkmsDatagridType) => {
    const wrapper = await testWrapperBuilder()
      .withQueryClient()
      .withI18next()
      .withShellContext()
      .build();

    return render(
      <MemoryRouter>
        <OkmsDatagrid type={type} okmsList={okmsMock} />
      </MemoryRouter>,
      { wrapper },
    );
  };

  it('should display the according columns when kms type is used', async () => {
    await renderComponent('kms');

    // visible columns
    expect(await screen.findAllByText(columns.name)).toHaveLength(1);
    expect(await screen.findAllByText(columns.id)).toHaveLength(1);
    expect(await screen.findAllByText(columns.kmipCount)).toHaveLength(1);
    expect(await screen.findAllByText(columns.servicekeyCount)).toHaveLength(1);
    expect(await screen.findAllByText(columns.region)).toHaveLength(1);
    expect(await screen.findAllByText(columns.status)).toHaveLength(1);

    // hidden columns
    expect(screen.queryByText(columns.secretCount)).not.toBeInTheDocument();
  });

  it('should display the according columns when secret-manager type is used', async () => {
    await renderComponent('secret-manager');

    // visible columns
    expect(await screen.findAllByText(columns.name)).toHaveLength(1);
    expect(await screen.findAllByText(columns.id)).toHaveLength(1);
    expect(await screen.findAllByText(columns.secretCount)).toHaveLength(1);
    expect(await screen.findAllByText(columns.status)).toHaveLength(1);

    // hidden columns
    expect(screen.queryByText(columns.kmipCount)).not.toBeInTheDocument();
    expect(screen.queryByText(columns.servicekeyCount)).not.toBeInTheDocument();
    expect(screen.queryByText(columns.region)).not.toBeInTheDocument();
  });
});
