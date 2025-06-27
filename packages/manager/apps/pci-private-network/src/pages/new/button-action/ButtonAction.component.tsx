import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  OsdsButton,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  useNotifications,
  useProjectUrl,
} from '@ovh-ux/manager-react-components';
import {
  ODS_BUTTON_VARIANT,
  ODS_BUTTON_TYPE,
  ODS_SPINNER_SIZE,
} from '@ovhcloud/ods-components';
import {
  isApiCustomError,
  isMaxQuotaReachedError,
} from '@ovh-ux/manager-core-api';
import { isDiscoveryProject, useProject } from '@ovh-ux/manager-pci-common';
import { useNavigate } from 'react-router-dom';
import { useFormContext } from 'react-hook-form';
import { ROUTE_PATHS } from '@/routes';
import { NewPrivateNetworkForm } from '@/types/private-network-form.type';
import {
  createPrivateNetwork,
  refreshPrivateNetworkList,
} from '@/data/services/services';
import GuideLink from '@/components/GuideLink/GuideLink.component';

const ButtonAction: React.FC = () => {
  const { t } = useTranslation(['new', 'common']);
  const { addError, addSuccess } = useNotifications();

  const form = useFormContext<NewPrivateNetworkForm>();

  const hrefProject = useProjectUrl('public-cloud');
  const { data: project } = useProject();
  const projectId = project.project_id;
  const isDiscovery = isDiscoveryProject(project);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const onSuccess = async (
    privateNetworkName: string,
    isLocalZone: boolean,
  ) => {
    addSuccess(
      <span>
        {t('new:pci_projects_project_network_private_create_success', {
          name: privateNetworkName,
        })}
      </span>,
      true,
    );

    const redirectPath = isLocalZone
      ? ROUTE_PATHS.localZone
      : ROUTE_PATHS.globalRegions;

    navigate(`../${redirectPath}`);
  };

  const onError = (e: unknown) => {
    const errorMessage =
      isApiCustomError(e) && isMaxQuotaReachedError(e) ? (
        <Trans
          ns="new"
          i18nKey="pci_projects_project_network_private_create_error_quota_exceeded"
          components={{
            Link: (
              <GuideLink href={`${hrefProject}/quota`} isTargetBlank={false} />
            ),
          }}
        />
      ) : (
        <Trans
          ns="new"
          i18nKey="pci_projects_project_network_private_create_error"
          values={{
            message: isApiCustomError(e) ? e.response.data.message : '',
          }}
        />
      );
    addError(errorMessage, true);
  };

  const create = async (values: NewPrivateNetworkForm) => {
    setIsLoading(true);

    try {
      await createPrivateNetwork(values, projectId);
      refreshPrivateNetworkList(projectId);
      onSuccess(values.name, values.isLocalZone);
    } catch (e) {
      onError(e);
    }

    setIsLoading(false);
  };

  return (
    <>
      {isLoading && (
        <div className="flex items-center">
          <OsdsSpinner size={ODS_SPINNER_SIZE.sm} inline={true} />
          <OsdsText color={ODS_THEME_COLOR_INTENT.text} className="ml-6">
            {t('pci_projects_project_network_private_create_loading')}
          </OsdsText>
        </div>
      )}
      <div className="flex gap-x-5 mt-10">
        <OsdsButton
          type={ODS_BUTTON_TYPE.button}
          variant={ODS_BUTTON_VARIANT.stroked}
          color={ODS_THEME_COLOR_INTENT.primary}
          inline
          onClick={() => navigate('..')}
        >
          {t('common:common_cancel_button_label')}
        </OsdsButton>
        <OsdsButton
          data-testid="create-private-network"
          disabled={
            !form.formState.isValid || isDiscovery || isLoading
              ? true
              : undefined
          }
          color={ODS_THEME_COLOR_INTENT.primary}
          inline
          onClick={form.handleSubmit(create)}
        >
          {t('pci_projects_project_network_private_create_configure')}
        </OsdsButton>
      </div>
    </>
  );
};

export default ButtonAction;
