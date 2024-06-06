import { StepComponent, useCatalogPrice } from '@ovhcloud/manager-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import {
  ODS_CHECKBOX_BUTTON_SIZE,
  ODS_MESSAGE_TYPE,
  ODS_SPINNER_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsCheckbox,
  OsdsCheckboxButton,
  OsdsMessage,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';

import { useEnvironment } from '@ovh-ux/manager-react-shell-client';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useGatewayCatalog } from '@/api/hooks/useGateway';
import { TFormState } from '../New.page';

type TGatewaySummaryStep = {
  isOpen: boolean;
  onNext?: () => void;
  formState: TFormState;
  setFormState: (formState) => void;
  isLoading: boolean;
};

export default function GatewaySummaryStep({
  isOpen,
  onNext,
  formState,
  setFormState,
  isLoading,
}: Readonly<TGatewaySummaryStep>): JSX.Element {
  const { t } = useTranslation('new');

  const { ovhSubsidiary } = useEnvironment().getUser();

  const { data: gatewayCatalog } = useGatewayCatalog(ovhSubsidiary);

  const {
    getFormattedHourlyCatalogPrice,
    getFormattedMonthlyCatalogPrice,
  } = useCatalogPrice(4);

  useEffect(() => {
    if (gatewayCatalog) {
      setFormState((prevState) => ({
        ...prevState,
        gatewaySize: gatewayCatalog.size,
      }));
    }
  }, [gatewayCatalog]);

  return (
    <StepComponent
      title={t(
        'pci_projects_project_network_private_create_summary_step_title',
      )}
      next={
        isLoading
          ? undefined
          : {
              action: onNext,
              label: t('pci_projects_project_network_private_create_submit'),
              isDisabled: false,
            }
      }
      order={3}
      isOpen={isOpen}
    >
      <div className="my-8">
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          level={ODS_TEXT_LEVEL.body}
          size={ODS_TEXT_SIZE._400}
        >
          {t('pci_projects_project_network_private_create_summary_step')}
        </OsdsText>

        {!formState.gateway && (
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
                  { region: formState.region?.code },
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

        {formState.gateway && !formState.gateway.externalInformation && (
          <div data-ng-if="$ctrl.gateway && !$ctrl.gateway.externalInformation">
            <OsdsMessage className="mt-4" type={ODS_MESSAGE_TYPE.warning}>
              {t(
                'pci_projects_project_network_private_create_summary_step_gateway_with_snat_disabled',
                { gateway: formState.gateway?.name },
              )}
            </OsdsMessage>

            <OsdsCheckbox
              name="enable-snat"
              checked={formState.enableSNAT}
              onOdsCheckedChange={(event: CustomEvent) => {
                setFormState((prevState) => ({
                  ...prevState,
                  enableSNAT: event.detail.checked,
                }));
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
                      gateway: formState.gateway?.name,
                    },
                  )}
                </OsdsText>
              </OsdsCheckboxButton>
            </OsdsCheckbox>
          </div>
        )}

        {formState.gateway?.externalInformation && (
          <OsdsMessage className="mt-4" type={ODS_MESSAGE_TYPE.info}>
            {t(
              'pci_projects_project_network_private_create_summary_step_gateway_available',
              { gateway: formState.gateway?.name },
            )}
          </OsdsMessage>
        )}

        {isLoading && (
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
      </div>
    </StepComponent>
  );
}
