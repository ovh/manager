import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_MESSAGE_TYPE } from '@ovhcloud/ods-components';
import { OsdsMessage, OsdsText } from '@ovhcloud/ods-components/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { RancherTask, RancherTaskType } from '@/types/api.type';

const RancherTaskMessage = ({ tasks }: { tasks: RancherTask[] }) => {
  const { t } = useTranslation('listing');
  const tasksMessage = tasks
    .filter(({ type }) =>
      [RancherTaskType.RANCHER_DELETE, RancherTaskType.RANCHER_CREATE].includes(
        type,
      ),
    )
    .map(({ id, type }) => {
      const message =
        type === RancherTaskType.RANCHER_DELETE
          ? t('rancherStatusDeleting')
          : t('rancherStatusCreating');
      return {
        id,
        type: ODS_MESSAGE_TYPE.info,
        message,
      };
    });

  return (
    <div className="my-6">
      {tasksMessage.map((task) => (
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
