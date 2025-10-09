import { useParams } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import {
  StepComponent,
  useCatalogPrice,
  convertHourlyPriceToMonthly,
  useTranslatedMicroRegions,
  Links,
  LinkType,
  useMe,
} from '@ovh-ux/manager-react-components';
import {
  OdsBadge,
  OdsMessage,
  OdsRadio,
  OdsSkeleton,
  OdsText,
  OdsFormField,
  OdsCombobox,
  OdsComboboxItem,
  OdsComboboxGroup,
} from '@ovhcloud/ods-components/react';
import { OdsInputChangeEvent } from '@ovhcloud/ods-components';
import {
  useCatalog,
  useProductAvailability,
  TRegionAvailability,
} from '@ovh-ux/manager-pci-common';
import { useMemo, useCallback, useState } from 'react';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { useContainerCreationStore } from '../useContainerCreationStore';
import { useAllowedRegions } from '@/hooks/useAllowedRegions';
import { groupRegionsByContinent } from '@/domain/regions/regionFilter';
import {
  ObjectContainerMode,
  STORAGE_STANDARD_REGION_PLANCODE,
  MEGA_BYTES,
  OFFSITE_REPLICATION_CODE,
  UNIVERSE,
  SUB_UNIVERSE,
  APP_NAME,
  STORAGE_ASYNC_REPLICATION_LINK,
  OBJECT_CONTAINER_MODE_MONO_ZONE,
} from '@/constants';
import LabelComponent from '@/components/Label.component';

enum LocationSelectionType {
  AUTO = 'auto',
  MANUAL = 'manual',
}

export function OffsiteReplication() {
  const { t } = useTranslation(['containers/add', 'pci-common']);
  const { trackClick } = useOvhTracking();
  const { projectId } = useParams<{ projectId: string }>();
  const { me } = useMe();

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

  const {
    translateMicroRegion,
    translateContinentRegion,
  } = useTranslatedMicroRegions();

  const {
    form,
    setOffsiteReplication,

    setOffsiteReplicationRegion,
    stepper,
    submitOffsiteReplication,
    editOffsiteReplication,
  } = useContainerCreationStore();

  const [locationSelection, setLocationSelection] = useState<
    LocationSelectionType
  >(LocationSelectionType.AUTO);

  const {
    allowedRegions,
    hasRegions,
    isPending: isRegionsPending,
  } = useAllowedRegions({
    offer: form.offer,
    deploymentMode: OBJECT_CONTAINER_MODE_MONO_ZONE,
    onlyEnabled: true,
  });

  const regionsWithTranslations = useMemo(
    () =>
      allowedRegions.map((region) => ({
        ...region,
        microName: translateMicroRegion(region.name) || region.name,
        continentName:
          translateContinentRegion(region.name) ||
          region.continentCode ||
          'Other',
      })),
    [allowedRegions, translateMicroRegion, translateContinentRegion],
  );

  const groupedRegions = useMemo(
    () =>
      groupRegionsByContinent(
        regionsWithTranslations,
        (region) => region.continentName,
      ),
    [regionsWithTranslations],
  );

  const deploymentPrice = useMemo(() => {
    const eligibleAddons = plans
      .filter((plan) =>
        plan.regions.some(
          (region: TRegionAvailability) =>
            ((region.type as unknown) as string) ===
            ObjectContainerMode.MULTI_ZONES,
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

  const REPLICATION_LINK =
    STORAGE_ASYNC_REPLICATION_LINK[me?.ovhSubsidiary] ||
    STORAGE_ASYNC_REPLICATION_LINK.DEFAULT;

  const handleOffsiteReplicationChange = useCallback(
    (value: boolean) => {
      setOffsiteReplication(value);
      if (!value) {
        setLocationSelection(LocationSelectionType.AUTO);
        setOffsiteReplicationRegion('');
      }
    },
    [setOffsiteReplication, setOffsiteReplicationRegion],
  );

  const handleLocationSelectionChange = useCallback(
    (value: LocationSelectionType) => {
      setLocationSelection(value);
      if (value === LocationSelectionType.AUTO) {
        setOffsiteReplicationRegion('');
      }
    },
    [setOffsiteReplicationRegion],
  );

  const handleRegionSelectChange = useCallback(
    (event: OdsInputChangeEvent) => {
      if (typeof event.detail.value === 'string') {
        setOffsiteReplicationRegion(event.detail.value);
      } else {
        setOffsiteReplicationRegion('');
      }
    },
    [setOffsiteReplicationRegion],
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
        isDisabled:
          locationSelection === LocationSelectionType.MANUAL &&
          !form.offsiteReplicationRegion,
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
      <OdsText preset="paragraph" className="block">
        <Trans
          data-testid="replication_step"
          i18nKey={
            'containers/add:pci_projects_project_storages_containers_offsite_replication_description'
          }
          components={{
            1: (
              <Links
                href={REPLICATION_LINK}
                target="_blank"
                type={LinkType.external}
              />
            ),
          }}
        />
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
              <div className="my-6">
                <OdsText preset="heading-6" className="mb-4">
                  {t(
                    'pci_projects_project_storages_containers_offsite_replication_location_choice_title',
                  )}
                </OdsText>

                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <OdsRadio
                      value="auto"
                      data-testid="location_auto"
                      isChecked={
                        locationSelection === LocationSelectionType.AUTO
                      }
                      name="locationSelection"
                      inputId="locationSelection-auto"
                      onOdsChange={() =>
                        handleLocationSelectionChange(
                          LocationSelectionType.AUTO,
                        )
                      }
                    />
                    <label htmlFor="locationSelection-auto">
                      <OdsText>
                        {t(
                          'pci_projects_project_storages_containers_offsite_replication_location_auto',
                        )}
                      </OdsText>
                      <div>
                        <OdsText preset="caption">
                          {t(
                            'pci_projects_project_storages_containers_offsite_replication_location_auto_description',
                          )}
                        </OdsText>
                      </div>
                    </label>
                  </div>

                  <div className="flex items-center gap-4">
                    <OdsRadio
                      value="manual"
                      data-testid="location_manual"
                      isChecked={
                        locationSelection === LocationSelectionType.MANUAL
                      }
                      name="locationSelection"
                      inputId="locationSelection-manual"
                      onOdsChange={() =>
                        handleLocationSelectionChange(
                          LocationSelectionType.MANUAL,
                        )
                      }
                    />
                    <label htmlFor="locationSelection-manual">
                      <OdsText>
                        {t(
                          'pci_projects_project_storages_containers_offsite_replication_location_manual',
                        )}
                      </OdsText>
                      <div>
                        <OdsText preset="caption">
                          {t(
                            'pci_projects_project_storages_containers_offsite_replication_location_manual_description',
                          )}
                        </OdsText>
                      </div>
                    </label>
                  </div>

                  {locationSelection === LocationSelectionType.MANUAL && (
                    <OdsFormField className="mt-4">
                      <LabelComponent
                        className="label-upload"
                        text={t(
                          'pci_projects_project_storages_containers_offsite_replication_location_select_label',
                        )}
                      />

                      <OdsCombobox
                        data-testid="replication-region-combobox"
                        placeholder={t(
                          'pci_projects_project_storages_containers_offsite_replication_location_select_placeholder',
                        )}
                        name="replicationRegion"
                        className="w-full max-w-[29rem]"
                        value={form.offsiteReplicationRegion || ''}
                        onOdsChange={handleRegionSelectChange}
                        isDisabled={isRegionsPending || !hasRegions}
                        allowNewElement={false}
                      >
                        {hasRegions ? (
                          Object.entries(groupedRegions).map(
                            ([continent, regions]) => (
                              <OdsComboboxGroup key={continent}>
                                <span slot="title">{continent}</span>
                                {regions.map((region) => (
                                  <OdsComboboxItem
                                    key={region.name}
                                    value={region.name}
                                  >
                                    <div className="flex flex-col">
                                      <span>
                                        {region.microName || region.name}
                                      </span>
                                    </div>
                                  </OdsComboboxItem>
                                ))}
                              </OdsComboboxGroup>
                            ),
                          )
                        ) : (
                          <OdsComboboxItem value="">
                            {t(
                              'pci_projects_project_storages_containers_offsite_replication_no_regions_available',
                            )}
                          </OdsComboboxItem>
                        )}
                      </OdsCombobox>
                    </OdsFormField>
                  )}
                </div>
              </div>
            )}

            {form.offsiteReplication && (
              <OdsMessage color="information" isDismissible={false}>
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
