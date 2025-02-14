import {
  PciModal,
  useProductRegionsAvailability,
} from '@ovh-ux/manager-pci-common';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { ApiError } from '@ovh-ux/manager-core-api';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  OdsFormField,
  OdsMessage,
  OdsQuantity,
  OdsText,
} from '@ovhcloud/ods-components/react';

import { useContext, useState } from 'react';
import { Translation, useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { add } from 'date-fns';
import { useArchives, useStartArchiveContainer } from '@/api/hooks/useArchive';
import LabelComponent from '@/components/Label.component';
import { useFormattedDate } from '@/hooks/useFormattedDate';
import { COLD_ARCHIVE_TRACKING } from '@/constants';
import useTracking from '@/hooks/useTracking';

export default function EditRetentionPage() {
  const { t } = useTranslation('containers/edit-retention');

  const { addSuccess, addError } = useNotifications();
  const { ovhSubsidiary } = useContext(ShellContext).environment.getUser();
  const { projectId, archiveName } = useParams();
  const { data: allArchives, isPending: isPendingArchive } = useArchives(
    projectId,
  );
  const archive = allArchives?.find((a) => a.name === archiveName);
  const [lockedUntilDays, setLockedUntilDays] = useState(1);
  const newRetentionDate = add(new Date(), {
    days: lockedUntilDays,
  });
  const formattedRetentionDate = useFormattedDate(
    newRetentionDate.toString(),
    'P',
  );
  const hasWarning = newRetentionDate < new Date(archive?.lockedUntil);

  const navigate = useNavigate();
  const goBack = () => navigate('..');

  const {
    trackConfirmAction,
    trackCancelAction,
    trackSuccessPage,
    trackErrorPage,
  } = useTracking(COLD_ARCHIVE_TRACKING.CONTAINERS.EDIT_RETENTION);

  const {
    data: regions,
    isPending: isRegionsPending,
  } = useProductRegionsAvailability(
    ovhSubsidiary,
    'coldarchive.archive.hour.consumption',
  );

  const {
    startArchiveContainer,
    isPending: isPendingStartArchive,
  } = useStartArchiveContainer({
    projectId,
    region: regions?.[0],
    containerName: archiveName,
    lockedUntilDays,
    onError(error: ApiError) {
      addError(
        <Translation ns="containers/edit-retention">
          {(_t) =>
            _t(
              'pci_projects_project_storages_cold_archive_containers_container_edit_retention_error_message',
              {
                containerName: archiveName,
                message:
                  error?.response?.data?.message || error?.message || null,
              },
            )
          }
        </Translation>,
        true,
      );

      trackErrorPage();
      goBack();
    },
    onSuccess() {
      addSuccess(
        <Translation ns="containers/edit-retention">
          {(_t) =>
            _t(
              'pci_projects_project_storages_cold_archive_containers_container_edit_retention_success_message',
              {
                containerName: archiveName,
              },
            )
          }
        </Translation>,
        true,
      );

      trackSuccessPage();
      goBack();
    },
  });

  const onConfirm = () => {
    trackConfirmAction();
    startArchiveContainer();
  };

  const onCancel = () => {
    trackCancelAction();
    goBack();
  };

  const onClose = onCancel;

  const isPending =
    isPendingArchive || isPendingStartArchive || isRegionsPending;

  const isDisabled = isPending || hasWarning || !lockedUntilDays;

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
      <OdsFormField
        className="mt-4"
        error={
          hasWarning
            ? t(
                'pci_projects_project_storages_cold_archive_containers_container_edit_retention_retention_wartning_help',
              )
            : ''
        }
      >
        <LabelComponent
          text={t(
            'pci_projects_project_storages_cold_archive_containers_container_edit_retention_retention_days',
          )}
        />
        <OdsQuantity
          className="block"
          min={1}
          max={4500}
          value={lockedUntilDays}
          name="lockedUntilDays"
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
