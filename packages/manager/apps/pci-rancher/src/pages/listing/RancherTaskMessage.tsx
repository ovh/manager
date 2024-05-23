import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_MESSAGE_TYPE } from '@ovhcloud/ods-components';
import { OsdsMessage, OsdsText } from '@ovhcloud/ods-components/react';
import React from 'react';
import { useTranslate } from '@/utils/translation';
import { RancherTask, RancherTaskType } from '@/api/api.type';

const RancherTaskMessage = ({ tasks }: { tasks: RancherTask[] }) => {
  const { t } = useTranslate('pci-rancher/listing');
  const tasksMessage = tasks
    .filter((task) => task?.type === RancherTaskType.RANCHER_DELETE)
    .map(({ id }) => ({
      id,
      type: ODS_MESSAGE_TYPE.info,
      message: t('rancherStatusDeleting'),
    }));

  return (
    <div className="my-6">
      {tasksMessage?.map((task) => (
        <OsdsMessage
          id={task.id}
          type={task.type}
          className="my-4 p-3"
          key={task.id}
        >
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
