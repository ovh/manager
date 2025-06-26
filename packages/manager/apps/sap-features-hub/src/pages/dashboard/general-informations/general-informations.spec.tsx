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
import GeneralInformations from './index';
import { BACKUP_SAP_TITLE } from './general-informations.constants';
import { TRACKING } from '@/tracking.constants';
import { testIds } from '@/utils/testIds.constants';

const trackClickMock = vi.fn();
vi.mock('@ovh-ux/manager-react-shell-client', async (importOriginal) => {
  const original: typeof import('@ovh-ux/manager-react-shell-client') = await importOriginal();
  return {
    ...original,
    useOvhTracking: () => ({ trackClick: trackClickMock }),
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
  it('should render tiles with correct titles', async () => {
    renderComponent();

    const elements = [
      'blocks_pre_installation_sap_hana_title',
      'blocks_infrastructure_as_code_title',
      BACKUP_SAP_TITLE,
      'blocks_pre_installation_wizard_sap_title',
      'blocks_logs_analysis_and_extract_title',
    ];

    elements.forEach(
      (element) => expect(screen.getByText(element)).toBeVisible,
    );
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
      renderComponent();
      const user = userEvent.setup();
      const link = screen.getByTestId(testId);
      await act(() => user.click(link));

      expect(trackClickMock).toHaveBeenCalledWith(trackingParams);
    },
  );
});
