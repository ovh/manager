import { useTranslation, Translation } from 'react-i18next';
import {
  ODS_BUTTON_VARIANT,
  ODS_SPINNER_SIZE,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsModal,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
} from '@ovhcloud/ods-common-theming';
import { useNotifications } from '@ovhcloud/manager-components';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import { useDeleteGateway } from '@/api/hooks/useGateway';
import { TOperation } from '@/api/data/operation';
import { useOperation } from '@/api/hooks/operation';
import queryClient from '@/queryClient';
import { GatewayResponse } from '@/interface';

export default function DeleteGateway() {
  const [deleteOperationId, setDeleteOperationId] = useState<string | null>(
    null,
  );
  const { t: tDelete } = useTranslation('delete');
  const { projectId } = useParams();
  const [searchParams] = useSearchParams();
  const { addError, addSuccess } = useNotifications();
  const gatewayId = searchParams.get('id');
  const name = searchParams.get('name');
  const region = searchParams.get('region');
  const navigate = useNavigate();
  const onClose = () => {
    navigate('..');
  };

  const { isPending: isDeleteOperationPending } = useOperation({
    projectId,
    operationId: deleteOperationId,
    onSuccess: () => {
      queryClient.setQueryData(
        ['project', projectId, 'gateway'],
        (old: GatewayResponse) => ({
          ...old,
          resources: old.resources.filter(({ id }) => id !== gatewayId),
        }),
      );

      addSuccess(
        <Translation ns="delete">
          {(t) =>
            t('pci_projects_project_public_gateway_delete_success', {
              name,
            })
          }
        </Translation>,
        true,
      );
      onClose();
    },
  });

  const { deleteGateway, isPending: isPendingDeleteGateway } = useDeleteGateway(
    {
      projectId: `${projectId}`,
      gatewayId,
      region,
      onError: () => {
        addError(
          <Translation ns="delete">
            {(t) =>
              t('pci_projects_project_public_gateway_delete_error', {
                name,
              })
            }
          </Translation>,
          true,
        );
        onClose();
      },
      onSuccess: (op: TOperation) => {
        console.log('op', op);
        setDeleteOperationId(op.id);
        // addSuccess(
        //   <Translation ns="delete">
        //     {(t) =>
        //       t('pci_projects_project_public_gateway_delete_success', {
        //         name,
        //       })
        //     }
        //   </Translation>,
        //   true,
        // );
        // onClose();
      },
    },
  );

  const isPending = isPendingDeleteGateway || isDeleteOperationPending;
  return (
    <OsdsModal
      headline={
        !isPending ? tDelete('pci_projects_project_public_gateway_delete') : ''
      }
      onOdsModalClose={onClose}
    >
      <slot name="content">
        {!isPending ? (
          <OsdsText
            level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
            color={ODS_THEME_COLOR_INTENT.text}
            size={ODS_TEXT_SIZE._400}
            className={'block mt-6'}
          >
            {tDelete(
              'pci_projects_project_public_gateway_delete_confirmation',
              {
                name,
              },
            )}
          </OsdsText>
        ) : (
          <OsdsSpinner
            inline
            size={ODS_SPINNER_SIZE.md}
            className="block text-center"
            data-testid="deleteGateway-spinner"
          />
        )}
      </slot>
      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        variant={ODS_BUTTON_VARIANT.ghost}
        onClick={onClose}
        data-testid="deleteGateway-button_cancel"
      >
        {tDelete('pci_projects_project_public_gateway_delete_cancel')}
      </OsdsButton>
      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        onClick={deleteGateway}
        {...(isPending ? { disabled: true } : {})}
        data-testid="deleteGateway-button_submit"
      >
        {tDelete('pci_projects_project_public_gateway_delete_confirm')}
      </OsdsButton>
    </OsdsModal>
  );
}
