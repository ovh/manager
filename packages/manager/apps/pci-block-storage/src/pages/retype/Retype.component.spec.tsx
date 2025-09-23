import { render, within } from '@testing-library/react';

import { describe, vi } from 'vitest';
import { userEvent } from '@testing-library/user-event';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { TVolumeRetypeModel } from '@/api/hooks/useCatalogWithPreselection';
import { Retype } from '@/pages/retype/Retype.component';
import { EncryptionType } from '@/api/select/volume';

vi.mock('@/api/hooks/useCatalog', () => ({
  useVolumeEncryptions: () => ({
    data: [
      {
        type: null,
        label: 'common:pci_projects_project_storages_blocks_status_NONE',
      },
      {
        type: EncryptionType.OMK,
        label: 'OVHcloud Managed Key',
      },
      {
        type: EncryptionType.CMK,
        label: 'Customer Managed Key',
        comingSoon: true,
      },
    ],
  }),
}));

const getSelectedCatalogOption = (encrypted = false) =>
  ({
    name: 'volume model',
    displayName: 'display volume model',
    isPreselected: true,
    capacity: { max: 5 },
    encrypted,
  } as TVolumeRetypeModel);

const getOtherCatalogOption = (encrypted = false) =>
  ({
    name: 'other volume model',
    displayName: 'display other volume model',
    isPreselected: false,
    capacity: { max: 5 },
    encrypted,
  } as TVolumeRetypeModel);

describe('Retype', () => {
  beforeEach(() => vi.restoreAllMocks());

  it('should render volume data with preselection', () => {
    const { getByRole } = render(
      <Retype
        volumeModelData={[getSelectedCatalogOption(), getOtherCatalogOption()]}
        preselectedEncryptionType={null}
      />,
    );

    expect(
      getByRole('radio', { name: getSelectedCatalogOption().displayName }),
    ).toBeVisible();
    expect(
      getByRole('radio', { name: getSelectedCatalogOption().displayName }),
    ).toBeChecked();
    expect(
      getByRole('radio', { name: getOtherCatalogOption().displayName }),
    ).toBeVisible();
    expect(
      getByRole('radio', { name: getOtherCatalogOption().displayName }),
    ).not.toBeChecked();
  });

  describe('encryption', () => {
    it('should render option with preselection given volume is encrypted', async () => {
      const { getAllByRole, queryByText } = render(
        <Retype
          volumeModelData={[getSelectedCatalogOption(true)]}
          preselectedEncryptionType={EncryptionType.OMK}
        />,
      );

      const encryptionRadios = getAllByRole('radio', {
        name: 'encryption',
      });

      encryptionRadios.forEach((radio) => {
        expect(radio).toBeVisible();
      });
      expect(
        encryptionRadios.map((radio: HTMLInputElement) => radio.value),
      ).toEqual(['none', 'OMK', 'CMK']);
      expect(
        encryptionRadios.map((radio: HTMLInputElement) => radio.checked),
      ).toEqual([false, true, false]);
      expect(
        queryByText(
          'retype:pci_projects_project_storages_blocks_retype_encryption_not_available',
        ),
      ).toBeNull();
    });

    it('should not render option given and render information message given volume is not encrypted', () => {
      const { queryByRole, getByText } = render(
        <Retype
          volumeModelData={[getSelectedCatalogOption(false)]}
          preselectedEncryptionType={null}
        />,
      );

      expect(
        queryByRole('radiogroup', {
          name:
            'retype:pci_projects_project_storages_blocks_retype_change_encryption_title',
        }),
      ).toBeNull();
      expect(
        getByText(
          'retype:pci_projects_project_storages_blocks_retype_encryption_not_available',
        ),
      ).toBeVisible();
    });
  });

  describe('modify button', () => {
    it('should be disabled if nothing has changed', () => {
      const { getByText } = render(
        <Retype
          volumeModelData={[
            getSelectedCatalogOption(true),
            getOtherCatalogOption(true),
          ]}
          preselectedEncryptionType={EncryptionType.OMK}
        />,
      );

      expect(getByText(`${NAMESPACES.ACTIONS}:modify`)).toBeDisabled();
    });

    it('should be enabled if volume type has changed', async () => {
      const { getByText, getByRole } = render(
        <Retype
          volumeModelData={[
            getSelectedCatalogOption(true),
            getOtherCatalogOption(true),
          ]}
          preselectedEncryptionType={EncryptionType.OMK}
        />,
      );

      await userEvent.click(
        getByRole('radio', { name: getOtherCatalogOption().displayName }),
      );

      expect(getByText(`${NAMESPACES.ACTIONS}:modify`)).not.toBeDisabled();
    });

    it('should be disabled if volume type has changed and back to original value', async () => {
      const { getByText, getByRole } = render(
        <Retype
          volumeModelData={[
            getSelectedCatalogOption(true),
            getOtherCatalogOption(true),
          ]}
          preselectedEncryptionType={EncryptionType.OMK}
        />,
      );

      await userEvent.click(
        getByRole('radio', { name: getOtherCatalogOption().displayName }),
      );
      await userEvent.click(
        getByRole('radio', { name: getSelectedCatalogOption().displayName }),
      );

      expect(getByText(`${NAMESPACES.ACTIONS}:modify`)).toBeDisabled();
    });

    it('should be enabled if encryption has changed', async () => {
      const { getByRole, getByText } = render(
        <Retype
          volumeModelData={[
            getSelectedCatalogOption(true),
            getOtherCatalogOption(true),
          ]}
          preselectedEncryptionType={null}
        />,
      );

      await userEvent.click(
        within(
          getByRole('radiogroup', {
            name:
              'retype:pci_projects_project_storages_blocks_retype_change_encryption_title',
          }),
        ).getByText('OVHcloud Managed Key'),
      );

      expect(getByText(`${NAMESPACES.ACTIONS}:modify`)).not.toBeDisabled();
    });

    it('should be disabled if encryption has changed and back to original value', async () => {
      const { getByRole, getByText } = render(
        <Retype
          volumeModelData={[getSelectedCatalogOption(true)]}
          preselectedEncryptionType={null}
        />,
      );

      await userEvent.click(
        within(
          getByRole('radiogroup', {
            name:
              'retype:pci_projects_project_storages_blocks_retype_change_encryption_title',
          }),
        ).getByText('OVHcloud Managed Key'),
      );
      await userEvent.click(
        within(
          getByRole('radiogroup', {
            name:
              'retype:pci_projects_project_storages_blocks_retype_change_encryption_title',
          }),
        ).getByText('common:pci_projects_project_storages_blocks_status_NONE'),
      );

      expect(getByText(`${NAMESPACES.ACTIONS}:modify`)).toBeDisabled();
    });
  });
});
