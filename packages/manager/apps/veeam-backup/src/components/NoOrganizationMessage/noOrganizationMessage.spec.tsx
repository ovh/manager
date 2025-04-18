import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { i18n as i18nType } from 'i18next';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import { organizationList } from '@ovh-ux/manager-module-vcd-api';
import {
  assertTextVisibility,
  initTestI18n,
} from '@ovh-ux/manager-core-test-utils';
import { NoOrganizationMessage } from './NoOrganizationMessage.component';
import { labels } from '@/test-helpers';
import { appName } from '@/veeam-backup.config';
import { translations } from '@/test-helpers/labels';

let i18n: i18nType;
const shellContext = {
  environment: { user: { ovhSubsidiary: 'FR' } },
};

const renderComponent = async ({ emptyList }: { emptyList: boolean }) => {
  if (!i18n) {
    i18n = await initTestI18n(appName, translations);
  }

  return render(
    <I18nextProvider i18n={i18n}>
      <ShellContext.Provider
        value={(shellContext as unknown) as ShellContextType}
      >
        <NoOrganizationMessage
          organizationList={emptyList ? [] : [organizationList[0]]}
        />
      </ShellContext.Provider>
    </I18nextProvider>,
  );
};

describe('NoOrganizationMessage test suite', () => {
  it('displays the message if there is no organization', async () => {
    // when
    await renderComponent({ emptyList: true });

    // then
    await waitFor(
      () => {
        assertTextVisibility(labels.common.no_organization_message);
      },
      { timeout: 10_000 },
    );
  });

  it('does not display the message if there is some organization', async () => {
    // when
    await renderComponent({ emptyList: false });

    // then
    await waitFor(
      () => {
        expect(
          screen.queryByText(labels.common.no_organization_message),
        ).not.toBeInTheDocument();
      },
      { timeout: 10_000 },
    );
  });
});
