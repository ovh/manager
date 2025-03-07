import {
  StepComponent,
  TilesInputComponent,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import {
  OsdsBreadcrumb,
  OsdsDivider,
  OsdsFormField,
  OsdsIcon,
  OsdsInput,
  OsdsLink,
  OsdsMessage,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_INPUT_TYPE,
  ODS_SPINNER_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
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
import { TSizeItem, useData } from '@/api/hooks/data';
import { SizeLabelComponent } from '@/pages/edit/SizeLabel.component';
import HidePreloader from '@/core/HidePreloader';
import { RegionType } from '@/types/region';

type TState = {
  size: TSizeItem;
  name: string;
};

export default function EditGatewayPage(): JSX.Element {
  const { navigation } = useContext(ShellContext).shell;
  const { t } = useTranslation(['edit', 'common', 'add', 'global']);
  const { projectId } = useParams();
  const [searchParams] = useSearchParams();
  const { addError, addSuccess, clearNotifications } = useNotifications();
  const navigate = useNavigate();

  const goBack = () => navigate('..');
  const backHref = useHref('..');

  const sizes = useData(projectId);

  const regionName = searchParams.get('region');

  const region = useMemo(
    () =>
      sizes[0]?.availableRegions.find(
        (availableRegion) => availableRegion.name === regionName,
      ),
    [sizes, regionName],
  );

  const { data: gateway, isPending: isGatewayLoading } = useGateway(
    projectId,
    regionName,
    searchParams.get('gatewayId'),
  );

  const [state, setState] = useState<TState>({
    size: undefined,
    name: '',
  });
  const [projectUrl, setProjectUrl] = useState('');

  const { data: project } = useProject();

  const { updateGateway, isPending: isGatewayUpdating } = useEditGateway({
    projectId,
    regionName,
    gatewayId: searchParams.get('gatewayId'),
    onSuccess: () => {
      clearNotifications();
      addSuccess(
        t('pci_projects_project_public_gateway_edit_success', {
          name: state.name,
        }),
        true,
      );
      goBack();
    },
    onError: () => {
      clearNotifications();
      addError(
        t('pci_projects_project_public_gateway_edit_error', {
          name: state.name,
        }),
        true,
      );
      goBack();
    },
  });

  useEffect(() => {
    if (gateway && sizes.length > 0) {
      setState({
        name: gateway.name,
        size: sizes.find((s) => s.payload.split(/-+/).pop() === gateway.model),
      });
    }
  }, [gateway, sizes]);

  useEffect(() => {
    navigation.getURL('', `#/pci/projects/${projectId}`, {}).then((data) => {
      setProjectUrl(data as string);
    });
  }, [projectId, navigation]);

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
              href: `${projectUrl}/gateway`,
              label: t('common:pci_projects_project_public_gateway_title'),
            },
          ]}
        />
      )}

      <OsdsDivider></OsdsDivider>
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
          <OsdsDivider></OsdsDivider>
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
              action: !state.name.length
                ? undefined
                : () => {
                    const payload = {
                      model: state.size.payload.split(/-+/).pop(),
                      name: state.name,
                    };
                    updateGateway(payload);
                  },
              label: t(
                'pci_projects_project_public_gateway_edit_submit_action',
              ),
              isDisabled: false,
            }}
          >
            <OsdsFormField
              error={
                state.name.length ? '' : t('global:common_field_error_required')
              }
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
                value={state.name}
                placeholder={t(
                  'pci_projects_project_public_gateways_edit_public_gateway_field_placeholder',
                )}
                error={!state.name.length}
                inline
                onOdsValueChange={(event) => {
                  setState((prev) => ({
                    ...prev,
                    name: `${event.target.value}`,
                  }));
                }}
                type={ODS_INPUT_TYPE.text}
                color={ODS_THEME_COLOR_INTENT.primary}
                className="border"
              />
            </OsdsFormField>

            <TilesInputComponent<TSizeItem, string, string>
              value={state.size}
              items={sizes}
              label={(item: TSizeItem) => <SizeLabelComponent item={item} />}
              onInput={(item) => {
                setState({ ...state, size: item });
              }}
            />
            {region?.type === RegionType['3AZ'] && (
              <OsdsMessage
                color={ODS_THEME_COLOR_INTENT.warning}
                icon={ODS_ICON_NAME.WARNING}
                className="mb-6"
              >
                <OsdsText
                  level={ODS_TEXT_LEVEL.body}
                  size={ODS_TEXT_SIZE._400}
                  color={ODS_THEME_COLOR_INTENT.text}
                >
                  {t('add:pci_projects_project_public_gateways_3az_price')}
                </OsdsText>
              </OsdsMessage>
            )}
          </StepComponent>
        </>
      )}
    </>
  );
}
