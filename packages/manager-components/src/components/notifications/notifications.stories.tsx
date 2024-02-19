import React from 'react';
import { withRouter } from 'storybook-addon-react-router-v6';
import { OsdsButton } from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { Notifications } from './notifications.component';
import { useNotifications } from './useNotifications';

const NotificationsStory = () => {
  const { addSuccess, addWarning, addError, clearNotifications } =
    useNotifications();

  return (
    <>
      <div className="flex">
        <OsdsButton
          className="mr-2"
          size={ODS_BUTTON_SIZE.md}
          color={ODS_THEME_COLOR_INTENT.success}
          onClick={() => addSuccess('success message')}
        >
          Add success
        </OsdsButton>
        <OsdsButton
          className="mr-2"
          size={ODS_BUTTON_SIZE.md}
          color={ODS_THEME_COLOR_INTENT.warning}
          onClick={() => addWarning('warning message')}
        >
          Add warning
        </OsdsButton>
        <OsdsButton
          className="mr-2"
          size={ODS_BUTTON_SIZE.md}
          color={ODS_THEME_COLOR_INTENT.error}
          onClick={() => addError('error message')}
        >
          Add error
        </OsdsButton>
        <OsdsButton
          className="mr-2"
          size={ODS_BUTTON_SIZE.md}
          color={ODS_THEME_COLOR_INTENT.primary}
          onClick={clearNotifications}
        >
          Clear
        </OsdsButton>
      </div>
      <div className="mt-4">
        <Notifications />
      </div>
    </>
  );
};

export const Primary = {
  name: 'Notifications',
};

export default {
  title: 'Components/Notifications',
  component: NotificationsStory,
  decorators: [withRouter],
};
