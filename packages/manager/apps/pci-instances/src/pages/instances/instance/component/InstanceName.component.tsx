import { FC } from 'react';
import { Subtitle, useNotifications } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import EditableText from '@/components/editableText/EditableText.component';
import { useEditInstanceName } from '@/data/hooks/instance/useInstance';
import { TInstanceDto } from '@/types/instance/api.type';

const InstanceName: FC<{ instance: TInstanceDto }> = ({ instance }) => {
  const { t } = useTranslation('dashboard');
  const { addError } = useNotifications();
  const { isPending, variables, mutate } = useEditInstanceName(instance.id, {
    onError: () =>
      addError(t('pci_instances_dashboard_edit_name_error_message'), true),
  });

  return (
    <Subtitle>
      {isPending && variables.instanceName}
      {!isPending && (
        <>
          {instance.status !== 'ERROR' ? (
            <EditableText
              defaultValue={instance.name}
              handleValidate={(instanceName) => mutate({ instanceName })}
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
