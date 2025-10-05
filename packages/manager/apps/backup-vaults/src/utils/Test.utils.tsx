import React from 'react';

import { render } from '@testing-library/react';

import { urls } from '@/routes/Routes.constants';
import { TestApp } from '@/utils/tests/TestApp';
import { MockParams, setupMswMock } from '@/utils/tests/setupMsw';
import { testWrapperBuilder } from '@/utils/tests/testWrapperBuilder';

const formatSafePath = (url?: string) =>
  url && url.startsWith(urls.root) ? url : `${urls.root}${url ?? ''}`;

export const renderTest = async ({
  initialRoute,
  ...mockParams
}: {
  initialRoute?: string;
} & MockParams = {}) => {
  setupMswMock(mockParams);

  const Providers = await testWrapperBuilder()
    .withQueryClient()
    .withI18next()
    .withShellContext()
    .build();

  return render(
    <Providers>
      <TestApp initialRoute={formatSafePath(initialRoute)} />
    </Providers>,
  );
};
