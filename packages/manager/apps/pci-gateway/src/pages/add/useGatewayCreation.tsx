import { useContext, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  useNotifications,
  useProjectUrl,
} from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  isApiCustomError,
  isMaxQuotaReachedError,
} from '@ovh-ux/manager-core-api';
import { StepsEnum, useNewGatewayStore } from '@/pages/add/useStore';
import { useCreateNetworkWithGateway } from '@/api/hooks/useNetworks';
import { useCreateGateway } from '@/api/hooks/useGateways';
import { checkOperation, TOperation } from '@/api/data/operation';
import queryClient from '@/queryClient';
import { GuideLink } from '@/components/GuideLink';

export const useGatewayCreation = (submittingStep: StepsEnum) => {
  const [isOperationPending, setIsOperationPending] = useState(false);
  const { tracking } = useContext(ShellContext).shell;
  const hrefProject = useProjectUrl('public-cloud');
  const { addError, addSuccess, clearNotifications } = useNotifications();
  const { t } = useTranslation('add');
  const navigate = useNavigate();
  const store = useNewGatewayStore();

  const invalidateGatewaysList = () => {
    queryClient.invalidateQueries({
      queryKey: ['project', store?.project?.id, 'gateway'],
    });
  };

  const quotaError = (
    <Trans
      ns="add"
      i18nKey="pci_projects_project_public_gateways_quota_error"
      components={{
        Link: <GuideLink href={`${hrefProject}/quota`} isTargetBlank={false} />,
      }}
    />
  );

  const awaitGatewayDelivery = (errorMessageKey: string) => (
    op: TOperation,
  ) => {
    clearNotifications();
    setIsOperationPending(true);
    checkOperation({
      projectId: store.project?.id,
      operationId: op.id,
      callback: (operation) => {
        if (['completed', 'created'].includes(operation.status)) {
          invalidateGatewaysList();
          navigate('..');
          addSuccess(
            t('pci_projects_project_public_gateways_add_success'),
            true,
          );
          setIsOperationPending(false);
          return true;
        }
        if (['in-error', 'unknown'].includes(operation.status)) {
          addError(t(errorMessageKey, { message: '' }), true);
          setIsOperationPending(false);
          return true;
        }

        return false;
      },
    });
  };

  const {
    createNetworkWithGateway,
    isPending: isCreatingNetworkWithGateway,
  } = useCreateNetworkWithGateway({
    projectId: store.project?.id,
    regionName: store.form.regionName,
    onSuccess: awaitGatewayDelivery(
      'pci_projects_project_public_gateways_add_modal_add_private_network_error',
    ),
    onError: (error) => {
      if (isApiCustomError(error) && isMaxQuotaReachedError(error)) {
        addError(quotaError);
      } else {
        addError(
          t(
            'pci_projects_project_public_gateways_add_modal_add_private_network_error',
            {
              message: isApiCustomError(error)
                ? error.response?.data.message
                : 'Unknown error',
            },
          ),
        );
      }
      store.updateStep.unlock(submittingStep);
    },
  });

  const { createGateway, isPending: isCreatingGateway } = useCreateGateway({
    projectId: store.project?.id,
    regionName: store.form.regionName,
    networkId: store.form.network.id,
    subnetId: store.form.network.subnetId,
    onSuccess: awaitGatewayDelivery(
      'pci_projects_project_public_gateways_add_error',
    ),
    onError: (error) => {
      addError(
        isApiCustomError(error) && isMaxQuotaReachedError(error)
          ? quotaError
          : t('pci_projects_project_public_gateways_add_error', {
              message: isApiCustomError(error)
                ? error.response.data.message
                : '',
            }),
      );

      store.updateStep.unlock(submittingStep);
    },
  });

  const create = () => {
    store.updateStep.lock(submittingStep);
    if (store.form.network.id === 'new') {
      createNetworkWithGateway({
        gateway: {
          name: store.form.name,
          model: store.form.size,
        },
        name: store.form.newNetwork.name,
        subnet: {
          cidr: store.form.newNetwork.subnet,
          ipVersion: 4,
          enableDhcp: true,
          enableGatewayIp: true,
        },
      });
    } else {
      createGateway({
        name: store.form.name,
        model: store.form.size,
      });
    }
    tracking.trackClick({
      name: `confirm-add-public-gateway::${store.form.size}::${store.form.regionName}`,
      type: 'action',
    });
  };

  return {
    create,
    isCreating:
      isCreatingGateway || isCreatingNetworkWithGateway || isOperationPending,
  };
};
