import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WAIT_FOR_DEFAULT_OPTIONS } from '@ovh-ux/manager-core-test-utils';
import { labels } from './labels';

export const goToDashboard = async (name: string) => {
  await waitFor(() => {
    userEvent.click(screen.getByText(name));
  });

  await waitFor(
    () => expect(screen.getByText(labels.dashboard.general_informations)),
    WAIT_FOR_DEFAULT_OPTIONS,
  );
};
