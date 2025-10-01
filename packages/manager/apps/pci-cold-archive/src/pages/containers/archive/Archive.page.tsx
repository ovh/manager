import { ApiError } from '@ovh-ux/manager-core-api';
import { PciModal } from '@ovh-ux/manager-pci-common';
import {
  OdsFormField,
  OdsMessage,
  OdsQuantity,
  OdsRadio,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { add } from 'date-fns';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { COLD_ARCHIVE_TRACKING } from '@/tracking.constants';
import { useTracking } from '@/hooks/useTracking';
import { useNotifications } from '@/hooks/useNotifications';
import { useFormattedDate } from '@/hooks/useFormattedDate';
import LabelComponent from '@/components/Label.component';
import { useStartArchive } from '@/api/hooks/useArchive';

export default function ArchivePage() {
  const { t } = useTranslation(['containers/archive', 'pci-common']);

  const { addSuccessMessage, addErrorMessage } = useNotifications({
    ns: 'containers/archive',
  });

  const { projectId, archiveName } = useParams();

  const navigate = useNavigate();
  const goBack = () => navigate('..');

  const [lockedUntilDays, setLockedUntilDays] = useState(1);
  const [hasRetention, setHasRetention] = useState(true);

  const retentionDate = useFormattedDate(
    add(new Date(), { days: lockedUntilDays }).toString(),
    'P',
  );

  const {
    trackConfirmAction,
    trackCancelAction,
    trackSuccessPage,
    trackErrorPage,
  } = useTracking(
    `${COLD_ARCHIVE_TRACKING.CONTAINERS.MAIN}::${COLD_ARCHIVE_TRACKING.CONTAINERS.ARCHIVE}`,
  );

  const { startArchive, isPending } = useStartArchive({
    projectId,
    onError: (error: ApiError) => {
      addErrorMessage({
        i18nKey:
          'pci_projects_project_storages_cold_archive_containers_container_archive_error_message',
        error,
        values: {
          containerName: archiveName,
        },
      });

      trackErrorPage();
      goBack();
    },
    onSuccess: () => {
      addSuccessMessage({
        i18nKey:
          'pci_projects_project_storages_cold_archive_containers_container_archive_success_message',
        values: {
          containerName: archiveName,
        },
      });

      trackSuccessPage();
      goBack();
    },
  });

  const onConfirm = () => {
    trackConfirmAction();
    startArchive({
      name: archiveName,
      ...(hasRetention && { lockedUntilDays }),
    });
  };

  const onCancel = () => {
    trackCancelAction();
    goBack();
  };

  const onClose = onCancel;

  const maxDaysRetention = 4500;

  const error = {
    min: lockedUntilDays < 1,
    max: lockedUntilDays > maxDaysRetention,
    nan: !RegExp(/^\d*$/).test(`${lockedUntilDays}`),
  };

  const errorMessage = useMemo(() => {
    if (error.nan) {
      return t('pci-common:common_field_error_number');
    }
    if (error.min) {
      return t('pci-common:common_field_error_min', { min: 1 });
    }
    if (error.max) {
      return t('pci-common:common_field_error_max', { max: maxDaysRetention });
    }
    return '';
  }, [lockedUntilDays, error.min, error.max, error.nan]);

  const isRetentionInvalid =
    hasRetention && (!lockedUntilDays || lockedUntilDays > maxDaysRetention);
  const isDisabled = isPending || isRetentionInvalid;

  return (
    <PciModal
      title={t(
        'pci_projects_project_storages_cold_archive_containers_container_archive_title',
      )}
      isDisabled={isDisabled}
      isPending={isPending}
      onConfirm={onConfirm}
      onCancel={onCancel}
      onClose={onClose}
      submitText={t(
        'pci_projects_project_storages_cold_archive_containers_container_archive_submit_label',
      )}
      cancelText={t(
        'pci_projects_project_storages_cold_archive_containers_container_archive_cancel_label',
      )}
    >
      <OdsText preset="paragraph" className="block">
        <span
          dangerouslySetInnerHTML={{
            __html: t(
              'pci_projects_project_storages_cold_archive_containers_container_archive_description',
              { containerName: `<strong>${archiveName}</strong>` },
            ),
          }}
        ></span>
      </OdsText>
      <OdsText preset="paragraph" className="block">
        {t(
          'pci_projects_project_storages_cold_archive_containers_container_archive_description_2',
        )}
      </OdsText>
      <OdsFormField>
        <div className="flex gap-4">
          <OdsRadio
            name="radio-retention"
            inputId="radio-retention-true"
            isChecked={hasRetention}
            onOdsChange={() => {
              setHasRetention(!hasRetention);
            }}
          />
          <label htmlFor="radio-retention-true">
            <OdsText preset="span">
              {t(
                'pci_projects_project_storages_cold_archive_containers_container_archive_has_retention',
              )}
            </OdsText>
          </label>
        </div>
      </OdsFormField>
      {hasRetention && (
        <div className="mt-4">
          <OdsFormField className="mb-8 block" error={errorMessage}>
            <LabelComponent
              text={t(
                'pci_projects_project_storages_cold_archive_containers_container_archive_retention_days',
              )}
            />
            <OdsQuantity
              min={1}
              max={maxDaysRetention}
              value={lockedUntilDays}
              name="lockedUntilDays"
              className="mt-2 block"
              hasError={!!errorMessage}
              onOdsChange={(event) => setLockedUntilDays(event.detail.value)}
            />
          </OdsFormField>
          <OdsMessage color="warning" className="block" isDismissible={false}>
            <div>
              <span
                className="block"
                dangerouslySetInnerHTML={{
                  __html: t(
                    'pci_projects_project_storages_cold_archive_containers_container_retention_warning',
                    { date: retentionDate },
                  ),
                }}
              ></span>
              <span className="">
                {t(
                  'pci_projects_project_storages_cold_archive_containers_container_retention_warning_2',
                )}
              </span>
            </div>
          </OdsMessage>
        </div>
      )}
      <OdsFormField>
        <div className="flex items-center gap-4 mt-4">
          <OdsRadio
            name="radio-retention"
            inputId="radio-retention-false"
            isChecked={!hasRetention}
            onOdsChange={() => {
              setHasRetention(!hasRetention);
            }}
          />
          <label htmlFor="radio-retention-false">
            <OdsText preset="span">
              {t(
                'pci_projects_project_storages_cold_archive_containers_container_archive_has_no_retention',
              )}
            </OdsText>
          </label>
        </div>
      </OdsFormField>
    </PciModal>
  );
}
