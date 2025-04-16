import {
  StepComponent,
  TilesInputComponent,
  useNotifications,
  useProjectUrl,
} from '@ovh-ux/manager-react-components';
import {
  OsdsBreadcrumb,
  OsdsDivider,
  OsdsFormField,
  OsdsIcon,
  OsdsInput,
  OsdsLink,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_INPUT_TYPE,
  ODS_SPINNER_SIZE,
} from '@ovhcloud/ods-components';
import {
  useHref,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useProject } from '@ovh-ux/manager-pci-common';
import { useEditGateway, useGateway } from '@/api/hooks/useGateways';
import HidePreloader from '@/core/HidePreloader';
import { TProductAddonDetail } from '@/types/product.type';
import SizeLabel from '@/components/size/SizeLabel.component';
import { useAddons } from '@/api/hooks/useAddons/useAddons';
import { GATEWAY_ADDON_FAMILY } from '@/api/hooks/useAddons/useAddons.constant';
import { filterProductRegionBySize } from '@/api/hooks/useAddons/useAddons.select';

export default function EditGatewayPage(): JSX.Element {
  const { t } = useTranslation(['edit', 'common', 'global']);
  const { ovhSubsidiary } = useContext(ShellContext).environment.getUser();

  const { projectId } = useParams();
  const [searchParams] = useSearchParams();
  const { addError, addSuccess, clearNotifications } = useNotifications();

  const { data: project } = useProject();

  const projectUrl = useProjectUrl('public-cloud');

  const regionName = searchParams.get('region');

  const navigate = useNavigate();

  const backHref = useHref('..');

  const goBack = () => navigate('..');

  const [size, setSize] = useState<TProductAddonDetail>();
  const [name, setName] = useState('');

  const { addons } = useAddons({
    ovhSubsidiary,
    projectId,
    addonFamily: GATEWAY_ADDON_FAMILY,
    select: (products: TProductAddonDetail[]) =>
      filterProductRegionBySize(products, regionName),
  });

  const { data: gateway, isPending: isGatewayLoading } = useGateway(
    projectId,
    regionName,
    searchParams.get('gatewayId'),
  );

  const { updateGateway, isPending: isGatewayUpdating } = useEditGateway({
    projectId,
    regionName,
    gatewayId: searchParams.get('gatewayId'),
    onSuccess: () => {
      clearNotifications();
      addSuccess(
        t('pci_projects_project_public_gateway_edit_success', {
          name,
        }),
        true,
      );
      goBack();
    },
    onError: () => {
      clearNotifications();
      addError(
        t('pci_projects_project_public_gateway_edit_error', {
          name,
        }),
        true,
      );
      goBack();
    },
  });

  useEffect(() => {
    if (gateway && addons.length > 0) {
      setName(gateway.name);
      setSize(addons.find((addon) => addon.size === gateway.model));
    }
  }, [gateway, addons]);

  return (
    <>
      <HidePreloader />
      {project && (
        <OsdsBreadcrumb
          items={[
            {
              href: projectUrl,
              label: project.description,
            },
            {
              label: t('common:pci_projects_project_public_gateway_title'),
            },
          ]}
        />
      )}

      <OsdsDivider />
      <OsdsLink
        className="mt-6 mb-3"
        color={ODS_THEME_COLOR_INTENT.primary}
        href={backHref}
      >
        <OsdsIcon
          className="mr-2"
          name={ODS_ICON_NAME.ARROW_LEFT}
          size={ODS_ICON_SIZE.xs}
          color={ODS_THEME_COLOR_INTENT.primary}
          slot="start"
        />
        {t('pci_projects_project_public_gateway_edit_go_back')}
      </OsdsLink>
      {isGatewayLoading ? (
        <OsdsSpinner
          inline
          size={ODS_SPINNER_SIZE.md}
          className="block mt-4 text-center"
        />
      ) : (
        <>
          {isGatewayUpdating && (
            <OsdsSpinner
              inline
              size={ODS_SPINNER_SIZE.md}
              className="block mt-4 text-center"
              data-testid="gatewayEdit-spinner"
            />
          )}
          <OsdsDivider />
          <StepComponent
            id="edit"
            order={1}
            isOpen
            isChecked={isGatewayUpdating}
            isLocked={isGatewayUpdating}
            title={t('pci_projects_project_public_gateway_edit_title')}
            subtitle={
              <OsdsText
                level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                color={ODS_THEME_COLOR_INTENT.text}
              >
                {t('pci_projects_project_public_gateway_edit_info')}
              </OsdsText>
            }
            next={{
              action: () => {
                const payload = {
                  model: size.size,
                  name,
                };
                updateGateway(payload);
              },
              label: t(
                'pci_projects_project_public_gateway_edit_submit_action',
              ),
              isDisabled: !name || !size,
            }}
          >
            <OsdsFormField
              error={name.length ? '' : t('global:common_field_error_required')}
            >
              <OsdsText
                level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                color={ODS_THEME_COLOR_INTENT.text}
                slot="label"
              >
                {t(
                  'pci_projects_project_public_gateways_edit_public_gateway_field_label',
                )}
              </OsdsText>
              <OsdsInput
                value={name}
                placeholder={t(
                  'pci_projects_project_public_gateways_edit_public_gateway_field_placeholder',
                )}
                error={!name.length}
                inline
                onOdsValueChange={(event) => setName(`${event.target.value}`)}
                type={ODS_INPUT_TYPE.text}
                color={ODS_THEME_COLOR_INTENT.primary}
                className="border"
              />
            </OsdsFormField>

            <TilesInputComponent<TProductAddonDetail, string, string>
              value={size}
              items={addons}
              label={(props) => <SizeLabel {...props} />}
              onInput={(item) => setSize(item)}
            />
          </StepComponent>
        </>
      )}
    </>
  );
}
