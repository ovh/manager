import { FC, useCallback } from 'react';
import { Subtitle, useNotifications } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import EditableText from '@/components/input/editableContent/EditableContent.component';
import { useUpdateInstanceName } from '@/data/hooks/instance/useInstance';
import { useProjectId } from '@/hooks/project/useProjectId';
import { updateDashboardCache } from '../hooks/useDashboard';
import { TInstanceDashboardViewModel } from '../view-models/selectInstanceDashboard';

type TInstanceNameProps = {
  instance: NonNullable<TInstanceDashboardViewModel>;
  region: string;
};

const InstanceName: FC<TInstanceNameProps> = ({ instance, region }) => {
  const { t } = useTranslation('dashboard');
  const { addError } = useNotifications();
  const projectId = useProjectId();

  const handleSuccessUpdate = useCallback(
    (value: string) => {
      updateDashboardCache({
        projectId,
        instanceId: instance.id,
        region,
        payload: { name: value },
      });
    },
    [instance.id, projectId],
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

  return (
    <Subtitle className={clsx(isPending ? 'opacity-25' : 'opacity-100')}>
      {isPending ? (
        variables.instanceName
      ) : (
        <>
          {instance.isEditEnabled ? (
            <EditableText
              defaultValue={instance.name}
              onSubmit={(instanceName) => editInstanceName({ instanceName })}
            />
          ) : (
            instance.name
          )}
        </>
      )}
    </Subtitle>
  );
};

export default InstanceName;
