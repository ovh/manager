import { FC, useCallback, useState } from 'react';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { useQueryClient } from '@tanstack/react-query';
import { Button, Icon, Text } from '@ovhcloud/ods-react';
import { useUpdateInstanceName } from '@/data/hooks/instance/useInstance';
import { useProjectId } from '@/hooks/project/useProjectId';
import { TInstanceDashboardViewModel } from '../view-models/selectInstanceDashboard';
import InputCancellable from '@/components/input/InputCancellable.component';
import { TPartialInstance } from '@/types/instance/entity.type';
import { updateAllInstancesFromCache } from '@/adapters/tanstack-query/store/instances/updaters';

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
      const newInstance: TPartialInstance = {
        id: instance.id,
        name: newInstanceName,
      };

      updateAllInstancesFromCache(queryClient, {
        projectId,
        instance: newInstance,
        region: instance.region.name,
      });
    },
    [instance.id, projectId, queryClient, instance.region.name],
  );

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

  const handleCancel = () => {
    setInstanceName(instance.name);
    closeEdit();
  };

  const handleSubmit = () => {
    editInstanceName({ instanceName });
    closeEdit();
  };

  return (
    <div className="flex items-center min-w-96">
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
    </div>
  );
};

export default InstanceName;
