import { useMemo } from 'react';
import { clsx } from 'clsx';
import { useParams } from 'react-router-dom';
import { useCatalog, useProductAvailability } from '@ovh-ux/manager-pci-common';
import {
  HOUR_IN_MONTH,
  useCatalogPrice,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { OdsBadge, OdsSkeleton, OdsText } from '@ovhcloud/ods-components/react';
import {
  MEGA_BYTES,
  OBJECT_CONTAINER_DEPLOYMENT_MODES_LABELS,
  STORAGE_STANDARD_REGION_PLANCODE,
} from '@/constants';
import { useStorageFeatures } from '@/hooks/useStorageFeatures';
import UseStandardInfrequentAccessAvailability from '@/hooks/useStandardInfrequentAccessAvailability';

export function DeploymentModeStepTile({ item: mode, isItemSelected }) {
  const { t } = useTranslation('containers/add');
  const { projectId } = useParams();
  const { data: catalog, isPending: isCatalogPending } = useCatalog('cloud');
  const { getTextPrice } = useCatalogPrice();
  const {
    is3azAvailable,
    isLocalZoneAvailable,
    isPending: isAvailabilityPending,
  } = useStorageFeatures();
  const {
    data: productAvailability,
    isPending: isProductAvailabilityPending,
  } = useProductAvailability(projectId);

  const plans = productAvailability?.plans?.filter((plan) =>
    plan.code?.startsWith(STORAGE_STANDARD_REGION_PLANCODE),
  );

  const lowestPrice = useMemo(() => {
    const addons = plans
      ?.filter((p) => p.regions?.some((region) => region.type === mode))
      ?.map(({ code }) =>
        catalog?.addons?.find((addon) => addon?.planCode === code),
      )
      ?.filter(Boolean)
      ?.filter(
        (addon) => addon?.invoiceName === STORAGE_STANDARD_REGION_PLANCODE,
      );

    const pricings = addons
      ?.map((addon) => addon?.pricings?.[0])
      ?.filter(Boolean);
    return pricings?.sort((a, b) => (a?.price || 0) - (b?.price || 0))?.[0];
  }, [mode, plans, catalog]);

  const isPending =
    isCatalogPending || isAvailabilityPending || isProductAvailabilityPending;

  const hasStandardInfrequentAccess = UseStandardInfrequentAccessAvailability();

  return (
    <div className="p-4">
      <OdsText
        preset="paragraph"
        className={clsx('leading-8', isItemSelected && 'font-bold')}
      >
        <span className={clsx(isItemSelected && 'font-bold', 'mr-4')}>
          {t(
            isLocalZoneAvailable && is3azAvailable
              ? `pci_projects_project_storages_containers_add_deployment_mode_${mode}`
              : `pci_projects_project_storages_containers_add_deployment_mode_flipping_${mode}`,
          )}
        </span>
        {OBJECT_CONTAINER_DEPLOYMENT_MODES_LABELS[mode]?.isMultiZone && (
          <OdsBadge
            size="sm"
            className="chip-3AZ"
            label={t(
              `pci_projects_project_storages_containers_add_deployment_mode_${mode}_label`,
            )}
          />
        )}
        {OBJECT_CONTAINER_DEPLOYMENT_MODES_LABELS[mode]?.isMonoZone &&
          isLocalZoneAvailable &&
          is3azAvailable && (
            <OdsBadge
              size="sm"
              className="chip-1AZ"
              label={t(
                `pci_projects_project_storages_containers_add_deployment_mode_${mode}_label`,
              )}
            />
          )}
        {OBJECT_CONTAINER_DEPLOYMENT_MODES_LABELS[mode]?.isLocalZone && (
          <OdsBadge
            size="sm"
            label={t(
              `pci_projects_project_storages_containers_add_deployment_mode_${mode}_label`,
            )}
          />
        )}
      </OdsText>
      <p>
        <OdsText preset="caption">
          {t(
            `pci_projects_project_storages_containers_add_deployment_mode_${mode}_description`,
          )}
        </OdsText>
      </p>
      {hasStandardInfrequentAccess ? (
        <p>
          <OdsText preset="caption">
            <span className="font-bold">
              {t(
                `pci_projects_project_storages_containers_add_deployment_mode_classes`,
              )}
            </span>
            {t(
              `pci_projects_project_storages_containers_add_deployment_mode_${mode}_classes`,
            )}
          </OdsText>
        </p>
      ) : (
        <p>
          {isPending && <OdsSkeleton />}
          {!isPending && !!lowestPrice && (
            <OdsText preset="caption" className="caption-price">
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
            </OdsText>
          )}
        </p>
      )}
    </div>
  );
}
