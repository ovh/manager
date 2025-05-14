import { Subtitle, useNotifications } from '@ovh-ux/manager-react-components';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useEditInstanceName } from '@/data/hooks/instance/useInstance';
import EditableText from '@/components/editableText/EditableText.component';

import { TInstance } from '@/types/instance/entity.type';

const InstanceName: FC<{ instance: TInstance }> = ({ instance }) => {
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
          {instance.status.label !== 'ERROR' ? (
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
