import { useMemo } from 'react';
import { clsx } from 'clsx';
import { useParams } from 'react-router-dom';
import { useCatalog, useProductAvailability } from '@ovh-ux/manager-pci-common';
import {
  HOUR_IN_MONTH,
  useCatalogPrice,
  useFeatureAvailability,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import {
  OsdsChip,
  OsdsSkeleton,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_CHIP_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import {
  AVAILABILITY,
  MEGA_BYTES,
  OBJECT_CONTAINER_DEPLOYMENT_MODES_LABELS,
  STORAGE_STANDARD_PLANCODE,
} from '@/constants';

export function DeploymentModeStepTile({ item: mode, isItemSelected }) {
  const { t } = useTranslation('containers/add');
  const { projectId } = useParams();
  const { data: catalog, isPending: isCatalogPending } = useCatalog('cloud');
  const { getTextPrice } = useCatalogPrice();
  const {
    data: availability,
    isPending: isAvailabilityPending,
  } = useFeatureAvailability([AVAILABILITY.LOCALZONE, AVAILABILITY['3AZ']]);
  const {
    data: productAvailability,
    isPending: isProductAvailabilityPending,
  } = useProductAvailability(projectId);

  const plans = productAvailability?.plans?.filter((plan) =>
    plan.code?.startsWith(STORAGE_STANDARD_PLANCODE),
  );

  const lowestPrice = useMemo(() => {
    const addons = plans
      ?.filter((p) => p.regions.some((region) => region.type === mode))
      ?.map(({ code }) =>
        catalog?.addons.find((addon) => addon.planCode === code),
      );
    const pricings = addons?.map(
      (addon) => addon?.pricings?.sort((a, b) => a.price - b.price)?.[0],
    );
    return pricings?.sort((a, b) => a.price - b.price)?.[0];
  }, [mode, plans, catalog]);

  const isLocalZoneAvailable = availability?.[AVAILABILITY.LOCALZONE];
  const is3azAvailable = availability?.[AVAILABILITY['3AZ']];
  const isPending =
    isCatalogPending || isAvailabilityPending || isProductAvailabilityPending;

  return (
    <div className="p-4">
      <OsdsText
        size={ODS_TEXT_SIZE._400}
        level={ODS_TEXT_LEVEL.body}
        color={ODS_THEME_COLOR_INTENT.text}
        className={clsx('leading-8', isItemSelected && 'font-bold')}
      >
        <span className="mr-4">
          {t(
            isLocalZoneAvailable && is3azAvailable
              ? `pci_projects_project_storages_containers_add_deployment_mode_${mode}`
              : `pci_projects_project_storages_containers_add_deployment_mode_flipping_${mode}`,
          )}
        </span>
        {OBJECT_CONTAINER_DEPLOYMENT_MODES_LABELS[mode]?.isMultiZone && (
          <OsdsChip
            inline
            size={ODS_CHIP_SIZE.sm}
            className="bg-[--ods-color-blue-200]"
          >
            <span className={isItemSelected ? 'font-bold' : ''}>
              {t(
                `pci_projects_project_storages_containers_add_deployment_mode_${mode}_label`,
              )}
            </span>
          </OsdsChip>
        )}
        {OBJECT_CONTAINER_DEPLOYMENT_MODES_LABELS[mode]?.isMonoZone &&
          isLocalZoneAvailable &&
          is3azAvailable && (
            <OsdsChip
              inline
              size={ODS_CHIP_SIZE.sm}
              className="bg-[--ods-color-blue-200]"
            >
              <span className={isItemSelected ? 'font-bold' : ''}>
                {t(
                  `pci_projects_project_storages_containers_add_deployment_mode_${mode}_label`,
                )}
              </span>
            </OsdsChip>
          )}
        {OBJECT_CONTAINER_DEPLOYMENT_MODES_LABELS[mode]?.isLocalZone && (
          <OsdsChip
            inline
            size={ODS_CHIP_SIZE.sm}
            className="bg-[--ods-color-promotion-400] text-[--ods-color-orange-100]"
          >
            <span className={isItemSelected ? 'font-bold' : ''}>
              {t(
                `pci_projects_project_storages_containers_add_deployment_mode_${mode}_label`,
              )}
            </span>
          </OsdsChip>
        )}
      </OsdsText>
      <p>
        <OsdsText
          size={ODS_TEXT_SIZE._100}
          level={ODS_TEXT_LEVEL.body}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {t(
            `pci_projects_project_storages_containers_add_deployment_mode_${mode}_description`,
          )}
        </OsdsText>
      </p>
      <p>
        {isPending && <OsdsSkeleton />}
        {!isPending && !!lowestPrice && (
          <OsdsText
            size={ODS_TEXT_SIZE._100}
            level={ODS_TEXT_LEVEL.body}
            color={ODS_THEME_COLOR_INTENT.text}
            className="font-bold"
          >
            {t(
              OBJECT_CONTAINER_DEPLOYMENT_MODES_LABELS[mode].isMultiZone
                ? 'pci_projects_project_storages_containers_add_deployment_mode_price'
                : 'pci_projects_project_storages_containers_add_offers_estimated_price',
              {
                price:
                  getTextPrice(
                    lowestPrice?.price * HOUR_IN_MONTH * MEGA_BYTES,
                  ) || '?',
              },
            )}
          </OsdsText>
        )}
      </p>
    </div>
  );
}
