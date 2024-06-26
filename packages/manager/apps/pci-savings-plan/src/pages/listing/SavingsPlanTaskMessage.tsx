import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_MESSAGE_TYPE } from '@ovhcloud/ods-components';
import { OsdsMessage, OsdsText } from '@ovhcloud/ods-components/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { SavingsPlanTask, SavingsPlanTaskType } from '@/data/api/api.type';

const SavingsPlanTaskMessage = ({ tasks }: { tasks: SavingsPlanTask[] }) => {
  const { t } = useTranslation('pci-savings-plan/listing');
  const tasksMessage = tasks
    .filter((task) => task?.type === SavingsPlanTaskType.SAVINGS_PLAN_DELETE)
    .map(({ id }) => ({
      id,
      type: ODS_MESSAGE_TYPE.info,
      message: t('savingsPlanStatusDeleting'),
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

export default SavingsPlanTaskMessage;
