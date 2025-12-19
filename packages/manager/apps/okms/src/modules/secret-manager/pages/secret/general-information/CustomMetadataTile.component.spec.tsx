import { mockSecret1 } from '@secret-manager/mocks/secrets/secrets.mock';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { Secret } from '@secret-manager/types/secret.type';
import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { labels } from '@/common/utils/tests/init.i18n';
import { renderWithI18n } from '@/common/utils/tests/testUtils';
import { getOdsButtonByLabel } from '@/common/utils/tests/uiTestHelpers';

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

describe('Secrets Custom Metadata Tile component tests suite', () => {
  it('should display metadata tags and link when custom metadata is present', async () => {
    const { container } = await renderWithI18n(<CustomMetadataTile secret={mockSecret1} />);

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

    const link = await getOdsButtonByLabel({
      container,
      label: labels.secretManager.edit_custom_metadata,
      isLink: true,
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

    const { container } = await renderWithI18n(
      <CustomMetadataTile secret={secretWithoutCustomMetadata} />,
    );

    // Title
    expect(screen.getByText('Metadata')).toBeVisible();

    // Tags should not be rendered
    expect(container.querySelector('ods-badge')).not.toBeInTheDocument();

    // Link should still be rendered
    const expectedHref = SECRET_MANAGER_ROUTES_URLS.secretEditCustomMetadataDrawer(
      'mockedOkmsId',
      secretWithoutCustomMetadata.path,
    );

    const link = await getOdsButtonByLabel({
      container,
      label: labels.secretManager.add_custom_metadata,
      isLink: true,
    });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', expectedHref);
  });
});
