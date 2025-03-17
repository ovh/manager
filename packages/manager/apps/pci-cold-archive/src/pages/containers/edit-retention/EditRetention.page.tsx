import { ApiError } from '@ovh-ux/manager-core-api';
import { PciModal } from '@ovh-ux/manager-pci-common';
import {
  OdsFormField,
  OdsMessage,
  OdsQuantity,
  OdsText,
} from '@ovhcloud/ods-components/react';

import { add } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetArchiveByName, useStartArchive } from '@/api/hooks/useArchive';
import LabelComponent from '@/components/Label.component';
import { useFormattedDate } from '@/hooks/useFormattedDate';
import { useNotifications } from '@/hooks/useNotifications';
import { useTracking } from '@/hooks/useTracking';
import { COLD_ARCHIVE_TRACKING } from '@/tracking.constants';

const MAX_RETENTION_DAYS = 4500;

export default function EditRetentionPage() {
  const { t } = useTranslation(['containers/edit-retention', 'pci-common']);

  const { addSuccessMessage, addErrorMessage } = useNotifications({
    ns: 'containers/edit-retention',
  });

  const { projectId, archiveName } = useParams();

  const archive = useGetArchiveByName(projectId, archiveName);

  const [lockedUntilDays, setLockedUntilDays] = useState(1);

  const [newRetentionDate, setNewRetentionDate] = useState(new Date());

  useEffect(() => {
    if (lockedUntilDays && lockedUntilDays < MAX_RETENTION_DAYS) {
      setNewRetentionDate(
        add(new Date(), {
          days: lockedUntilDays,
        }),
      );
    }
  }, [lockedUntilDays]);

  const formattedRetentionDate = useFormattedDate(
    newRetentionDate.toString(),
    'P',
  );

  const navigate = useNavigate();
  const goBack = () => navigate('..');

  const {
    trackConfirmAction,
    trackCancelAction,
    trackSuccessPage,
    trackErrorPage,
  } = useTracking(
    `${COLD_ARCHIVE_TRACKING.CONTAINERS.MAIN}::${COLD_ARCHIVE_TRACKING.CONTAINERS.EDIT_RETENTION}`,
  );

  const { startArchive, isPending: isPendingStartArchive } = useStartArchive({
    projectId,
    onError: (error: ApiError) => {
      addErrorMessage({
        i18nKey:
          'pci_projects_project_storages_cold_archive_containers_container_edit_retention_error_message',
        values: { containerName: archiveName },
        error,
      });

      trackErrorPage();
      goBack();
    },
    onSuccess() {
      addSuccessMessage({
        i18nKey:
          'pci_projects_project_storages_cold_archive_containers_container_edit_retention_success_message',
        values: { containerName: archiveName },
      });

      trackSuccessPage();
      goBack();
    },
  });

  const onConfirm = () => {
    trackConfirmAction();
    startArchive({ name: archiveName, lockedUntilDays });
  };

  const onCancel = () => {
    trackCancelAction();
    goBack();
  };

  const onClose = onCancel;

  const hasWarning = newRetentionDate < new Date(archive?.lockedUntil);
  const errorMessage = useMemo(() => {
    if (!RegExp(/^\d*$/).test(`${lockedUntilDays}`)) {
      return t('common_field_error_number', { ns: 'pci-common' });
    }
    if (lockedUntilDays < 1) {
      return t('common_field_error_min', { min: 1, ns: 'pci-common' });
    }
    if (lockedUntilDays > MAX_RETENTION_DAYS) {
      return t('common_field_error_max', {
        max: MAX_RETENTION_DAYS,
        ns: 'pci-common',
      });
    }
    if (hasWarning) {
      return t(
        'pci_projects_project_storages_cold_archive_containers_container_edit_retention_retention_wartning_help',
      );
    }
    return null;
  }, [lockedUntilDays, hasWarning]);

  const isPending = !archive || isPendingStartArchive;
  const isDisabled = isPending || !!errorMessage || !lockedUntilDays;

  return (
    <PciModal
      title={t(
        'pci_projects_project_storages_cold_archive_containers_container_edit_retention_title',
      )}
      isDisabled={isDisabled}
      isPending={isPending}
      onConfirm={onConfirm}
      onCancel={onCancel}
      onClose={onClose}
      submitText={t(
        'pci_projects_project_storages_cold_archive_containers_container_edit_retention_submit_label',
      )}
      cancelText={t(
        'pci_projects_project_storages_cold_archive_containers_container_edit_retention_cancel_label',
      )}
    >
      <OdsText preset="paragraph">
        <span
          dangerouslySetInnerHTML={{
            __html: t(
              'pci_projects_project_storages_cold_archive_containers_container_edit_retention_description',
              { containerName: `<strong>${archiveName}</strong>` },
            ),
          }}
        ></span>
      </OdsText>
      <OdsText preset="paragraph" className="mt-4">
        {t(
          'pci_projects_project_storages_cold_archive_containers_container_edit_retention_description_2',
        )}
      </OdsText>
      <OdsFormField className="mt-4" error={errorMessage}>
        <LabelComponent
          text={t(
            'pci_projects_project_storages_cold_archive_containers_container_edit_retention_retention_days',
          )}
        />
        <OdsQuantity
          className="block"
          min={1}
          max={MAX_RETENTION_DAYS}
          value={lockedUntilDays}
          name="lockedUntilDays"
          hasError={!!errorMessage}
          onOdsChange={(event) => setLockedUntilDays(event.detail.value)}
        />
      </OdsFormField>
      {!hasWarning && (
        <OdsMessage className="mt-6" color="warning" isDismissible={false}>
          <div>
            <span
              className="block"
              dangerouslySetInnerHTML={{
                __html: t(
                  'pci_projects_project_storages_cold_archive_containers_container_edit_retention_retention_help',
                  {
                    date: formattedRetentionDate,
                  },
                ),
              }}
            ></span>
            <span className="block mt-2">
              {t(
                'pci_projects_project_storages_cold_archive_containers_container_edit_retention_retention_help_2',
              )}
            </span>
          </div>
        </OdsMessage>
      )}
    </PciModal>
  );
}
