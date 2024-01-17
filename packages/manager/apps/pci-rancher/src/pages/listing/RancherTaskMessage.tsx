import React from 'react';
import { useTranslation } from 'react-i18next';
import { OsdsMessage, OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_MESSAGE_TYPE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { RancherTask, RancherTaskType } from '@/api/api.type';

const RancherTaskMessage = ({ tasks }: { tasks: RancherTask[] }) => {
  const { t } = useTranslation('pci-rancher/listing');
  const tasksMessage = tasks
    .map((task) => {
      const isUpdateTask = task?.type === RancherTaskType.RANCHER_UPDATE;
      return {
        id: task?.id,
        type: isUpdateTask ? ODS_MESSAGE_TYPE.info : ODS_MESSAGE_TYPE.warning,
        message: isUpdateTask
          ? t('rancherStatusUpdating')
          : t('rancherStatusError'),
      };
    })
    .filter((task) => task !== null);

  return (
    <div>
      {tasksMessage.map((task) => (
        <OsdsMessage id={task.id} type={task.type} className="my-4 p-3">
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.text}
            className="inline-block"
          >
            {task.message}
          </OsdsText>
        </OsdsMessage>
      ))}
    </div>
  );
};

export default RancherTaskMessage;
