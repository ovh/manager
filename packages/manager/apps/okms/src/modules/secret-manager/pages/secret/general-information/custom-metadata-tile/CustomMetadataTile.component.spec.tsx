import { okmsRoubaix1Mock } from '@key-management-service/mocks/kms/okms.mock';
import { mockSecret1 } from '@secret-manager/mocks/secrets/secrets.mock';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { Secret } from '@secret-manager/types/secret.type';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { labels } from '@/common/utils/tests/init.i18n';
import { testWrapperBuilder } from '@/common/utils/tests/testWrapperBuilder';

import { CustomMetadataTile } from './CustomMetadataTile.component';

vi.mock('@/common/hooks/useRequiredParams', () => ({
  useRequiredParams: vi.fn(() => ({ okmsId: 'mockedOkmsId' })),
}));

vi.mock('react-router-dom', async (importOriginal) => {
  const module: typeof import('react-router-dom') = await importOriginal();

  return {
    ...module,
    useNavigate: () => vi.fn(),
    useHref: vi.fn((link: string) => link),
  };
});

const mockUseOkmsById = vi.fn();
vi.mock('@key-management-service/data/hooks/useOkms', () => ({
  useOkmsById: (okmsId: string): unknown => mockUseOkmsById(okmsId),
}));

describe('Secrets Custom Metadata Tile component tests suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseOkmsById.mockReturnValue({
      data: okmsRoubaix1Mock,
      isPending: false,
    });
  });

  it('should display metadata tags and link when custom metadata is present', async () => {
    const wrapper = await testWrapperBuilder()
      .withI18next()
      .withQueryClient()
      .withRouterContext()
      .build();
    const { container } = render(<CustomMetadataTile secret={mockSecret1} />, { wrapper });

    // Title
    expect(screen.getByText('Metadata')).toBeVisible();

    // Tags from custom metadata (rendered as ODS badges with label attributes)
    expect(
      container.querySelector('ods-badge[label="environment:production"]'),
    ).toBeInTheDocument();
    expect(
      container.querySelector('ods-badge[label="application:payment-service"]'),
    ).toBeInTheDocument();

    // Link to edit custom metadata
    const expectedHref = SECRET_MANAGER_ROUTES_URLS.secretEditCustomMetadataDrawer(
      'mockedOkmsId',
      mockSecret1.path,
    );

    const link = await screen.findByRole('link', {
      name: labels.secretManager.edit_custom_metadata,
    });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', expectedHref);
  });

  it('should not display tags when custom metadata is not present and show a different link', async () => {
    const secretWithoutCustomMetadata: Secret = {
      ...mockSecret1,
      metadata: {
        ...mockSecret1.metadata,
        customMetadata: undefined,
      },
    };

    const wrapper = await testWrapperBuilder()
      .withI18next()
      .withQueryClient()
      .withRouterContext()
      .build();
    const { container } = render(<CustomMetadataTile secret={secretWithoutCustomMetadata} />, {
      wrapper,
    });

    // Title
    expect(screen.getByText('Metadata')).toBeVisible();

    // Tags should not be rendered
    expect(container.querySelector('ods-badge')).not.toBeInTheDocument();

    // Link should still be rendered
    const expectedHref = SECRET_MANAGER_ROUTES_URLS.secretEditCustomMetadataDrawer(
      'mockedOkmsId',
      secretWithoutCustomMetadata.path,
    );

    const link = await screen.findByRole('link', {
      name: labels.secretManager.add_custom_metadata,
    });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', expectedHref);
  });
});
