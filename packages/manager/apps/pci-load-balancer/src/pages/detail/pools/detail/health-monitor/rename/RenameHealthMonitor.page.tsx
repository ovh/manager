import { useMemo, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { Trans, useTranslation } from 'react-i18next';

import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_INPUT_TYPE } from '@ovhcloud/ods-components';
import { OsdsFormField, OsdsInput, OsdsText } from '@ovhcloud/ods-components/react';

import { ApiError } from '@ovh-ux/manager-core-api';
import { PciModal } from '@ovh-ux/manager-pci-common';
import { useNotifications } from '@ovh-ux/manager-react-components';

import { useGetHealthMonitor, useRenameHealthMonitor } from '@/api/hook/useHealthMonitor';
import LabelComponent from '@/components/form/Label.component';
import { HEALTH_MONITOR_NAME_REGEX } from '@/constants';

export default function RenameHealthMonitorPage() {
  const { t } = useTranslation('health-monitor/edit-name');
  const { t: tForm } = useTranslation('health-monitor/form');
  const { t: tCommon } = useTranslation('pci-common');

  const navigate = useNavigate();
  const { addSuccess, addError } = useNotifications();

  const { projectId, region, poolId } = useParams();

  const { data: healthMonitor, isPending: isHealthMonitorPending } = useGetHealthMonitor({
    projectId,
    region,
    poolId,
  });

  const [isNameTouched, setIsNameTouched] = useState(false);
  const [editedName, setEditedName] = useState(healthMonitor?.name);

  const { renameHealthMonitor, isPending: isEditionPending } = useRenameHealthMonitor({
    projectId,
    region,
    healthMonitorId: healthMonitor?.id,
    onError(error: ApiError) {
      const requestId = (error?.config?.headers as Record<string, string> | undefined)?.[
        'X-OVH-MANAGER-REQUEST-ID'
      ];
      addError(
        <Trans
          i18nKey="octavia_load_balancer_global_error"
          ns="load-balancer"
          values={{
            message: error?.response?.data?.message || error?.message || null,
            requestId,
          }}
        />,
        true,
      );
      navigate('..');
    },
    onSuccess() {
      addSuccess(
        <Trans
          i18nKey="octavia_load_balancer_health_monitor_detail_overview_edit_name_success"
          ns="health-monitor"
        />,
        true,
      );
      navigate('..');
    },
  });

  const nameError = useMemo(() => {
    if (isNameTouched) {
      if (!editedName) {
        return tCommon('common_field_error_required');
      }
      if (!HEALTH_MONITOR_NAME_REGEX.test(editedName)) {
        return tCommon('common_field_error_pattern');
      }
    }
    return '';
  }, [editedName, isNameTouched]);

  return (
    <PciModal
      title={t('octavia_load_balancer_health_monitor_detail_overview_edit_name_title')}
      onConfirm={() => renameHealthMonitor(editedName)}
      onClose={() => navigate('..')}
      onCancel={() => navigate('..')}
      isPending={isEditionPending || isHealthMonitorPending}
      submitText={t('octavia_load_balancer_health_monitor_detail_overview_edit_name_confirm')}
      cancelText={t('octavia_load_balancer_health_monitor_detail_overview_edit_name_cancel')}
      isDisabled={!!nameError}
    >
      <OsdsFormField className="my-8">
        <LabelComponent
          text={t('octavia_load_balancer_health_monitor_detail_overview_edit_name_label')}
          hasError={!!nameError}
        />

        <OsdsInput
          name="name"
          type={ODS_INPUT_TYPE.text}
          value={editedName}
          error={!!nameError}
          onOdsValueChange={(event) => setEditedName(event.detail.value)}
          onKeyDown={() => setIsNameTouched(true)}
        />

        <div slot="helper">
          <OsdsText className="block" color={ODS_THEME_COLOR_INTENT.error}>
            {nameError}
          </OsdsText>
          <OsdsText color={nameError ? ODS_THEME_COLOR_INTENT.error : ODS_THEME_COLOR_INTENT.text}>
            {tForm('octavia_load_balancer_health_monitor_form_name_help')}
          </OsdsText>
        </div>
      </OsdsFormField>
    </PciModal>
  );
}
