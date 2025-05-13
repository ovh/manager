import { Translation, useTranslation } from 'react-i18next';
import { DeletionModal } from '@ovh-ux/manager-pci-common';
import { useNavigate, useParams } from 'react-router-dom';
import { OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { ApiError } from '@ovh-ux/manager-core-api';
import {
  useDeletePoolMember,
  useGetPoolMember,
} from '@/api/hook/usePoolMember';

export default function DeletePage() {
  const { addSuccess, addError } = useNotifications();
  const { t: tDelete } = useTranslation('pools/members/delete');
  const navigate = useNavigate();
  const { projectId, poolId, region, memberId } = useParams();
  const onClose = () => {
    navigate('..');
  };
  const { data: poolMember, isPending: isPendingPoolMember } = useGetPoolMember(
    projectId,
    poolId,
    region,
    memberId,
  );
  const { deletePoolMember, isPending: isPendingDelete } = useDeletePoolMember({
    projectId,
    region,
    poolId,
    memberId,
    onError(error: ApiError) {
      addError(
        <Translation ns="load-balancer">
          {(_t) => (
            <span
              dangerouslySetInnerHTML={{
                __html: _t('octavia_load_balancer_global_error', {
                  message: (error?.response?.data as { message: string })
                    ?.message,
                  requestId: error.response?.headers['x-ovh-queryid'],
                }),
              }}
            ></span>
          )}
        </Translation>,
        true,
      );
      onClose();
    },
    onSuccess() {
      addSuccess(
        <Translation ns="pools/members">
          {(_t) =>
            _t('octavia_load_balancer_pools_detail_members_delete_success', {
              membre: poolMember?.name,
            })
          }
        </Translation>,
        true,
      );
      navigate('..');
    },
  });

  const onConfirm = () => {
    deletePoolMember();
  };

  const onCancel = () => {
    navigate('..');
  };

  return (
    <DeletionModal
      title={tDelete('octavia_load_balancer_pools_members_delete_title')}
      onConfirm={onConfirm}
      onClose={onClose}
      onCancel={onCancel}
      isPending={isPendingDelete || isPendingPoolMember}
      type="warning"
      submitText={tDelete('octavia_load_balancer_pools_members_delete_confirm')}
      cancelText={tDelete('octavia_load_balancer_pools_members_delete_cancel')}
    >
      <OsdsText
        level={ODS_TEXT_LEVEL.body}
        color={ODS_THEME_COLOR_INTENT.text}
        size={ODS_TEXT_SIZE._400}
      >
        {tDelete('octavia_load_balancer_pools_members_delete_description', {
          member: poolMember?.name,
        })}
      </OsdsText>
    </DeletionModal>
  );
}
