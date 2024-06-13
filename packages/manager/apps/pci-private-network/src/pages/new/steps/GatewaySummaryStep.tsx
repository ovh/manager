import { StepComponent, useCatalogPrice } from '@ovhcloud/manager-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_CHECKBOX_BUTTON_SIZE,
  ODS_MESSAGE_TYPE,
  ODS_SPINNER_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsCheckbox,
  OsdsCheckboxButton,
  OsdsMessage,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';

import { useEnvironment } from '@ovh-ux/manager-react-shell-client';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useGatewayCatalog } from '@/api/hooks/useGateway';
import { StepsEnum, useNewNetworkStore } from '@/pages/new/store';
import { useProjectAvailableRegions } from '@/api/hooks/useRegions';

export default function GatewaySummaryStep({
  onCreate,
}: {
  onCreate: () => void;
}): JSX.Element {
  const store = useNewNetworkStore();

  const { isLoading: isRegionsLoading } = useProjectAvailableRegions(
    store.project?.id,
  );

  const { t } = useTranslation('new');

  const { ovhSubsidiary } = useEnvironment().getUser();

  const { data: gatewayCatalog } = useGatewayCatalog(ovhSubsidiary);

  const {
    getFormattedHourlyCatalogPrice,
    getFormattedMonthlyCatalogPrice,
  } = useCatalogPrice(4);

  useEffect(() => {
    if (gatewayCatalog) {
      store.setForm({ gatewaySize: gatewayCatalog.size });
    }
  }, [gatewayCatalog]);

  return (
    <StepComponent
      title={t(
        'pci_projects_project_network_private_create_summary_step_title',
      )}
      order={3}
      isOpen={store.steps.get(StepsEnum.SUMMARY).isOpen}
      isChecked={store.steps.get(StepsEnum.SUMMARY).isChecked}
      isLocked={store.steps.get(StepsEnum.SUMMARY).isLocked}
    >
      <div className="my-8">
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          level={ODS_TEXT_LEVEL.body}
          size={ODS_TEXT_SIZE._400}
        >
          {t('pci_projects_project_network_private_create_summary_step')}
        </OsdsText>

        {!store.form.gateway && (
          <OsdsMessage className="mt-4" type={ODS_MESSAGE_TYPE.warning}>
            <div>
              <OsdsText
                color={ODS_THEME_COLOR_INTENT.text}
                level={ODS_TEXT_LEVEL.body}
                size={ODS_TEXT_SIZE._400}
                className="block"
              >
                {t(
                  'pci_projects_project_network_private_create_summary_step_missing_components_description',
                )}
              </OsdsText>
              <OsdsText
                color={ODS_THEME_COLOR_INTENT.text}
                level={ODS_TEXT_LEVEL.body}
                size={ODS_TEXT_SIZE._400}
                className="block"
              >
                {t(
                  'pci_projects_project_network_private_create_summary_step_gateway_name',
                  { region: store.form.region?.code },
                )}
              </OsdsText>
              <OsdsText
                color={ODS_THEME_COLOR_INTENT.text}
                level={ODS_TEXT_LEVEL.body}
                size={ODS_TEXT_SIZE._400}
                className="ml-2"
              >
                {t(
                  'pci_projects_project_network_private_create_summary_step_gateway_size_and_price',
                  { size: gatewayCatalog?.size.toUpperCase() },
                )}
              </OsdsText>
              <OsdsText
                color={ODS_THEME_COLOR_INTENT.text}
                level={ODS_TEXT_LEVEL.body}
                size={ODS_TEXT_SIZE._400}
                className="ml-2"
              >
                {t(
                  'pci_projects_project_network_private_create_summary_step_price',
                )}
              </OsdsText>

              <OsdsText
                level={ODS_THEME_TYPOGRAPHY_LEVEL.caption}
                size={ODS_THEME_TYPOGRAPHY_SIZE._200}
                color={ODS_THEME_COLOR_INTENT.text}
              >
                {getFormattedMonthlyCatalogPrice(gatewayCatalog?.pricePerMonth)}
              </OsdsText>
              <OsdsText
                color={ODS_THEME_COLOR_INTENT.text}
                level={ODS_TEXT_LEVEL.body}
                size={ODS_TEXT_SIZE._400}
                className="ml-2"
              >
                {t(
                  'pci_projects_project_network_private_create_summary_step_that_is',
                )}
              </OsdsText>
              <OsdsText
                level={ODS_THEME_TYPOGRAPHY_LEVEL.caption}
                size={ODS_THEME_TYPOGRAPHY_SIZE._200}
                color={ODS_THEME_COLOR_INTENT.text}
              >
                {getFormattedHourlyCatalogPrice(gatewayCatalog?.pricePerHour)} (
              </OsdsText>
            </div>
          </OsdsMessage>
        )}

        {store.form.gateway && !store.form.gateway.externalInformation && (
          <div data-ng-if="$ctrl.gateway && !$ctrl.gateway.externalInformation">
            <OsdsMessage className="mt-4" type={ODS_MESSAGE_TYPE.warning}>
              {t(
                'pci_projects_project_network_private_create_summary_step_gateway_with_snat_disabled',
                { gateway: store.form.gateway?.name },
              )}
            </OsdsMessage>

            <OsdsCheckbox
              name="enable-snat"
              checked={store.form.enableSNAT}
              onOdsCheckedChange={(event: CustomEvent) => {
                store.setForm({ enableSNAT: event.detail.checked });
              }}
            >
              <OsdsCheckboxButton
                interactive
                size={ODS_CHECKBOX_BUTTON_SIZE.sm}
                color={ODS_THEME_COLOR_INTENT.primary}
              >
                <OsdsText
                  color={ODS_THEME_COLOR_INTENT.text}
                  level={ODS_TEXT_LEVEL.body}
                  size={ODS_TEXT_SIZE._500}
                  slot="end"
                >
                  {t(
                    'pci_projects_project_network_private_create_summary_step_gateway_enable_snat',
                    {
                      gateway: store.form.gateway?.name,
                    },
                  )}
                </OsdsText>
              </OsdsCheckboxButton>
            </OsdsCheckbox>
          </div>
        )}

        {store.form.gateway?.externalInformation && (
          <OsdsMessage className="mt-4" type={ODS_MESSAGE_TYPE.info}>
            {t(
              'pci_projects_project_network_private_create_summary_step_gateway_available',
              { gateway: store.form.gateway?.name },
            )}
          </OsdsMessage>
        )}

        {isRegionsLoading && (
          <div className="mt-5 gap-5 flex items-center">
            <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />
            <OsdsText
              color={ODS_THEME_COLOR_INTENT.text}
              level={ODS_TEXT_LEVEL.body}
              size={ODS_TEXT_SIZE._500}
            >
              {t('pci_projects_project_network_private_create_loading')}
            </OsdsText>
          </div>
        )}

        <div className="mt-8">
          {!isRegionsLoading && !store.form.isCreating && (
            <OsdsButton
              data-testid="next-cta"
              size={ODS_BUTTON_SIZE.md}
              color={ODS_THEME_COLOR_INTENT.primary}
              onClick={() => {
                onCreate();
              }}
              className="w-fit"
              {...(store.project.isDiscovery ? { disabled: true } : {})}
            >
              {t('pci_projects_project_network_private_create_submit')}
            </OsdsButton>
          )}
          {store.form.isCreating && (
            <div>
              <OsdsSpinner size={ODS_SPINNER_SIZE.sm} inline={true} />
              <OsdsText color={ODS_THEME_COLOR_INTENT.text} className="ml-6">
                {t('pci_projects_project_network_private_create_loading')}
              </OsdsText>
            </div>
          )}
        </div>
      </div>
    </StepComponent>
  );
}
