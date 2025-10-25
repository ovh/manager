import { render } from '@testing-library/react';

import { urls } from '@/routes/Routes.constants';

import { TestApp } from './TestApp';
import { TMockParams, setupMswMock } from './setupMsw';
import { testWrapperBuilder } from './testWrapperBuilder';

const formatSafePath = (url?: string) =>
  url && url.startsWith(urls.root) ? url : `${urls.root}${url ?? ''}`;

export const renderTest = async ({
  initialRoute,
  ...mockParams
}: {
  initialRoute?: string;
} & TMockParams = {}) => {
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
