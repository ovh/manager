import { vitest } from 'vitest';
import { waitFor, screen, render } from '@testing-library/react';
import { VeeamBackupOffer } from '@ovh-ux/manager-module-vcd-api';
import { I18nextProvider } from 'react-i18next';
import { i18n } from 'i18next';
import { initTestI18n } from '@ovh-ux/manager-core-test-utils';
import { translations } from '../../test-helpers/labels';
import { appName } from '../../veeam-backup.config';
import useVeeamBackupConsumption from '@/data/hooks/useVeeamBackupConsumption';
import { OfferProgress } from './OfferProgress.component';
import { VEEAM_BACKUP_CONSUMPTION_PLAN_CODE } from '@/pages/dashboard/Dashboard.constants';

let i18: i18n;
const renderWithProviders = async (component: React.ReactElement) => {
  if (!i18) {
    i18 = await initTestI18n(appName, translations);
  }

  return render(<I18nextProvider i18n={i18}>{component}</I18nextProvider>);
};

vitest.mock('@/data/hooks/useVeeamBackupConsumption', () => ({
  default: vitest.fn(),
}));

describe('OfferProgress component', () => {
  beforeEach(() => {
    vitest.resetAllMocks();
  });

  const offer1: VeeamBackupOffer = {
    name: 'BRONZE',
    quotaInTB: 5,
    usedSpaceInGB: 0,
    status: 'READY',
    protectionPrimaryRegion: 'eu-central-waw',
    protectionReplicatedRegion: 'eu-west-lim',
  };

  const offer2: VeeamBackupOffer = {
    name: 'BRONZE',
    quotaInTB: 10,
    usedSpaceInGB: 1000, // Never taken into account used space will be 0 if not found in consumptions
    status: 'READY',
    protectionPrimaryRegion: 'eu-central-waw',
  };
  const testCases = [
    {
      offer: offer1,
      contextLabel: 'renders loading skeleton when data is loading',
      mock: { data: null as any, isLoading: true },
      expectedSkeletons: 2,
      offerOverrides: {},
      expectedProgressBarValue: null as any,
      expectedConsumedStorage: null as any,
      expectedPrimaryRegion: null as any,
      expectedSecondaryRegion: null as any,
    },
    {
      contextLabel:
        'renders correctly with consumption and primay and secondary regions',
      offer: offer1,
      mock: {
        data: [
          {
            planCode: VEEAM_BACKUP_CONSUMPTION_PLAN_CODE.BRONZE,
            quantity: 500,
          },
        ],
        isLoading: false,
      },
      expectedProgressBarValue: '500',
      expectedConsumedStorage: '500 Go (10.00% de 5 To)',
      expectedPrimaryRegion: 'eu-central-waw',
      expectedSecondaryRegion: 'eu-west-lim',
    },
    {
      contextLabel: 'renders with 0 GB when no matching consumption',
      offer: offer1,
      mock: {
        data: [{ planCode: 'random-code', quantity: 300 }],
        isLoading: false,
      },
      expectedProgressBarValue: '0',
      expectedConsumedStorage: '0 Go (0.00% de 5 To)',
      expectedPrimaryRegion: 'eu-central-waw',
      expectedSecondaryRegion: 'eu-west-lim',
    },

    {
      contextLabel: 'renders correctly with consumption data',
      offer: offer2,
      mock: {
        data: [
          {
            planCode: VEEAM_BACKUP_CONSUMPTION_PLAN_CODE.BRONZE,
            quantity: 500,
          },
        ],
        isLoading: false,
      },
      expectedProgressBarValue: '500',
      expectedConsumedStorage: '500 Go (5.00% de 10 To)',
      expectedPrimaryRegion: 'eu-central-waw',
      expectedSecondaryRegion: null,
    },
    {
      contextLabel:
        'renders with 0 GB when no matching consumption even if usedSpace is >0',
      offer: offer2,
      mock: {
        data: [{ planCode: 'random-code', quantity: 300 }],
        isLoading: false,
      },
      expectedProgressBarValue: '0',
      expectedConsumedStorage: '0 Go (0.00% de 10 To)',
      expectedPrimaryRegion: 'eu-central-waw',
      expectedSecondaryRegion: null,
    },
    {
      contextLabel:
        'renders error when error happen and error status is different than 404',
      offer: offer2,
      mock: {
        data: [{ planCode: 'random-code', quantity: 300 }],
        isLoading: false,
        isError: true,
      },

      expectedError: 'Erreur',
    },
    {
      contextLabel:
        'renders consumption when error happen and error status is  404',
      offer: offer2,
      mock: {
        isLoading: false,
        isError: true,
        error: { response: { status: 404 } },
      },
      expectedProgressBarValue: '0',
      expectedConsumedStorage: '0 Go (0.00% de 10 To)',
      expectedPrimaryRegion: 'eu-central-waw',
      expectedSecondaryRegion: null as any,
    },
  ];

  testCases.forEach(
    ({
      contextLabel,
      offer,
      mock,
      expectedSkeletons,
      expectedProgressBarValue,
      expectedConsumedStorage,
      expectedPrimaryRegion,
      expectedSecondaryRegion,
      expectedError,
    }) => {
      it(contextLabel, async () => {
        vitest.mocked(useVeeamBackupConsumption).mockReturnValue(mock as any);

        const { container } = await renderWithProviders(
          <OfferProgress offer={offer} id="test-id" />,
        );

        if (mock.isLoading) {
          await waitFor(() => {
            expect(container.getElementsByTagName('ods-skeleton')).toHaveLength(
              expectedSkeletons,
            );
          });
        } else if (mock.isError && mock.error?.response?.status !== 404) {
          await waitFor(() => {
            expect(screen.queryByTestId('error-api')).toHaveAttribute(
              'label',
              expectedError,
            );
          });
        } else {
          await waitFor(() => {
            expect(container.querySelector('ods-progress-bar')).toHaveAttribute(
              'value',
              expectedProgressBarValue,
            );

            expect(screen.getByText(expectedConsumedStorage as string));
            expect(screen.queryByTestId('primary-region')).toHaveAttribute(
              'label',
              expectedPrimaryRegion,
            );
            if (expectedSecondaryRegion) {
              expect(screen.queryByTestId('secondary-region')).toHaveAttribute(
                'label',
                expectedSecondaryRegion,
              );
            } else {
              expect(screen.queryByText(/Secondary/)).not.toBeInTheDocument();
            }
          });
        }
      });
    },
  );
});
