import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  StepComponent,
  useCatalogPrice,
  convertHourlyPriceToMonthly,
} from '@ovh-ux/manager-react-components';
import {
  OdsBadge,
  OdsMessage,
  OdsRadio,
  OdsSkeleton,
  OdsText,
} from '@ovhcloud/ods-components/react';
import {
  useCatalog,
  useProductAvailability,
  TRegionAvailability,
} from '@ovh-ux/manager-pci-common';
import { useMemo, useCallback } from 'react';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { useContainerCreationStore } from '../useContainerCreationStore';
import {
  OBJECT_CONTAINER_MODE_MULTI_ZONES,
  STORAGE_STANDARD_REGION_PLANCODE,
  MEGA_BYTES,
  OFFSITE_REPLICATION_CODE,
  UNIVERSE,
  SUB_UNIVERSE,
  APP_NAME,
} from '@/constants';

export function OffsiteReplication() {
  const { t } = useTranslation(['containers/add', 'pci-common']);
  const { trackClick } = useOvhTracking();
  const { projectId } = useParams<{ projectId: string }>();

  const { data: catalog, isPending: isCatalogPending } = useCatalog('cloud');
  const {
    data: productAvailability,
    isPending: isProductAvailabilityPending,
  } = useProductAvailability(projectId);

  const { getFormattedCatalogPrice } = useCatalogPrice(0, {
    hideTaxLabel: true,
  });

  const plans = useMemo(
    () =>
      productAvailability?.plans?.filter((plan) =>
        plan.code?.startsWith(STORAGE_STANDARD_REGION_PLANCODE),
      ) || [],
    [productAvailability],
  );

  const deploymentPrice = useMemo(() => {
    const eligibleAddons = plans
      .filter((plan) =>
        plan.regions.some(
          (region: TRegionAvailability) =>
            ((region.type as unknown) as string) ===
            OBJECT_CONTAINER_MODE_MULTI_ZONES,
        ),
      )
      .map(({ code }) =>
        catalog?.addons.find((addon) => addon.planCode === code),
      )
      .filter(
        (addon) => addon?.invoiceName === STORAGE_STANDARD_REGION_PLANCODE,
      )
      .map((addon) => addon?.pricings?.[0]?.price || 0);

    return eligibleAddons?.length ? Math.min(...eligibleAddons) : null;
  }, [plans, catalog]);

  const offsiteReplicationPrice = useMemo(
    () =>
      catalog?.addons.find(
        (addon) => addon.planCode === OFFSITE_REPLICATION_CODE,
      )?.pricings?.[0]?.price || 0,
    [catalog],
  );

  const isPending = isCatalogPending || isProductAvailabilityPending;

  const {
    form,
    setOffsiteReplication,
    stepper,
    submitOffsiteReplication,
    editOffsiteReplication,
  } = useContainerCreationStore();

  const handleOffsiteReplicationChange = useCallback(
    (value: boolean) => setOffsiteReplication(value),
    [setOffsiteReplication],
  );

  const getFormattedPrice = useCallback(
    (price: number) =>
      getFormattedCatalogPrice(convertHourlyPriceToMonthly(price) * MEGA_BYTES),
    [getFormattedCatalogPrice],
  );

  return (
    <StepComponent
      title={t(
        'pci_projects_project_storages_containers_offsite_replication_title',
      )}
      isOpen={
        stepper.offsiteReplication.isOpen || stepper.offsiteReplication.isLocked
      }
      isChecked={stepper.offsiteReplication.isChecked}
      isLocked={stepper.offsiteReplication.isLocked}
      order={4}
      next={{
        action: () => {
          const replicationAction = form.offsiteReplication
            ? 'activate_offsite_replication'
            : 'desactivate_offsite_replication';

          trackClick({
            actions: [
              UNIVERSE,
              SUB_UNIVERSE,
              APP_NAME,
              'funnel',
              'button',
              'add_objects_storage_container',
              'select_offsite_replication',
              replicationAction,
            ],
          });

          submitOffsiteReplication();
        },
        label: t('pci-common:common_stepper_next_button_label'),
      }}
      edit={{
        action: () => {
          trackClick({
            actions: [
              UNIVERSE,
              SUB_UNIVERSE,
              APP_NAME,
              'funnel',
              'button',
              'add_objects_storage_container',
              'edit_step_select_offsite_replication',
            ],
          });

          editOffsiteReplication();
        },
        label: t('pci-common:common_stepper_modify_this_step'),
      }}
    >
      <OdsText
        preset="paragraph"
        className="block"
        data-testid="replication_step"
      >
        {t(
          'pci_projects_project_storages_containers_offsite_replication_description',
        )}
      </OdsText>

      <div className="flex flex-col gap-4 my-6">
        {isPending && <OdsSkeleton data-testid="ods-skeleton" />}
        {!isPending && (
          <>
            <div className="flex items-center gap-4">
              <OdsRadio
                value="false"
                data-testid="replication_disabled"
                isChecked={!form.offsiteReplication}
                name="offsiteReplication"
                inputId="offsiteReplication-false"
                onOdsChange={() => handleOffsiteReplicationChange(false)}
              />
              <label htmlFor="offsiteReplication-false">
                <OdsText>
                  {t(
                    'pci_projects_project_storages_containers_offsite_replication_disabled',
                  )}
                </OdsText>
              </label>
            </div>

            <div className="flex items-center gap-4">
              <OdsRadio
                value="true"
                data-testid="replication_enabled"
                name="offsiteReplication"
                inputId="offsiteReplication-true"
                isChecked={form.offsiteReplication}
                onOdsChange={() => handleOffsiteReplicationChange(true)}
              />
              <label htmlFor="offsiteReplication-true">
                <OdsText>
                  {t(
                    'pci_projects_project_storages_containers_offsite_replication_enabled',
                  )}
                </OdsText>
                <OdsText
                  preset="heading-6"
                  className="caption-price ml-3 pricing-color"
                  data-testid="replication_price_estimation"
                >
                  {t(
                    'pci_projects_project_storages_containers_offsite_replication_price_estimation',
                    {
                      price: getFormattedPrice(offsiteReplicationPrice),
                    },
                  )}
                </OdsText>
                <OdsBadge
                  className="ml-3"
                  size="sm"
                  label={t(
                    'pci_projects_project_storages_containers_offsite_replication_recommanded',
                  )}
                />
              </label>
            </div>

            {deploymentPrice !== null && (
              <div className="flex items-center gap-4">
                <OdsText preset="paragraph" className="caption-price">
                  {t(
                    'pci_projects_project_storages_containers_offsite_replication_final_price_estimation',
                  )}
                </OdsText>
                <OdsText
                  preset="heading-6"
                  className="caption-price pricing-color"
                >
                  {t(
                    'pci_projects_project_storages_containers_offsite_replication_final_price_estimation_value',
                    {
                      price: getFormattedPrice(
                        form.offsiteReplication
                          ? deploymentPrice + offsiteReplicationPrice
                          : deploymentPrice,
                      ),
                    },
                  )}
                </OdsText>
              </div>
            )}

            {form.offsiteReplication && (
              <OdsMessage
                className="my-6"
                color="information"
                isDismissible={false}
              >
                <OdsText preset="paragraph">
                  {t(
                    'pci_projects_project_storages_containers_offsite_replication_versionning_warning',
                  )}
                </OdsText>
              </OdsMessage>
            )}
          </>
        )}
      </div>
    </StepComponent>
  );
}
