import { FC, useCallback, useState } from 'react';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { useUpdateInstanceName } from '@/data/hooks/instance/useInstance';
import { useProjectId } from '@/hooks/project/useProjectId';
import { TInstanceDashboardViewModel } from '../view-models/selectInstanceDashboard';
import { updateInstancesFromCache } from '@/data/hooks/instance/useInstances';
import { useQueryClient } from '@tanstack/react-query';
import { Button, Icon, Text } from '@ovhcloud/ods-react';
import InputCancellable from '@/components/input/InputCancellable.component';

type TInstanceNameProps = {
  instance: NonNullable<TInstanceDashboardViewModel>;
};

const InstanceName: FC<TInstanceNameProps> = ({ instance }) => {
  const { t } = useTranslation('dashboard');
  const queryClient = useQueryClient();
  const { addError } = useNotifications();
  const projectId = useProjectId();
  const [isEditing, setIsEditing] = useState(false);
  const [instanceName, setInstanceName] = useState(instance.name);

  const closeEdit = () => setIsEditing(!isEditing);

  const handleSuccessUpdate = useCallback(
    (newInstanceName: string) => {
      updateInstancesFromCache(queryClient, {
        projectId,
        instance: {
          id: instance.id,
          name: newInstanceName,
        },
      });
    },
    [instance.id, projectId, queryClient],
  );

  const handleCancel = () => {
    setInstanceName(instance.name);
    closeEdit();
  };

  const handleSubmit = () => {
    editInstanceName({ instanceName });
    closeEdit();
  };

  const {
    isPending,
    variables,
    mutate: editInstanceName,
  } = useUpdateInstanceName({
    projectId,
    instanceId: instance.id,
    callbacks: {
      onSuccess: (_data, { instanceName }) => handleSuccessUpdate(instanceName),
      onError: () =>
        addError(t('pci_instances_dashboard_edit_name_error_message'), true),
    },
  });

  return (
    <header className="flex items-center">
      {isEditing ? (
        <InputCancellable
          value={instanceName}
          onChange={({ target }) => setInstanceName(target.value)}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
          className="h-[2.5em]"
        />
      ) : (
        <Text
          preset="heading-3"
          className={clsx(
            `whitespace-nowrap overflow-hidden text-ellipsis max-w-md ${
              isPending ? 'opacity-25' : 'opacity-100'
            }`,
          )}
        >
          {isPending ? variables.instanceName : instance.name}
        </Text>
      )}
      {instance.isEditEnabled && !isEditing && (
        <Button
          variant="outline"
          size="sm"
          aria-label="Edit"
          onClick={closeEdit}
          className="ml-4"
        >
          <Icon name="pen" />
        </Button>
      )}
    </header>
  );
};

export default InstanceName;
