import {
  OsdsModal,
  OsdsSelect,
  OsdsSelectOption,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { ODS_SPINNER_SIZE, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useEffect, useRef, useState } from 'react';
import { Translation, useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { useAttachableInstances } from '@/api/hooks/useInstance';
import { useAttachVolume, useVolume } from '@/api/hooks/useVolume';
import NoInstanceWarningMessage from './NoInstanceAvailableWarningMessage';
import { TAttachableInstance } from '@/api/select/instances';
import { ButtonLink } from '@/components/button-link/ButtonLink';
import { useTrackBanner } from '@/hooks/useTrackBanner';
import { Button } from '@/components/button/Button';

export default function AttachStorage() {
  const navigate = useNavigate();
  const { projectId, volumeId } = useParams();
  const { t } = useTranslation('attach');
  const { addError, addSuccess } = useNotifications();
  const { data: volume, isPending: isVolumePending } = useVolume(
    projectId,
    volumeId,
  );
  const {
    data: instances,
    isPending: isInstancesPending,
  } = useAttachableInstances(projectId, volumeId);

  const [selectedInstance, setSelectedInstance] = useState<TAttachableInstance>(
    null,
  );
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
    if (!!instances && instances.length)
      setSelectedInstance((instance) => instance ?? instances[0]);
  }, [instances]);

  const actionValues = [volume?.region];

  const onTrackingBannerError = useTrackBanner(
    { type: 'error' },
    (err: Error) => {
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
  );

  const onTrackingBannerSuccess = useTrackBanner({ type: 'success' }, () => {
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
  });

  const { attachVolume, isPending: isAttachPending } = useAttachVolume({
    projectId,
    volumeId,
    instanceId: selectedInstance?.id,
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
        {volume?.maxAttachedInstances > 1 && (
          <OsdsText
            className="mt-5 whitespace-pre-wrap"
            size={ODS_TEXT_SIZE._400}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {t(
              'pci_projects_project_storages_blocks_block_attach_multi_banner',
              { count: volume.maxAttachedInstances },
            )}
          </OsdsText>
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
