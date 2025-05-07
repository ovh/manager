import { FC, useCallback } from 'react';
import { Subtitle, useNotifications } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import EditableText from '@/components/editableText/EditableText.component';
import {
  updateInstanceFromCache,
  useEditInstanceName,
} from '@/data/hooks/instance/useInstance';
import { TInstance } from '@/types/instance/entity.type';
import { useProjectId } from '@/hooks/project/useProjectId';

const InstanceName: FC<{ instance: TInstance }> = ({ instance }) => {
  const { t } = useTranslation('dashboard');
  const { addError } = useNotifications();
  const projectId = useProjectId();

  const handleSuccessUpdate = useCallback(
    (name: string) => {
      updateInstanceFromCache({
        projectId,
        instanceId: instance.id,
        payload: { name },
      });
    },
    [instance.id, projectId],
  );

  const {
    isPending,
    variables,
    mutate: editInstanceName,
  } = useEditInstanceName({
    projectId,
    instanceId: instance.id,
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
          {instance.status.label !== 'ERROR' ? (
            <EditableText
              defaultValue={instance.name}
              handleValidate={(instanceName) =>
                editInstanceName({ instanceName })
              }
            />
          ) : (
            instance?.name
          )}
        </>
      )}
    </Subtitle>
  );
};

export default InstanceName;
