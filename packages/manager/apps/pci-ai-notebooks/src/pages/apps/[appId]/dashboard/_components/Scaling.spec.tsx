import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { UseQueryResult } from '@tanstack/react-query';
import * as ai from '@/types/cloud/project/ai';
import { Locale } from '@/hooks/useLocale';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedApp, mockedAppSpec } from '@/__tests__/helpers/mocks/app';
import ScalingStrat from './Scaling.component';
import { useAppData } from '@/pages/apps/[appId]/App.context';
import { AIError } from '@/data/api';

const autoScalingApp: ai.app.App = {
  ...mockedApp,
  spec: {
    ...mockedAppSpec,
    scalingStrategy: {
      automatic: {
        averageUsageTarget: 75,
        replicasMin: 2,
        replicasMax: 3,
        resourceType: ai.app.ScalingAutomaticStrategyResourceTypeEnum.CPU,
      },
    },
  },
};

const mockedUsedNavigate = vi.fn();
describe('Scaling component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    // Mock necessary hooks and dependencies
    vi.mock('react-i18next', () => ({
      useTranslation: () => ({
        t: (key: string) => key,
      }),
    }));

    vi.mock('@/pages/apps/[appId]/App.context', () => ({
      useAppData: vi.fn(() => ({
        projectId: 'projectId',
        app: mockedApp,
        appQuery: {} as UseQueryResult<ai.app.App, Error>,
      })),
    }));

    vi.mock('@ovh-ux/manager-react-shell-client', async (importOriginal) => {
      const mod = await importOriginal<
        typeof import('@ovh-ux/manager-react-shell-client')
      >();
      return {
        ...mod,
        useShell: vi.fn(() => ({
          i18n: {
            getLocale: vi.fn(() => Locale.fr_FR),
            onLocaleChange: vi.fn(),
            setLocale: vi.fn(),
          },
        })),
      };
    });
    vi.mock('@/components/ui/use-toast', () => {
      const toastMock = vi.fn();
      return {
        useToast: vi.fn(() => ({
          toast: toastMock,
        })),
      };
    });

    vi.mock('react-router-dom', async () => {
      const mod = await vi.importActual('react-router-dom');
      return {
        ...mod,
        useNavigate: () => mockedUsedNavigate,
      };
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders GeneralInformation', async () => {
    render(<ScalingStrat />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('update-scaling-button')).toBeInTheDocument();
    expect(screen.getByTestId('fixed-list')).toBeInTheDocument();
  });

  it('open update scaling modal', async () => {
    render(<ScalingStrat />, { wrapper: RouterWithQueryClientWrapper });
    act(() => {
      fireEvent.click(screen.getByTestId('update-scaling-button'));
    });
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('./update-scaling');
    });
  });

  it('renders GeneralInformation with autoScaling', async () => {
    vi.mocked(useAppData).mockReturnValue({
      projectId: 'projectId',
      app: autoScalingApp,
      appQuery: {} as UseQueryResult<ai.app.App, AIError>,
    });
    render(<ScalingStrat />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('update-scaling-button')).toBeInTheDocument();
    expect(screen.getByTestId('automatic-list')).toBeInTheDocument();
  });
});
