import {
  OsdsButton,
  OsdsModal,
  OsdsSelect,
  OsdsSelectOption,
  OsdsSpinner,
} from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_VARIANT, ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useEffect, useRef, useState } from 'react';
import { Translation, useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { Instance } from '@/api/data/instance';
import { useInstances } from '@/api/hooks/useInstance';
import { useAttachVolume, useVolume } from '@/api/hooks/useVolume';
import NoInstanceWarningMessage from './NoInstanceAvailableWarningMessage';

export default function AttachStorage() {
  const navigate = useNavigate();
  const { projectId, volumeId } = useParams();
  const { t } = useTranslation('attach');
  const { addError, addSuccess } = useNotifications();
  const { data: volume } = useVolume(projectId, volumeId);
  const { data: instances, isPending: isInstancesPending } = useInstances(
    projectId,
    volume?.region,
  );
  const [selectedInstance, setSelectedInstance] = useState<Instance>(null);
  const onClose = () => navigate('..');

  const selectRef = useRef(null);

  /**
   * Workaround to solve ods select width on mobile
   * TODO: solve on ods side
   */
  useEffect(() => {
    if (
      selectRef.current &&
      !selectRef.current.shadowRoot.querySelector('style')
    ) {
      const style = document.createElement('style');
      style.innerHTML = '.ocdk-surface--open {max-width: 100%;}';
      selectRef.current.shadowRoot.appendChild(style);
    }
  }, [selectRef.current]);

  // select first instance available after loading
  useEffect(() => {
    setSelectedInstance((instance) => instance || instances?.[0]);
  }, [setSelectedInstance, instances]);

  const { attachVolume, isPending: isAttachPending } = useAttachVolume({
    projectId,
    volumeId,
    instanceId: selectedInstance?.id,
    onError(err: Error) {
      addError(
        <Translation ns="attach">
          {(_t) =>
            _t(
              'pci_projects_project_storages_blocks_block_attach_error_attach',
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
        <Translation ns="attach">
          {(_t) =>
            _t(
              'pci_projects_project_storages_blocks_block_attach_success_message',
              {
                volume: volume?.name,
                volumeId: volume.id,
                type: volume.type,
                instance: selectedInstance?.name,
                instanceId: selectedInstance?.id,
              },
            )
          }
        </Translation>,
        true,
      );
      onClose();
    },
  });

  const isPending = isInstancesPending || isAttachPending;
  const canAttach = !isPending && selectedInstance?.id;

  // redirect to listing if volume is already attached
  useEffect(() => {
    if (!isPending && volume?.attachedTo?.length > 0) {
      navigate(`/pci/projects/${projectId}/storages/blocks`);
    }
  }, [navigate, projectId, volume, isPending]);

  return (
    <OsdsModal
      headline={t('pci_projects_project_storages_blocks_block_attach_title')}
      onOdsModalClose={onClose}
    >
      <slot name="content">
        {isPending && (
          <OsdsSpinner
            inline
            size={ODS_SPINNER_SIZE.md}
            className="block text-center"
            data-testid="attach-storage-spinner"
          />
        )}
        {!isPending && instances?.length > 0 && (
          <div>
            <OsdsSelect
              value={selectedInstance?.id}
              ref={selectRef}
              inline
              className="mt-5 w-[100%]"
              onOdsValueChange={(event) => {
                setSelectedInstance(
                  instances.find(
                    (instance) => instance.id === event.detail.value,
                  ),
                );
              }}
            >
              {instances.map(({ id, name }) => (
                <OsdsSelectOption key={id} value={id}>
                  {name}
                </OsdsSelectOption>
              ))}
            </OsdsSelect>
          </div>
        )}
        {!isPending && !instances?.length && <NoInstanceWarningMessage />}
      </slot>
      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        variant={ODS_BUTTON_VARIANT.ghost}
        onClick={onClose}
      >
        {t('pci_projects_project_storages_blocks_block_attach_cancel_label')}
      </OsdsButton>
      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        onClick={attachVolume}
        {...(canAttach ? {} : { disabled: true })}
      >
        {t('pci_projects_project_storages_blocks_block_attach_submit_label')}
      </OsdsButton>
    </OsdsModal>
  );
}
