import { Translation, useTranslation } from 'react-i18next';
import { DeletionModal } from '@ovh-ux/manager-pci-common';
import { useNavigate, useParams } from 'react-router-dom';
import { OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useDeleteListener, useListener } from '@/api/hook/useListener';

export default function DeleteListenerPage() {
  const { addSuccess, addError } = useNotifications();
  const { t } = useTranslation('listeners/delete');

  const navigate = useNavigate();

  const { projectId, loadBalancerId, listenerId, region } = useParams();

  const onClose = () => {
    navigate('..');
  };

  const { data: listener, isPending: isPendingListener } = useListener({
    projectId,
    region,
    loadBalancerId,
    listenerId,
  });

  const { deleteListener, isPending: isPendingDelete } = useDeleteListener({
    projectId,
    loadBalancerId,
    listenerId,
    region,
    onError(error: ApiError) {
      addError(
        <Translation ns="load-balancer">
          {(_t) => (
            <span
              dangerouslySetInnerHTML={{
                __html: _t('octavia_load_balancer_global_error', {
                  message: ((error.response as unknown) as {
                    data: { message: string };
                  }).data.message,
                  requestId: ((error.response as unknown) as {
                    headers: Record<string, unknown>;
                  }).headers['x-ovh-queryid'],
                }),
              }}
            />
          )}
        </Translation>,
        true,
      );
      onClose();
    },
    onSuccess() {
      addSuccess(
        <Translation ns="listeners">
          {(_t) =>
            _t('octavia_load_balancer_listener_delete_success', {
              listener: listener?.name,
            })
          }
        </Translation>,
        true,
      );
      navigate('..');
    },
  });

  const onConfirm = () => {
    deleteListener();
  };

  const onCancel = () => {
    navigate('..');
  };

  const isPending = isPendingListener || isPendingDelete;

  return (
    <DeletionModal
      title={t('octavia_load_balancer_listener_delete_title')}
      onConfirm={onConfirm}
      onClose={onClose}
      onCancel={onCancel}
      isPending={isPending}
      type="warning"
      submitText={t('octavia_load_balancer_listener_delete_confirm')}
      cancelText={t('octavia_load_balancer_listener_delete_cancel')}
    >
      <OsdsText
        level={ODS_TEXT_LEVEL.body}
        color={ODS_THEME_COLOR_INTENT.text}
        size={ODS_TEXT_SIZE._400}
      >
        {t('octavia_load_balancer_listener_delete_description', {
          listener: listener?.name,
        })}
      </OsdsText>
    </DeletionModal>
  );
}
