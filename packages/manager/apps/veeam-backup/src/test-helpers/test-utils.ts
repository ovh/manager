import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { waitForOptions } from '@ovh-ux/manager-core-test-utils';
import { labels } from './labels';

export const goToDashboard = async (name: string) => {
  await waitFor(() => {
    userEvent.click(screen.getByText(name));
  });

  await waitFor(
    () => expect(screen.getByText(labels.dashboard.general_informations)),
    waitForOptions,
  );
};
