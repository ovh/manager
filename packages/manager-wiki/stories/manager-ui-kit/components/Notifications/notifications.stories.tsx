import React from 'react';
import { withRouter } from 'storybook-addon-react-router-v6';
import { Button, BUTTON_COLOR, BUTTON_SIZE } from '@ovhcloud/ods-react';

import { Notifications, useNotifications } from '@ovh-ux/muk';

const NotificationsStory = () => {
  const { addSuccess, addWarning, addError, clearNotifications } =
    useNotifications();

  return (
    <>
      <div className="flex">
        <Button
          className="mr-2"
          size={BUTTON_SIZE.md}
          onClick={() => addSuccess('success message')}
        >
          Add success
        </Button>

        <Button
          className="mr-2"
          size={BUTTON_SIZE.md}
          color={BUTTON_COLOR.critical}
          onClick={() => addWarning('warning message')}
        >
          Add warning
        </Button>
        <Button
          className="mr-2"
          size={BUTTON_SIZE.md}
          color={BUTTON_COLOR.critical}
          onClick={() => addError('error message')}
        >
          Add error
        </Button>
        <Button
          className="mr-2"
          size={BUTTON_SIZE.md}
          onClick={clearNotifications}
        >
          Clear
        </Button>
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
  title: 'Manager UI Kit/Components/Notifications',
  component: NotificationsStory,
  tags: ['autodocs'],
  decorators: [withRouter],
};
