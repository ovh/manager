import { PciModal } from '@ovh-ux/manager-pci-common';
import { Translation, useTranslation } from 'react-i18next';
import { OsdsFormField, OsdsInput } from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_INPUT_TYPE } from '@ovhcloud/ods-components';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useNotifications } from '@ovh-ux/manager-react-components';
import {
  useLoadBalancer,
  useRenameLoadBalancer,
} from '@/api/hook/useLoadBalancer';
import LabelComponent from '@/components/form/Label.component';

export default function Edit() {
  const { addSuccess, addError } = useNotifications();
  const { t: tEditName } = useTranslation('load-balancer/edit-name');
  const { projectId, region, loadBalancerId } = useParams();
  const navigate = useNavigate();

  const onClose = () => {
    navigate('..');
  };

  const {
    data: loadBalancer,
    isPending: isPendingLoadBalancer,
  } = useLoadBalancer({
    projectId,
    region,
    loadBalancerId,
  });

  const [loadBalancerName, setLoadBalancerName] = useState(loadBalancer?.name);

  const {
    renameLoadBalancer,
    isPending: isPendingRename,
  } = useRenameLoadBalancer({
    projectId,
    loadBalancer,
    name: loadBalancerName,
    onError(error: ApiError) {
      addError(
        <Translation ns="load-balancer">
          {(_t) => (
            <span
              dangerouslySetInnerHTML={{
                __html: _t('octavia_load_balancer_global_error', {
                  message:
                    error?.response?.data?.message || error?.message || null,
                  requestId: error?.config?.headers['X-OVH-MANAGER-REQUEST-ID'],
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
        <Translation ns="load-balancer/overview">
          {(_t) => _t('octavia_load_balancer_edit_name_success')}
        </Translation>,
        true,
      );
      navigate('..');
    },
  });

  const onCancel = () => {
    navigate('..');
  };

  const onConfirm = () => {
    renameLoadBalancer();
  };

  const isPending = isPendingLoadBalancer || isPendingRename;

  return (
    <PciModal
      title={tEditName('octavia_load_balancer_edit_name_title')}
      onCancel={onCancel}
      onClose={onClose}
      onConfirm={onConfirm}
      isPending={isPending}
      isDisabled={isPending}
      submitText={tEditName('octavia_load_balancer_edit_name_confirm')}
      cancelText={tEditName('octavia_load_balancer_edit_name_cancel')}
    >
      <OsdsFormField>
        <LabelComponent
          text={tEditName('octavia_load_balancer_edit_name_label')}
        />
        <OsdsInput
          value={loadBalancerName}
          onOdsValueChange={(event) => setLoadBalancerName(event.detail.value)}
          type={ODS_INPUT_TYPE.text}
          color={ODS_THEME_COLOR_INTENT.primary}
        />
      </OsdsFormField>
    </PciModal>
  );
}
