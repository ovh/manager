import { screen, waitFor, render } from '@testing-library/react';
import { vi } from 'vitest';

import { useQuery } from '@tanstack/react-query';
import { I18nextProvider } from 'react-i18next';
import { i18n } from 'i18next';
import {
  initTestI18n,
  WAIT_FOR_DEFAULT_OPTIONS,
} from '@ovh-ux/manager-core-test-utils';
import {
  getNumberVeeamBackupConsumption,
  OfferProgress,
} from './OfferProgress.component';
import { VEEAM_BACKUP_CONSUMPTION_PLAN_CODE } from './Dashboard.constants';
import { translations } from '../../test-helpers/labels';
import { appName } from '../../veeam-backup.config';

const scenarii = [
  {
    contextLabel: 'Without data',
    offerName: 'BRONZE',
    consumptionData: [],
    expected: 0,
  },
  {
    contextLabel: 'Without data for offer',
    offerName: 'BRONZE',
    consumptionData: [{ planCode: 'randomCode', uniqueId: 'id', quantity: 0 }],
    expected: 0,
  },
  {
    contextLabel: 'With one element for offer',
    offerName: 'BRONZE',
    consumptionData: [
      { planCode: 'randomCode1', uniqueId: 'id1', quantity: 0 },
      { planCode: 'randomCode2', uniqueId: 'id2', quantity: 0 },
      {
        planCode: VEEAM_BACKUP_CONSUMPTION_PLAN_CODE.BRONZE,
        uniqueId: 'randomCode3',
        quantity: 2,
      },
    ],
    expected: 2,
  },
] as const;

describe('dashboardOfferProgress unit test : getNumberVeeamBackupConsomption', () => {
  it.each(scenarii)(
    'displays expected $usedSpaceInGB GB when $contextLabel',
    async ({ contextLabel, offerName, consumptionData, expected }) => {
      const result = getNumberVeeamBackupConsumption(
        offerName,
        consumptionData,
      );

      expect(result.usedSpaceInGB).toBe(expected);
    },
  );
});

const scenarii2 = [
  {
    contextLabel: 'With response 200 and empty data',
    mock: {
      data: {
        status: 200,
        statusText: 'Success',
        data: [],
        headers: {},
        config: {},
      },
      isLoading: false,
      isError: false,
      isPending: false,
    },
    expected: '0 Go',
    expectedTestId: 'offer-progress-progress-bar',
  },
  {
    contextLabel: 'With response 404 and no data',
    mock: {
      data: null as unknown,
      isLoading: false,
      isError: true,
      isPending: false,
      error: { response: { status: 404 } },
    },
    expected: '0 Go',
    expectedTestId: 'offer-progress-progress-bar',
  },
  {
    contextLabel: 'With response 500 and no data',
    mock: {
      data: null as unknown,
      isLoading: false,
      isError: true,
      isPending: false,
      error: { response: { status: 500 } },
    },
    expected: translations.dashboard.error_loading_consumption,
    expectedTestId: 'offer-progress-error',
  },
  {
    contextLabel: 'On loading',
    mock: {
      data: null as unknown,
      isLoading: true,
      isError: false,
      isPending: true,
    },
    expected: null as unknown,
    expectedTestId: 'offer-progress-loading',
  },
] as const;

let i18n: i18n;

const renderWithProviders = async (component: React.ReactElement) => {
  if (!i18n) {
    i18n = await initTestI18n(appName, translations);
  }

  return render(<I18nextProvider i18n={i18n}>{component}</I18nextProvider>);
};

vi.mock('@/data/hooks/useVeeamBackupConsumption', () => ({
  useVeeamBackupConsumptionQueryOptions: vi.fn(() => ({})),
}));

vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(() => ({
    data: [],
    isLoading: false,
    isError: false,
    isPending: false,
  })),
}));

describe('dashboardOfferProgress integration test : Test if render is correct with API response', () => {
  beforeAll(() => {
    vi.resetAllMocks();
  });

  it.each(scenarii2)(
    'displays expected VMs when $contextLabel',
    async ({ contextLabel, mock, expected, expectedTestId }) => {
      vi.mocked(useQuery).mockImplementation(
        () => mock as ReturnType<typeof useQuery>,
      );

      await renderWithProviders(
        <OfferProgress
          id="id"
          offer={{
            name: 'BRONZE',
            quotaInTB: 1,
            usedSpaceInGB: 0,
            status: 'READY',
          }}
        />,
      );

      await waitFor(() => {
        if (expected !== null) expect(screen.findByText(expected as string));
        if (expectedTestId) expect(screen.getByTestId(expectedTestId));
      }, WAIT_FOR_DEFAULT_OPTIONS);
    },
  );
});
