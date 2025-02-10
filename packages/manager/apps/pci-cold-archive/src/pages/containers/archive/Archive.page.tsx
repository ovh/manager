import {
  PciModal,
  useProductRegionsAvailability,
} from '@ovh-ux/manager-pci-common';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  OdsFormField,
  OdsMessage,
  OdsQuantity,
  OdsRadio,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { useContext, useMemo, useState } from 'react';
import { Translation, useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { add } from 'date-fns';
import LabelComponent from '@/components/Label.component';
import { COLD_ARCHIVE_TRACKING } from '@/constants';
import { useFormattedDate } from '@/hooks/useFormattedDate';
import { useStartArchiveContainer } from '@/api/hooks/useArchive';

export default function ArchivePage() {
  const { addSuccess, addError } = useNotifications();
  const navigate = useNavigate();
  const { projectId, archiveName } = useParams();
  const { t } = useTranslation(['containers/archive', 'pci-common']);
  const { ovhSubsidiary } = useContext(ShellContext).environment.getUser();
  const { tracking } = useContext(ShellContext).shell;

  const [lockedUntilDays, setLockedUntilDays] = useState(1);
  const [hasRetention, setHasRetention] = useState(true);
  const retentionDate = useFormattedDate(
    add(new Date(), { days: lockedUntilDays }).toString(),
    'P',
  );

  const trackStartArchiveModalClick = (action: string) => {
    tracking?.trackClick({
      name: `${COLD_ARCHIVE_TRACKING.CONTAINERS.MAIN}::${COLD_ARCHIVE_TRACKING.CONTAINERS.ARCHIVE}::${action}`,
      type: 'action',
    });
  };
  const trackStartArchiveModalPage = (action: string) => {
    tracking?.trackPage({
      name: `${COLD_ARCHIVE_TRACKING.CONTAINERS.MAIN}::${COLD_ARCHIVE_TRACKING.CONTAINERS.ARCHIVE}_${action}`,
      type: 'navigation',
    });
  };

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
    ...(hasRetention && { lockedUntilDays }),
    onError(error: ApiError) {
      addError(
        <Translation ns="containers/archive">
          {(_t) =>
            _t(
              'pci_projects_project_storages_cold_archive_containers_container_archive_error_message',
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
      trackStartArchiveModalPage(COLD_ARCHIVE_TRACKING.STATUS.ERROR);
      navigate('..');
    },
    onSuccess() {
      addSuccess(
        <Translation ns="containers/archive">
          {(_t) =>
            _t(
              'pci_projects_project_storages_cold_archive_containers_container_archive_success_message',
              {
                containerName: archiveName,
              },
            )
          }
        </Translation>,
        true,
      );
      trackStartArchiveModalPage(COLD_ARCHIVE_TRACKING.STATUS.SUCCESS);
      navigate('..');
    },
  });

  const onConfirm = () => {
    trackStartArchiveModalClick(COLD_ARCHIVE_TRACKING.ACTIONS.CONFIRM);
    startArchiveContainer();
  };
  const onCancel = () => {
    trackStartArchiveModalClick(COLD_ARCHIVE_TRACKING.ACTIONS.CANCEL);
    navigate('..');
  };
  const onClose = () => onCancel();
  const isPending = isRegionsPending || isPendingStartArchive;
  const error = {
    min: lockedUntilDays < 1,
    max: lockedUntilDays > 365,
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
      return t('pci-common:common_field_error_max', { max: 365 });
    }
    return '';
  }, [lockedUntilDays, error.min, error.max, error.nan]);

  return (
    <PciModal
      title={t(
        'pci_projects_project_storages_cold_archive_containers_container_archive_title',
      )}
      isDisabled={isPending || (hasRetention && !lockedUntilDays)}
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
              max={365}
              value={lockedUntilDays}
              name="lockedUntilDays"
              className="mt-2"
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
