import { PciModal } from '@ovh-ux/manager-pci-common';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { Translation, useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useEffect, useState } from 'react';
import { OsdsFormField, OsdsInput } from '@ovhcloud/ods-components/react';
import { ODS_INPUT_TYPE } from '@ovhcloud/ods-components';
import {
  useGetPoolMember,
  useUpdatePoolMember,
} from '@/api/hook/usePoolMember';
import LabelComponent from '@/components/form/Label.component';

export default function EditPage() {
  const { addSuccess, addError } = useNotifications();
  const navigate = useNavigate();
  const { t: tEdit } = useTranslation('pools/members/edit');
  const { t: tPciCommon } = useTranslation('pci-common');
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
  const [memberName, setMemberName] = useState('');
  const [isTouched, setIsTouched] = useState(false);
  const {
    updatePoolMemberName,
    isPending: isPendingUpdate,
  } = useUpdatePoolMember({
    projectId,
    region,
    poolId,
    memberId,
    name: memberName,
    onError(error: ApiError) {
      addError(
        <Translation ns="octavia-load-balancer">
          {(_t) =>
            _t('octavia_load_balancer_global_error', {
              message: error?.response?.data?.message || error?.message || null,
              requestId: error?.config?.headers['X-OVH-MANAGER-REQUEST-ID'],
            })
          }
        </Translation>,
        true,
      );
      onClose();
    },
    onSuccess() {
      addSuccess(
        <Translation ns="pools/members">
          {(_t) =>
            _t('octavia_load_balancer_pools_detail_members_edit_name_success')
          }
        </Translation>,
        true,
      );
      navigate('..');
    },
  });

  const onConfirm = () => {
    updatePoolMemberName();
  };

  const onCancel = () => {
    navigate('..');
  };
  useEffect(() => {
    if (poolMember) {
      setMemberName(poolMember.name);
    }
  }, [poolMember]);
  return (
    <PciModal
      title={tEdit('octavia_load_balancer_pools_members_edit_name_title')}
      onClose={onClose}
      onCancel={onCancel}
      onConfirm={onConfirm}
      type="default"
      isPending={isPendingPoolMember || isPendingUpdate}
      isDisabled={!memberName.trim()}
      submitText={tEdit(
        'octavia_load_balancer_pools_members_edit_name_confirm',
      )}
      cancelText={tEdit('octavia_load_balancer_pools_members_edit_name_cancel')}
    >
      <OsdsFormField
        className="mt-8"
        error={
          isTouched && !memberName.trim()
            ? tPciCommon('common_field_error_required')
            : ''
        }
      >
        <LabelComponent
          text={tEdit('octavia_load_balancer_pools_members_edit_name_label')}
          slot="label"
          hasError={isTouched && !memberName.trim()}
        />
        <OsdsInput
          value={memberName}
          type={ODS_INPUT_TYPE.text}
          error={isTouched && !memberName.trim()}
          onOdsValueChange={(event) => {
            setMemberName(event.detail.value.trim());
          }}
          onOdsInputBlur={() => {
            setIsTouched(true);
          }}
        />
      </OsdsFormField>
    </PciModal>
  );
}
