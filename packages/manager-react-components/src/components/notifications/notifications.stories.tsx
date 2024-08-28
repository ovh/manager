import React from 'react';
import { withRouter } from 'storybook-addon-react-router-v6';
import { OdsButton } from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_SIZE, ODS_BUTTON_COLOR } from '@ovhcloud/ods-components';

import { Notifications } from './notifications.component';
import { useNotifications } from './useNotifications';

const NotificationsStory = () => {
  const { addSuccess, addWarning, addError, clearNotifications } =
    useNotifications();

  return (
    <>
      <div className="flex">
        <OdsButton
          className="mr-2"
          size={ODS_BUTTON_SIZE.md}
          onClick={() => addSuccess('success message')}
          label="Add success"
        />
        <OdsButton
          className="mr-2"
          size={ODS_BUTTON_SIZE.md}
          color={ODS_BUTTON_COLOR.critical}
          onClick={() => addWarning('warning message')}
          label="Add warning"
        />
        <OdsButton
          className="mr-2"
          size={ODS_BUTTON_SIZE.md}
          color={ODS_BUTTON_COLOR.critical}
          onClick={() => addError('error message')}
          label="Add error"
        />
        <OdsButton
          className="mr-2"
          size={ODS_BUTTON_SIZE.md}
          onClick={clearNotifications}
          label="Clear"
        />
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
