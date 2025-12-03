import { useEffect, useRef, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { Translation, useTranslation } from 'react-i18next';

import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_SPINNER_SIZE, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import {
  OsdsModal,
  OsdsSelect,
  OsdsSelectOption,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';

import { useParam } from '@ovh-ux/manager-pci-common';
import { useNotifications } from '@ovh-ux/manager-react-components';

import { useAttachableInstances } from '@/api/hooks/useInstance';
import { useAttachVolume, useVolume } from '@/api/hooks/useVolume';
import { TAttachableInstance } from '@/api/select/instances';
import { ButtonLink } from '@/components/button-link/ButtonLink';
import { Button } from '@/components/button/Button';
import { useTrackBanner } from '@/hooks/useTrackBanner';

import NoInstanceWarningMessage from './NoInstanceAvailableWarningMessage';

export default function AttachStorage() {
  const navigate = useNavigate();
  const { projectId, volumeId } = useParam('projectId', 'volumeId');
  const { t } = useTranslation('attach');
  const { addError, addSuccess } = useNotifications();
  const { data: volume, isPending: isVolumePending } = useVolume(projectId, volumeId);
  const { data: instances, isPending: isInstancesPending } = useAttachableInstances(
    projectId,
    volumeId,
  );

  const [selectedInstance, setSelectedInstance] = useState<TAttachableInstance | null>(null);
  const onClose = () => navigate('..');

  const selectRef = useRef<HTMLOsdsSelectElement>(null);

  /**
   * Workaround to solve ods select width on mobile
   * TODO: solve on ods side
   */
  useEffect(() => {
    if (selectRef.current && !selectRef.current.shadowRoot?.querySelector('style')) {
      const style = document.createElement('style');
      style.innerHTML = '.ocdk-surface--open {max-width: 100%;}';
      selectRef.current.shadowRoot?.appendChild(style);
    }
  }, [selectRef.current]);

  // select first instance available after loading
  useEffect(() => {
    const firstInstance = instances?.[0];
    if (!firstInstance) return;

    setSelectedInstance((instance) => instance ?? firstInstance);
  }, [instances]);

  const actionValues = [volume?.region];

  const onTrackingBannerError = useTrackBanner({ type: 'error' }, (err) => {
    addError(
      <Translation ns="attach">
        {(_t) =>
          _t('pci_projects_project_storages_blocks_block_attach_error_attach', {
            volume: volume?.name,
            message: err instanceof Error ? err.message : undefined,
          })
        }
      </Translation>,
      true,
    );
    onClose();
  });

  const onTrackingBannerSuccess = useTrackBanner({ type: 'success' }, () => {
    addSuccess(
      <Translation ns="attach">
        {(_t) =>
          _t('pci_projects_project_storages_blocks_block_attach_success_message', {
            volume: volume?.name,
            volumeId: volume?.id,
            type: volume?.type,
            instance: selectedInstance?.name,
            instanceId: selectedInstance?.id,
          })
        }
      </Translation>,
      true,
    );
    onClose();
  });

  const { attachVolume, isPending: isAttachPending } = useAttachVolume({
    projectId,
    volumeId,
    instanceId: selectedInstance?.id ?? '',
    onError: onTrackingBannerError,
    onSuccess: onTrackingBannerSuccess,
  });

  const isPending = isInstancesPending || isVolumePending || isAttachPending;
  const canAttach = !isPending && selectedInstance?.id;

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
        {volume && volume?.maxAttachedInstances > 1 && (
          <OsdsText
            className="mt-5 whitespace-pre-wrap"
            size={ODS_TEXT_SIZE._400}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {t('pci_projects_project_storages_blocks_block_attach_multi_banner', {
              count: volume.maxAttachedInstances,
            })}
          </OsdsText>
        )}
        {!isPending && instances && instances?.length > 0 && (
          <div>
            <OsdsSelect
              value={selectedInstance?.id}
              ref={selectRef}
              inline
              className="mt-5 w-[100%]"
              onOdsValueChange={(event) => {
                const instance = instances.find((instance) => instance.id === event.detail.value);
                if (!instance) return;
                setSelectedInstance(instance);
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
      <ButtonLink
        slot="actions"
        color="primary"
        variant="ghost"
        to=".."
        actionName="cancel"
        actionValues={actionValues}
      >
        {t('pci_projects_project_storages_blocks_block_attach_cancel_label')}
      </ButtonLink>
      <Button
        slot="actions"
        color="primary"
        onClick={attachVolume}
        disabled={!canAttach}
        actionName="confirm"
        actionValues={actionValues}
      >
        {t('pci_projects_project_storages_blocks_block_attach_submit_label')}
      </Button>
    </OsdsModal>
  );
}
