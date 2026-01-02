import { mockSecret1 } from '@secret-manager/mocks/secrets/secrets.mock';
import { Secret } from '@secret-manager/types/secret.type';
import {
  NOT_SET_VALUE_DEACTIVATE_VERSION_AFTER,
  SecretSmartConfig,
} from '@secret-manager/utils/secretSmartConfig';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { labels as allLabels } from '@/common/utils/tests/init.i18n';
import { testWrapperBuilder } from '@/common/utils/tests/testWrapperBuilder';

import { SettingsTile } from './SettingsTile.component';

const labels = allLabels.secretManager;

// Mock EditMetatdataLink component
const editMetadataTestId = 'edit-metadata-link';
vi.mock('./EditMetadataLink.component', async (original) => ({
  ...(await original()),
  EditMetadataLink: vi.fn(() => <div data-testid={editMetadataTestId} />),
}));

// Mock the useSecretSmartConfig hook
const mockUseSecretSmartConfig = vi.fn();
vi.mock('@secret-manager/hooks/useSecretSmartConfig', () => ({
  useSecretSmartConfig: (secret: Secret): unknown => mockUseSecretSmartConfig(secret),
}));

vi.mock('react-router-dom', async (importOriginal) => {
  const module: typeof import('react-router-dom') = await importOriginal();
  return {
    ...module,
    useNavigate: () => vi.fn(),
    useHref: vi.fn((link: string) => link),
    useParams: () => ({ okmsId: 'mockedOkmsId' }),
  };
});

const mockSecret = mockSecret1;

const mockSecretSmartConfig: SecretSmartConfig = {
  casRequired: {
    value: true,
    origin: 'DOMAIN',
  },
  deactivateVersionAfter: {
    value: '2h',
    origin: 'DOMAIN',
  },
  maxVersions: {
    value: 15,
    origin: 'DOMAIN',
  },
  isCasRequiredSetOnOkms: true,
  maxVersionsDefault: 10,
};

const renderComponent = async () => {
  const wrapper = await testWrapperBuilder().withI18next().build();

  return render(<SettingsTile secret={mockSecret} />, { wrapper });
};

describe('Secrets Settings Tile component tests suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('when data is loaded successfully', () => {
    beforeEach(() => {
      mockUseSecretSmartConfig.mockReturnValue({
        isPending: false,
        isError: false,
        secretConfig: mockSecretSmartConfig,
      });
    });

    it('should display settings tile with all data and origin labels', async () => {
      await renderComponent();

      // Check title
      expect(screen.getByText(labels.settings)).toBeVisible();

      // Check maximum number of versions
      expect(screen.getByText(labels.maximum_number_of_versions)).toBeVisible();
      expect(screen.getByText(`15 (${labels.setting_domain})`)).toBeVisible();

      // Check deactivate version after
      expect(screen.getByText(labels.deactivate_version_after)).toBeVisible();
      expect(screen.getByText(`2h (${labels.setting_domain})`)).toBeVisible();

      // Check CAS with description
      expect(screen.getByText(labels.cas_with_description)).toBeVisible();
      expect(screen.getByText(`${labels.activated} (${labels.setting_domain})`)).toBeVisible();

      // Check EditMetadataButton
      expect(screen.getByTestId(editMetadataTestId)).toBeVisible();
    });

    it('should display SECRET origin label when origin is SECRET', async () => {
      const secretConfigWithSecretOrigin: SecretSmartConfig = {
        ...mockSecretSmartConfig,
        maxVersions: {
          value: 10,
          origin: 'SECRET',
        },
      };

      mockUseSecretSmartConfig.mockReturnValue({
        isPending: false,
        isError: false,
        secretConfig: secretConfigWithSecretOrigin,
      });

      await renderComponent();

      expect(screen.getByText('10')).toBeVisible();
      // SECRET origin should not display any label
      expect(screen.queryByText(`(${labels.setting_domain})`)).not.toBeInTheDocument();
      expect(screen.queryByText(`(${labels.setting_default})`)).not.toBeInTheDocument();
    });

    it('should display DEFAULT origin label when origin is DEFAULT', async () => {
      const secretConfigWithDefaultOrigin: SecretSmartConfig = {
        ...mockSecretSmartConfig,
        maxVersions: {
          value: 20,
          origin: 'DEFAULT',
        },
      };

      mockUseSecretSmartConfig.mockReturnValue({
        isPending: false,
        isError: false,
        secretConfig: secretConfigWithDefaultOrigin,
      });

      await renderComponent();

      expect(screen.getByText(`20 (${labels.setting_default})`)).toBeVisible();
    });

    it(`should display "${labels.never_expire}" when deactivateVersionAfter is NO_DEACTIVATE_VERSION_AFTER`, async () => {
      const secretConfigWithNeverExpire: SecretSmartConfig = {
        ...mockSecretSmartConfig,
        deactivateVersionAfter: {
          value: NOT_SET_VALUE_DEACTIVATE_VERSION_AFTER,
          origin: 'DEFAULT',
        },
      };

      mockUseSecretSmartConfig.mockReturnValue({
        isPending: false,
        isError: false,
        secretConfig: secretConfigWithNeverExpire,
      });

      await renderComponent();

      expect(screen.getByText(`${labels.never_expire} (${labels.setting_default})`)).toBeVisible();
    });

    it('should display "Disabled" when CAS is not required', async () => {
      const secretConfigWithCasDisabled: SecretSmartConfig = {
        ...mockSecretSmartConfig,
        casRequired: {
          value: false,
          origin: 'DEFAULT',
        },
      };

      mockUseSecretSmartConfig.mockReturnValue({
        isPending: false,
        isError: false,
        secretConfig: secretConfigWithCasDisabled,
      });

      await renderComponent();

      expect(
        screen.getByText(`${allLabels.common.status.disabled} (${labels.setting_default})`),
      ).toBeVisible();
    });
  });

  describe('when data is loading', () => {
    beforeEach(() => {
      mockUseSecretSmartConfig.mockReturnValue({
        isPending: true,
        isError: false,
        secretConfig: undefined,
      });
    });

    it('should display skeleton loaders for all fields', async () => {
      await renderComponent();

      // Check title is still visible
      expect(screen.getByText(labels.settings)).toBeVisible();

      // Check that skeleton components are rendered (they should be present in the DOM)
      const skeletons = document.querySelectorAll('ods-skeleton');
      expect(skeletons).toHaveLength(3); // One for each field: maxVersions, deactivateVersionAfter, casRequired
    });
  });

  describe('when there is an error', () => {
    beforeEach(() => {
      mockUseSecretSmartConfig.mockReturnValue({
        isPending: false,
        isError: true,
        secretConfig: undefined,
      });
    });

    it('should not render anything when there is an error', async () => {
      const { container } = await renderComponent();

      // Component should return null when there's an error
      expect(container.firstChild).toBeNull();
    });
  });
});
