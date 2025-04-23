import {
  OsdsButton,
  OsdsModal,
  OsdsSelect,
  OsdsSelectOption,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { ODS_BUTTON_VARIANT, ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { useEffect, useMemo, useState } from 'react';
import { Translation, useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { useDetachVolume, useVolume } from '@/api/hooks/useVolume';
import { useAttachedInstances } from '@/api/hooks/useInstance';
import { TAttachedInstance } from '@/api/select/instances';

export default function DetachStorage() {
  const navigate = useNavigate();
  const { projectId, volumeId } = useParams();
  const { t } = useTranslation('detach');
  const { addError, addSuccess } = useNotifications();
  const { data: volume } = useVolume(projectId, volumeId);
  const onClose = () => navigate('..');

  const {
    data: instances,
    isPending: isInstancesPending,
  } = useAttachedInstances(projectId, volumeId);

  const [selectedInstanceId, setSelectedInstanceId] = useState<
    TAttachedInstance['id'] | null
  >(null);

  const selectedInstance = useMemo(() => {
    if (!!selectedInstanceId && !!instances)
      return instances.find(({ id }) => id === selectedInstanceId)!;
    return null;
  }, [selectedInstanceId, instances]);

  const { detachVolume, isPending: isDetachPending } = useDetachVolume({
    projectId,
    volumeId,
    instanceId: selectedInstanceId,
    onError(err: Error) {
      addError(
        <Translation ns="detach">
          {(_t) =>
            _t(
              'pci_projects_project_storages_blocks_block_detach_error_detach',
              {
                volume: volume?.name,
                message: err?.message,
              },
            )
          }
        </Translation>,
        true,
      );
      onClose();
    },
    onSuccess() {
      addSuccess(
        <Translation ns="detach">
          {(_t) =>
            _t(
              'pci_projects_project_storages_blocks_block_detach_success_message',
              {
                volume: volume?.name,
              },
            )
          }
        </Translation>,
        true,
      );
      onClose();
    },
  });

  const isPending = isInstancesPending || isDetachPending;
  const canDetach = !isPending && !!selectedInstanceId;

  // redirect to listing if volume is not attached
  useEffect(() => {
    if (!isPending && !!volume) {
      if (volume.attachedTo.length === 0) {
        navigate(`/pci/projects/${projectId}/storages/blocks`);
      } else if (volume.attachedTo.length === 1) {
        setSelectedInstanceId(volume.attachedTo[0]);
      }
    }
  }, [navigate, projectId, volume, isPending]);

  return (
    <OsdsModal
      headline={t('pci_projects_project_storages_blocks_block_detach_title')}
      onOdsModalClose={onClose}
    >
      <slot name="content">
        {isPending && (
          <OsdsSpinner
            inline
            size={ODS_SPINNER_SIZE.md}
            className="block text-center"
            data-testid="detachStorage-spinner"
          />
        )}
        {instances?.length > 1 && (
          <div>
            <OsdsSelect
              value={selectedInstanceId}
              inline
              className="mt-5 w-full"
              onOdsValueChange={(event) => {
                setSelectedInstanceId(event.detail.value as string);
              }}
              data-testid="detachStorage-select-instance"
            >
              {instances.map(({ id, name }) => (
                <OsdsSelectOption key={id} value={id}>
                  {name}
                </OsdsSelectOption>
              ))}
            </OsdsSelect>
          </div>
        )}
        {!!selectedInstance && (
          <div className="mt-5">
            <OsdsText
              level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
              size={ODS_THEME_TYPOGRAPHY_SIZE._400}
              color={ODS_THEME_COLOR_INTENT.text}
            >
              {t(
                'pci_projects_project_storages_blocks_block_detach_detachvolume',
                {
                  volume: volume.name,
                  instance: selectedInstance.name,
                },
              )}
            </OsdsText>
          </div>
        )}
      </slot>
      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        variant={ODS_BUTTON_VARIANT.ghost}
        onClick={onClose}
      >
        {t('pci_projects_project_storages_blocks_block_detach_cancel_label')}
      </OsdsButton>
      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        onClick={detachVolume}
        {...(canDetach ? {} : { disabled: true })}
      >
        {t('pci_projects_project_storages_blocks_block_detach_submit_label')}
      </OsdsButton>
    </OsdsModal>
  );
}
