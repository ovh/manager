import 'element-internals-polyfill';
import { vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { i18n as i18nType } from 'i18next';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import {
  assertTextVisibility,
  initTestI18n,
} from '@ovh-ux/manager-core-test-utils';
import {
  BackupStatus,
  organizationList,
  useOrganizationWithBackupStatusList,
  UseOrganizationWithBackupStatusListReturn,
} from '@ovh-ux/manager-module-vcd-api';
import { labels } from '@/test-helpers';
import { OrderVeeamStep2 } from './OrderVeeamStep2.component';
import '@testing-library/jest-dom';
import { appName } from '@/veeam-backup.config';
import { translations } from '@/test-helpers/labels';

let i18n: i18nType;

vi.mock('react-router-dom', async () => {
  const mod = await vi.importActual('react-router-dom');
  return {
    ...mod,
    useNavigate: () => ({ navigate: vi.fn() }),
  };
});

// remove ods mock when element-internals-polyfill err is fixed
vi.mock('@ovhcloud/ods-components/react', async (mod) => {
  const module = await mod<typeof import('@ovhcloud/ods-components/react')>();
  return {
    ...module,
    OdsRadio: () => <input type="radio" name="radio-order-storage" />,
  };
});
vi.mock('@ovh-ux/manager-module-vcd-api', async (mod) => {
  const module = await mod<typeof import('@ovh-ux/manager-module-vcd-api')>();
  return { ...module, useOrganizationWithBackupStatusList: vi.fn() };
});

const shellContext = {
  environment: {
    user: { ovhSubsidiary: 'FR' },
    getRegion: vi.fn(),
    getUser: vi.fn(() => ({ ovhSubsidiary: 'FR' })),
  },
};

const renderComponent = async () => {
  if (!i18n) {
    i18n = await initTestI18n(appName, translations);
  }
  return render(
    <I18nextProvider i18n={i18n}>
      <ShellContext.Provider
        value={(shellContext as unknown) as ShellContextType}
      >
        <OrderVeeamStep2 />
      </ShellContext.Provider>
    </I18nextProvider>,
  );
};

const standardHookResult = {
  data: { pages: [{ data: [organizationList[0]] }] },
  flattenData: [{ ...organizationList[0], backupStatus: BackupStatus.active }],
  isError: false,
  isLoading: false,
} as UseOrganizationWithBackupStatusListReturn;

describe('order', () => {
  afterEach(() => vi.clearAllMocks());

  it('display all orgs backed-up message in step 2', async () => {
    vi.mocked(useOrganizationWithBackupStatusList).mockImplementation(
      () => standardHookResult,
    );

    // when
    await renderComponent();

    // then
    await assertTextVisibility(
      labels.orderVeeam.all_organization_backed_up_message,
    );
  });

  it('display empty org message in step 2', async () => {
    vi.mocked(useOrganizationWithBackupStatusList).mockImplementation(
      () =>
        ({
          ...standardHookResult,
          data: { pages: [{ data: [] }] },
          flattenData: [],
        } as UseOrganizationWithBackupStatusListReturn),
    );

    // when
    await renderComponent();

    // then
    await waitFor(
      () => {
        assertTextVisibility(labels.common.no_organization_message);
      },
      { timeout: 10_000 },
    );
  });
});
