import { Translation, useTranslation } from 'react-i18next';
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
import { useNotifications } from '@ovh-ux/manager-react-components';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useContext, useState } from 'react';
import { useDeleteGateway } from '@/api/hooks/useGateway';
import queryClient from '@/queryClient';
import { Gateway } from '@/interface';
import { checkOperation, TOperation } from '@/api/data/operation';
import { ACTION_PREFIX } from '@/tracking.constants';

export default function DeleteGateway() {
  const { t: tDelete } = useTranslation('delete');
  const { projectId } = useParams();
  const [searchParams] = useSearchParams();
  const { addError, addSuccess } = useNotifications();
  const { tracking } = useContext(ShellContext)?.shell || {};
  const gatewayId = searchParams.get('id');
  const name = searchParams.get('name');
  const region = searchParams.get('region');
  const navigate = useNavigate();
  const onClose = (isCanceled = false) => {
    if (isCanceled) {
      tracking?.trackClick({
        name: `${ACTION_PREFIX}::delete::cancel`,
        type: 'action',
      });
    }
    navigate('..');
  };
  const [isOperationPending, setIsOperationPending] = useState(false);

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
        setIsOperationPending(true);
        checkOperation({
          projectId,
          operationId: op.id,
          callback: (operation) => {
            if (['completed', 'created'].includes(operation.status)) {
              queryClient.setQueryData(
                ['project', projectId, 'gateway'],
                (rows: Gateway[]) => rows.filter((row) => row.id !== gatewayId),
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
              setIsOperationPending(false);
              return true;
            }
            if (['in-error', 'unknown'].includes(operation.status)) {
              onClose();
              setIsOperationPending(false);
              return true;
            }

            return false;
          },
        });
      },
    },
  );

  const isPending = isPendingDeleteGateway || isOperationPending;
  return (
    <OsdsModal
      headline={
        !isPending ? tDelete('pci_projects_project_public_gateway_delete') : ''
      }
      onOdsModalClose={() => onClose(true)}
    >
      <slot name="content">
        {!isPending ? (
          <OsdsText
            level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
            color={ODS_THEME_COLOR_INTENT.text}
            size={ODS_TEXT_SIZE._400}
            className="block mt-6"
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
        onClick={() => onClose(true)}
        data-testid="deleteGateway-button_cancel"
      >
        {tDelete('pci_projects_project_public_gateway_delete_cancel')}
      </OsdsButton>
      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        onClick={() => {
          deleteGateway();
          tracking?.trackClick({
            name: `${ACTION_PREFIX}::delete::confirm`,
            type: 'action',
          });
        }}
        {...(isPending ? { disabled: true } : {})}
        data-testid="deleteGateway-button_submit"
      >
        {tDelete('pci_projects_project_public_gateway_delete_confirm')}
      </OsdsButton>
    </OsdsModal>
  );
}
