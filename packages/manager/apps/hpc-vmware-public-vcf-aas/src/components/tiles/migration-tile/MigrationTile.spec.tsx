import { act, render } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, beforeAll } from 'vitest';
import React from 'react';
import { i18n } from 'i18next';
import { I18nextProvider } from 'react-i18next';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import { useVcdOrganization } from '@ovh-ux/manager-module-vcd-api';
import {
  assertElementLabel,
  assertElementVisibility,
  getElementByTestId,
  initTestI18n,
} from '@ovh-ux/manager-core-test-utils';
import userEvent from '@testing-library/user-event';
import MigrationTile from './MigrationTile.component';
import { useVcdaStatus } from '../../../data/hooks/vcda/useVcdaStatus.hook';
import { labels, translations } from '../../../test-utils/test-i18n';
import vcdaMessages from '../../../../public/translations/vcda/Messages_fr_FR.json';
import TEST_IDS from '../../../utils/testIds.constants';
import { TRACKING, APP_NAME } from '../../../tracking.constants';

const navigateMock = vi.fn();
const trackClickMock = vi.fn();
const refetchMock = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
  const original: typeof import('react-router-dom') = await importOriginal();
  return {
    ...original,
    useNavigate: () => navigateMock,
    useParams: () => ({ id: 'org-123' }),
  };
});

vi.mock('@ovh-ux/manager-react-shell-client', async (importOriginal) => {
  const original: typeof import('@ovh-ux/manager-react-shell-client') = await importOriginal();
  return {
    ...original,
    useOvhTracking: () => ({ trackClick: trackClickMock }),
  };
});

vi.mock('@ovh-ux/manager-module-vcd-api', async (importOriginal) => {
  const original: typeof import('@ovh-ux/manager-module-vcd-api') = await importOriginal();
  return {
    ...original,
    useVcdOrganization: vi.fn(),
  };
});

vi.mock('../../../data/hooks/vcda/useVcdaStatus.hook', () => ({
  useVcdaStatus: vi.fn(),
}));

vi.mock('@ovh-ux/manager-react-components', async (importOriginal) => {
  const original: typeof import('@ovh-ux/manager-react-components') = await importOriginal();
  return {
    ...original,
    ManagerButton: ({
      label,
      onClick,
      'data-testid': dataTestId,
      'aria-label': ariaLabel,
    }: {
      label: string;
      onClick?: () => void;
      'data-testid'?: string;
      'aria-label'?: string;
    }) =>
      React.createElement('ods-button', {
        label,
        'data-testid': dataTestId,
        'aria-label': ariaLabel,
        onClick,
      }),
  };
});

let i18nState: i18n;

const shellContext = {
  shell: {
    navigation: { getURL: vi.fn().mockResolvedValue('https://www.ovh.com') },
  },
};

const mockStatus = (overrides: Partial<ReturnType<typeof useVcdaStatus>>) => {
  vi.mocked(useVcdaStatus).mockReturnValue({
    data: undefined,
    isPending: false,
    isLoading: false,
    isError: false,
    refetch: refetchMock,
    ...overrides,
  });
};

const renderComponent = () => {
  const queryClient = new QueryClient();
  return render(
    <I18nextProvider i18n={i18nState}>
      <QueryClientProvider client={queryClient}>
        <ShellContext.Provider
          value={(shellContext as unknown) as ShellContextType}
        >
          <MigrationTile />
        </ShellContext.Provider>
      </QueryClientProvider>
    </I18nextProvider>,
  );
};

describe('MigrationTile', () => {
  beforeAll(async () => {
    i18nState = await initTestI18n(APP_NAME, translations);
    i18nState.addResourceBundle('fr_FR', 'vcda', vcdaMessages, true, true);
  });

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useVcdOrganization).mockReturnValue({
      data: { data: { iam: { urn: 'urn:org-123' } } },
    } as ReturnType<typeof useVcdOrganization>);
  });

  it('renders the loading skeleton while the status is in flight', async () => {
    mockStatus({ isPending: true });
    renderComponent();
    const skeleton = await getElementByTestId(TEST_IDS.migrationTileSkeleton);
    await assertElementVisibility(skeleton);
  });

  it('renders the inline error with a retry action and refetches on click', async () => {
    const user = userEvent.setup();
    mockStatus({ isError: true });
    renderComponent();

    const error = await getElementByTestId(TEST_IDS.migrationTileError);
    await assertElementVisibility(error);

    const retry = await getElementByTestId(TEST_IDS.migrationTileRetryCta);
    await act(() => user.click(retry));
    expect(refetchMock).toHaveBeenCalled();
  });

  it('renders the Order CTA in the inactive state and navigates + tracks on click', async () => {
    const user = userEvent.setup();
    mockStatus({ data: { kind: 'inactive' } });
    renderComponent();

    const cta = await getElementByTestId(TEST_IDS.migrationTileOrderCta);
    await assertElementLabel({
      element: cta,
      label: labels.vcda.tile.cta.order,
    });

    await act(() => user.click(cta));
    expect(trackClickMock).toHaveBeenCalledWith(
      TRACKING.dashboard.orderMigrationTile,
    );
    expect(navigateMock).toHaveBeenCalledWith(
      '/public-vcf-aas/org-123/migration/order-migration',
    );
  });

  it('renders the provisioning badge for CREATING', async () => {
    mockStatus({ data: { kind: 'provisioning' } });
    renderComponent();
    const badge = await getElementByTestId(
      TEST_IDS.migrationTileProvisioningBadge,
    );
    await assertElementLabel({
      element: badge,
      label: labels.vcda.tile.badge.provisioning,
    });
  });

  it('renders the deleting badge for DELETING', async () => {
    mockStatus({ data: { kind: 'deleting' } });
    renderComponent();
    const badge = await getElementByTestId(TEST_IDS.migrationTileDeletingBadge);
    await assertElementLabel({
      element: badge,
      label: labels.vcda.tile.badge.deleting,
    });
  });

  it('renders the Actif badge for READY', async () => {
    mockStatus({ data: { kind: 'active', resourceStatus: 'READY' } });
    renderComponent();
    const badge = await getElementByTestId(TEST_IDS.migrationTileStatusBadge);
    await assertElementLabel({
      element: badge,
      label: labels.vcda.tile.badge.actif,
    });
  });

  it('renders the Suspendu badge for SUSPENDED', async () => {
    mockStatus({ data: { kind: 'active', resourceStatus: 'SUSPENDED' } });
    renderComponent();
    const badge = await getElementByTestId(TEST_IDS.migrationTileStatusBadge);
    await assertElementLabel({
      element: badge,
      label: labels.vcda.tile.badge.suspended,
    });
  });

  it('renders the Erreur badge for ERROR', async () => {
    mockStatus({ data: { kind: 'active', resourceStatus: 'ERROR' } });
    renderComponent();
    const badge = await getElementByTestId(TEST_IDS.migrationTileStatusBadge);
    await assertElementLabel({
      element: badge,
      label: labels.vcda.tile.badge.error,
    });
  });
});
