import React from 'react';

import { render } from '@testing-library/react';

import { urls } from '@/routes/Routes.constants';
import { TestApp } from '@/test-utils/TestApp';
import { setupMswMock } from '@/test-utils/setupMsw';
import { testWrapperBuilder } from '@/test-utils/testWrapperBuilder';

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

  return render(<TestApp initialRoute={formatSafePath(initialRoute)} />, {
    wrapper,
  });
};
