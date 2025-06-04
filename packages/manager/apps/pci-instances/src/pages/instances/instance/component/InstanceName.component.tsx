import { FC, useCallback } from 'react';
import { Subtitle, useNotifications } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import EditableText from '@/components/input/editableContent/EditableContent.component';
import {
  updateInstanceCache,
  useEditInstanceName,
} from '@/data/hooks/instance/useInstance';
import { TInstanceStatusState } from '@/types/instance/entity.type';
import { useProjectId } from '@/hooks/project/useProjectId';

const InstanceName: FC<{
  instanceId: string;
  status: TInstanceStatusState;
  name: string;
}> = ({ instanceId, status, name }) => {
  const { t } = useTranslation('dashboard');
  const { addError } = useNotifications();
  const projectId = useProjectId();

  const handleSuccessUpdate = useCallback(
    (value: string) => {
      updateInstanceCache({
        projectId,
        instanceId,
        payload: { name: value },
      });
    },
    [instanceId, projectId],
  );

  const {
    isPending,
    variables,
    mutate: editInstanceName,
  } = useEditInstanceName({
    projectId,
    instanceId,
    callbacks: {
      onSuccess: (_data, { instanceName }) => handleSuccessUpdate(instanceName),
      onError: () =>
        addError(t('pci_instances_dashboard_edit_name_error_message'), true),
    },
  });

  return (
    <Subtitle className={isPending ? 'opacity-25' : 'opacity-100'}>
      {isPending && variables.instanceName}
      {!isPending && (
        <>
          {status !== 'ERROR' ? (
            <EditableText
              defaultValue={name}
              onSubmit={(instanceName) => editInstanceName({ instanceName })}
            />
          ) : (
            name
          )}
        </>
      )}
    </Subtitle>
  );
};

export default InstanceName;
