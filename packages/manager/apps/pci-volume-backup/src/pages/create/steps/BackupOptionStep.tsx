import { Trans, useTranslation } from 'react-i18next';

import {
  TAddon,
  TileInputChoice,
  TVolume,
  useCatalog,
  useProductAvailability,
} from '@ovh-ux/manager-pci-common';
import { OdsDivider, OdsLink, OdsText } from '@ovhcloud/ods-components/react';
import { useContext, useEffect, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useMedia } from 'react-use';
import {
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import {
  convertHourlyPriceToMonthly,
  useCatalogPrice,
} from '@ovh-ux/manager-react-components';
import {
  GUIDES,
  GUIDES_STORAGES_VOLUME_BACKUP_OVERVIEW,
  VOLUME_OPTION_BACKUP,
  VOLUME_OPTION_SNAPSHOT,
} from '@/constants';
import { VOLUME_BACKUP_TRACKING } from '@/tracking.constant';

export type TBackupOption = {
  id: string;
  planCode: string;
  type: typeof VOLUME_OPTION_SNAPSHOT | typeof VOLUME_OPTION_BACKUP;
  isDisabled?: boolean;
  price: string | null;
};

type BackupOptionStepProps = {
  selectedBackup: TBackupOption | undefined;
  setSelectedBackup: (backup: TBackupOption) => void;
  selectedVolume: TVolume | undefined;
  onBackupChange: (option: TBackupOption) => void;
  backupOptions: TBackupOption[];
};

export default function BackupOptionStep({
  selectedBackup,
  setSelectedBackup,
  selectedVolume,
  onBackupChange,
  backupOptions,
}: BackupOptionStepProps) {
  const { t } = useTranslation(['create', 'pci-volume-backup']);
  const { ovhSubsidiary } = useContext(ShellContext).environment?.getUser() || {};
  const { trackClick } = useOvhTracking();

  const isMobileView = useMedia(`(max-width: 36em)`);

  const { projectId } = useParams();

  const [searchParams] = useSearchParams();
  const volumeOptionParam = searchParams.get('volumeOption');

  const { data: catalog } = useCatalog();

  const { getTextPrice } = useCatalogPrice(6);

  const { data: snapshotAvailabilityData } = useProductAvailability(
    projectId || '',
    {
      addonFamily: 'snapshot',
    },
  );

  const { data: backupAvailabilityData } = useProductAvailability(
    projectId || '',
    {
      addonFamily: 'volume-backup',
    },
  );

  const backupGuideLink = useMemo(() => {
    const guide = GUIDES.find(
      ({ id }) => id === GUIDES_STORAGES_VOLUME_BACKUP_OVERVIEW,
    );
    return (
      guide?.links[ovhSubsidiary as keyof typeof guide.links] ||
      guide?.links.DEFAULT ||
      ''
    );
  }, [ovhSubsidiary]);

  const formatVolumePrice = (addon: TAddon | undefined) => {
    const price = addon?.pricings[0]?.price;

    if (typeof price !== 'number') {
      return null;
    }

    const priceMonthlyInCent = convertHourlyPriceToMonthly(price);
    const formattedPrice = getTextPrice(priceMonthlyInCent);

    return formattedPrice;
  };

  const volumeOptionsWihPrice = useMemo(() => {
    if (!catalog) {
      return backupOptions.map((option) => ({ ...option, price: null }));
    }

    return backupOptions.map((volumeOption) => {
      // Find matching addons for this volume option
      const matchingAddons = catalog.addons.filter((addonItem) =>
        addonItem.planCode.startsWith(volumeOption.planCode),
      );

      // If no specific volume is selected, use the exact plan code match
      if (!selectedVolume) {
        const addon = matchingAddons.find(
          (addonItem) => addonItem.planCode === volumeOption.planCode,
        );
        const price = formatVolumePrice(addon);
        return { ...volumeOption, price };
      }

      // Get availability data based on volume option type
      const availabilityData =
        volumeOption.id === 'volume_snapshot'
          ? snapshotAvailabilityData
          : backupAvailabilityData;

      // Find plans available in the selected region
      const availablePlans =
        availabilityData?.plans.filter((plan) =>
          plan.regions.some((region) => region.name === selectedVolume.region),
        ) || [];

      // Find the addon that matches an available plan
      const matchedAddon = matchingAddons.find((addonItem) =>
        availablePlans.some((plan) => plan.code === addonItem.planCode),
      );

      const price = formatVolumePrice(matchedAddon);
      return { ...volumeOption, price };
    });
  }, [
    catalog,
    selectedVolume,
    snapshotAvailabilityData,
    backupAvailabilityData,
    backupOptions,
  ]);

  useEffect(() => {
    if (volumeOptionParam === 'volume_snapshot') {
      setSelectedBackup(volumeOptionsWihPrice[0]);
    }
  }, [searchParams, volumeOptionsWihPrice]);

  return (
    <div className="flex flex-col">
      <OdsText preset="heading-3">
        {t('pci_projects_project_storages_volume_backup_create_step_2_title')}
      </OdsText>
      <OdsLink
        className="my-4"
        icon="external-link"
        target="_blank"
        href={backupGuideLink}
        label={t(
          'pci_projects_project_storages_volume_backup_create_step_2_description_link',
        )}
        onClick={() => {
          trackClick({
            actionType: 'action',
            actions: VOLUME_BACKUP_TRACKING.CREATE.KNOW_MORE_LINK,
          });
        }}
      />

      <TileInputChoice
        items={volumeOptionsWihPrice}
        selectedItem={volumeOptionsWihPrice.find(
          ({ id }) => id === selectedBackup?.id,
        )}
        onSelectItem={(item) => onBackupChange(item as TBackupOption)}
        columnsCount={isMobileView ? 1 : 2}
      >
        {(item) => (
          <div className="p-6 text-center">
            <OdsText className="fw-bold" preset="paragraph">
              {t(
                `pci_projects_project_storages_volume_backup_create_step_2_option_${item.id}_label`,
              )}
            </OdsText>
            <OdsDivider spacing="24" />
            <div>
              <OdsText preset="caption" className="block">
                {t(
                  `pci_projects_project_storages_volume_backup_create_step_2_option_${item.id}_description_part_1`,
                )}
              </OdsText>
              <OdsText preset="caption" className="block">
                {t(
                  `pci_projects_project_storages_volume_backup_create_step_2_option_${item.id}_description_part_2`,
                )}
              </OdsText>
            </div>

            {item.price && (
              <>
                <OdsDivider spacing="24" />

                <OdsText preset="caption" className="block">
                  <Trans
                    t={t}
                    i18nKey="pci_projects_project_storages_volume_backup_create_step_2_option_price"
                    values={{
                      priceValue: `<strong> ${item.price}</strong>`,
                    }}
                  />
                </OdsText>
              </>
            )}
          </div>
        )}
      </TileInputChoice>
    </div>
  );
}
