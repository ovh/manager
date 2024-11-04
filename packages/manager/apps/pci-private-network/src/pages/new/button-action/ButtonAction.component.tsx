import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  OsdsButton,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { useNotifications } from '@ovh-ux/manager-react-components';
import {
  ODS_BUTTON_VARIANT,
  ODS_BUTTON_TYPE,
  ODS_SPINNER_SIZE,
} from '@ovhcloud/ods-components';
import { isDiscoveryProject, useProject } from '@ovh-ux/manager-pci-common';
import { useNavigate } from 'react-router-dom';
import { useFormContext } from 'react-hook-form';
import { ErrorResponse } from '@/types/network.type';
import { ROUTE_PATHS } from '@/routes';
import { NewPrivateNetworkForm } from '@/types/private-network-form.type';
import { useCheckPrivateNetworkCreationStatus } from '@/data/hooks/networks/useNetworks';
import { handleCreatePrivateNetwork } from '@/data/services/services';
import { resetNetworks } from '@/queryClient';

const ButtonAction: React.FC = () => {
  const { t } = useTranslation(['new', 'common']);
  const { addError, addSuccess } = useNotifications();

  const form = useFormContext<NewPrivateNetworkForm>();

  const { data: project } = useProject();
  const projectId = useMemo(() => project.project_id, [project]);
  const isDiscovery = isDiscoveryProject(project);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const {
    mutateAsync: getCreationStatus,
  } = useCheckPrivateNetworkCreationStatus();

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

    await resetNetworks(projectId);
    navigate(`../${redirectPath}`);
  };

  const onError = (e: ErrorResponse) => {
    addError(
      <span>
        {t('new:pci_projects_project_network_private_create_error', {
          message: e?.response?.data?.message || e?.message,
        })}
      </span>,
      true,
    );
  };

  const create = async (values: NewPrivateNetworkForm) => {
    setIsLoading(true);

    try {
      await handleCreatePrivateNetwork(values, projectId, getCreationStatus);
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
          onClick={async () => navigate('..')}
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
