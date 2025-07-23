import React from 'react';
import '@testing-library/jest-dom';
import { act, render, screen } from '@testing-library/react';
import { describe, it, vi, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  ShellContext,
  ShellContextType,
  TrackingClickParams,
} from '@ovh-ux/manager-react-shell-client';
import {
  useFeatureAvailability,
  UseFeatureAvailabilityResult,
} from '@ovh-ux/manager-react-components';
import GeneralInformations from './index';
import { BACKUP_SAP_TITLE } from './general-informations.constants';
import { TRACKING } from '@/tracking.constants';
import { testIds } from '@/utils/testIds.constants';
import { FEATURES } from '@/utils/features.constants';

const trackClickMock = vi.fn();
vi.mock('@ovh-ux/manager-react-shell-client', async (importOriginal) => {
  const original: typeof import('@ovh-ux/manager-react-shell-client') = await importOriginal();
  return {
    ...original,
    useOvhTracking: () => ({ trackClick: trackClickMock }),
  };
});

vi.mock('@ovh-ux/manager-react-components', async (importOriginal) => {
  const original: typeof import('@ovh-ux/manager-react-components') = await importOriginal();
  return {
    ...original,
    useFeatureAvailability: vi.fn(),
  };
});

vi.mock('react-router-dom', () => ({
  useHref: vi.fn(),
}));

const shellContext = {
  shell: {
    environment: {
      user: { ovhSubsidiary: 'FR' },
      getRegion: vi.fn(),
      getEnvironment: () => {
        return {
          getUser: vi.fn(() => ({ ovhSubsidiary: 'FR' })),
        };
      },
    },
  },
};

const renderComponent = () =>
  render(
    <ShellContext.Provider
      value={(shellContext as unknown) as ShellContextType}
    >
      <QueryClientProvider client={new QueryClient()}>
        <GeneralInformations />
      </QueryClientProvider>
    </ShellContext.Provider>,
  );

describe('SAP Features Hub dashboard test suite', () => {
  const standardElements = [
    'blocks_pre_installation_sap_hana_title',
    'blocks_infrastructure_as_code_title',
    BACKUP_SAP_TITLE,
    'blocks_logs_analysis_and_extract_title',
  ];
  const wizardElement = 'blocks_pre_installation_wizard_sap_title';

  it('should render all tiles with correct titles when wizard feature is available', async () => {
    // when
    vi.mocked(useFeatureAvailability).mockReturnValue({
      data: { [FEATURES.INSTALLATION_WIZARD]: true },
      isLoading: false,
    } as UseFeatureAvailabilityResult);

    renderComponent();

    // then
    standardElements.forEach(
      (element) => expect(screen.getByText(element)).toBeVisible,
    );

    // and
    expect(screen.getByText(wizardElement)).toBeVisible();
  });

  it('should render all tiles except wizard when feature is not available', async () => {
    // when
    vi.mocked(useFeatureAvailability).mockReturnValue({
      data: { [FEATURES.INSTALLATION_WIZARD]: false },
      isLoading: false,
    } as UseFeatureAvailabilityResult);

    renderComponent();

    // then
    standardElements.forEach(
      (element) => expect(screen.getByText(element)).toBeVisible,
    );

    // and
    expect(screen.queryByText(wizardElement)).not.toBeInTheDocument();
  });
});

describe('Tracking test suite', () => {
  const testCases: {
    testId: string;
    trackingParams: TrackingClickParams;
  }[] = [
    {
      testId: testIds.hubLinkSapHanaDocs,
      trackingParams: TRACKING.dashboard.externalLinkClick({
        tileName: 'pre_installation_sap_hana',
        type: 'documentation',
      }),
    },
    {
      testId: testIds.hubLinkInfraAsCodeDocs,
      trackingParams: TRACKING.dashboard.externalLinkClick({
        tileName: 'infrastructure_as_code',
        type: 'documentation',
      }),
    },
    {
      testId: testIds.hubLinkInfraAsCodeGit,
      trackingParams: TRACKING.dashboard.externalLinkClick({
        tileName: 'infrastructure_as_code',
        type: 'git',
      }),
    },
    {
      testId: testIds.hubLinkBackintDownload,
      trackingParams: TRACKING.dashboard.downloadBackint,
    },
    {
      testId: testIds.hubLinkSapHanaBackupDocs,
      trackingParams: TRACKING.dashboard.externalLinkClick({
        tileName: 'backup_sap_hana',
        type: 'documentation',
      }),
    },
    {
      testId: testIds.hubLinkWizardStart,
      trackingParams: TRACKING.dashboard.linkClick({
        tileName: 'pre_installation_wizard',
        clickName: 'installation-wizard',
      }),
    },
    {
      testId: testIds.hubLinkInstallationHistory,
      trackingParams: TRACKING.dashboard.linkClick({
        tileName: 'pre_installation_wizard',
        clickName: 'history',
      }),
    },
    {
      testId: testIds.hubLinkWizardDocs,
      trackingParams: TRACKING.dashboard.externalLinkClick({
        tileName: 'pre_installation_wizard',
        type: 'documentation',
      }),
    },
    {
      testId: testIds.hubLinkAnalysisDocs,
      trackingParams: TRACKING.dashboard.externalLinkClick({
        tileName: 'analysis_and_extract',
        type: 'documentation',
      }),
    },
    {
      testId: testIds.hubLinkAnalysisGit,
      trackingParams: TRACKING.dashboard.externalLinkClick({
        tileName: 'analysis_and_extract',
        type: 'git',
      }),
    },
  ];

  it.each(testCases)(
    'should track $testId click',
    async ({ testId, trackingParams }) => {
      vi.mocked(useFeatureAvailability).mockReturnValue({
        data: { [FEATURES.INSTALLATION_WIZARD]: true },
        isLoading: false,
      } as UseFeatureAvailabilityResult);

      renderComponent();
      const user = userEvent.setup();
      const link = screen.getByTestId(testId);
      await act(() => user.click(link));

      expect(trackClickMock).toHaveBeenCalledWith(trackingParams);
    },
  );
});
