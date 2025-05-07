import { FC } from 'react';
import { Subtitle, useNotifications } from '@ovh-ux/manager-react-components';
import { OsdsSkeleton } from '@ovhcloud/ods-components/react';
import { ODS_SKELETON_SIZE } from '@ovhcloud/ods-components';
// import { TInstance } from '@/types/instance/entity.type'; // TODO: what difference with Dto
import { useTranslation } from 'react-i18next';
import EditableText from '@/components/editableText/EditableText.component';
import { useEditInstanceName } from '@/data/hooks/instance/useInstance';
import { TInstanceDto } from '@/types/instance/api.type';

const InstanceName: FC<{ instance?: TInstanceDto; isLoading?: boolean }> = ({
  instance,
  isLoading,
}) => {
  const { t } = useTranslation(['dashboard']);
  const { addError } = useNotifications();
  const { isPending, variables, mutate } = useEditInstanceName(
    instance?.id ?? '',
    {
      onError: () =>
        addError(t('pci_instances_dashboard_edit_name_error_message'), true),
    },
  );

  if (isLoading) {
    return <OsdsSkeleton size={ODS_SKELETON_SIZE.sm} inline />;
  }

  return (
    <Subtitle>
      {isPending && variables.instanceName}
      {!isPending && (
        <>
          {instance && instance.status !== 'ERROR' ? (
            <EditableText
              value={instance.name}
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
