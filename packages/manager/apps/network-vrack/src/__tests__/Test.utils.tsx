import React from 'react';

import { act, render, screen, waitFor } from '@testing-library/react';

import { WAIT_FOR_DEFAULT_OPTIONS } from '@ovh-ux/manager-core-test-utils';

import { urls } from '../routes/Routes.constants';
import { setupMswMock } from './SetupMswServer';
import { TestApp } from './TestApp';
import { testWrapperBuilder } from './testWrapperBuilder';

const formatSafePath = (url?: string) =>
  url && url.startsWith(urls.root) ? url : `${urls.root}${url ?? ''}`;

export const renderTest = async ({
  initialRoute,
}: {
  initialRoute?: string;
} = {}) => {
  setupMswMock();

  const wrapper = await testWrapperBuilder()
    .withQueryClient()
    .withI18next()
    .withShellContext()
    .build();

  return act(() => render(<TestApp initialRoute={formatSafePath(initialRoute)} />, { wrapper }));
};

export const checkTextInScreen = async (textToCheck: string, nbOccurences?: number) => {
  await waitFor(() => {
    if (nbOccurences) {
      expect(screen.getAllByText(textToCheck)).toHaveLength(nbOccurences);
    } else {
      expect(screen.getAllByText(textToCheck)[0]).toBeInTheDocument();
    }
  }, WAIT_FOR_DEFAULT_OPTIONS);
};

export const checkTextNotInScreen = async (textToCheck: string) => {
  await waitFor(() => expect(screen.queryByText(textToCheck)).toBeNull(), WAIT_FOR_DEFAULT_OPTIONS);
};
