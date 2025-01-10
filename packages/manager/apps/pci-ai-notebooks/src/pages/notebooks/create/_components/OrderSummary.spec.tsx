import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { mockedUser } from '@/__tests__/helpers/mocks/user';
import { Locale } from '@/hooks/useLocale';
import OrderSummary from './OrderSummary.component';
import { mockedCapabilitiesRegionGRA } from '@/__tests__/helpers/mocks/region';
import { mockedCapabilitiesFlavorCPU } from '@/__tests__/helpers/mocks/flavor';
import { mockedFramework } from '@/__tests__/helpers/mocks/notebook/framework';
import { mockedEditor } from '@/__tests__/helpers/mocks/notebook/editor';
import { mockedOrderVolumesS3 } from '@/__tests__/helpers/mocks/datastore';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';

const mockedOrder = {
  region: mockedCapabilitiesRegionGRA,
  flavor: mockedCapabilitiesFlavorCPU,
  resourcesQuantity: 2,
  framework: mockedFramework,
  version: 'version',
  editor: mockedEditor,
  notebookName: 'myNotebook',
  unsecureHttp: false,
  labels: { test: 'test' },
  sshKey: ['myNewSSHKEY'],
  volumes: [mockedOrderVolumesS3],
};

describe('Order summary', () => {
  beforeEach(() => {
    vi.restoreAllMocks();

    // Mock necessary hooks and dependencies
    vi.mock('react-i18next', () => ({
      useTranslation: () => ({
        t: (key: string) => key,
      }),
      Trans: ({ children }: { children: React.ReactNode }) => children,
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
          environment: {
            getEnvironment: vi.fn(() => ({
              getUser: vi.fn(() => mockedUser),
            })),
          },
        })),
      };
    });

    const ResizeObserverMock = vi.fn(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));
    vi.stubGlobal('ResizeObserver', ResizeObserverMock);

    vi.mock('react-router-dom', async () => {
      const mod = await vi.importActual('react-router-dom');
      return {
        ...mod,
        useParams: () => ({
          projectId: 'projectId',
        }),
      };
    });
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('order summary click link display section', async () => {
    const mockedOnSectionClicked = vi.fn();
    render(
      <OrderSummary
        order={mockedOrder}
        onSectionClicked={mockedOnSectionClicked}
      />,
      { wrapper: RouterWithQueryClientWrapper },
    );
    await waitFor(() => {
      expect(screen.getByText(mockedOrder.notebookName)).toBeInTheDocument();
    });

    act(() => {
      fireEvent.click(screen.getByTestId('name-section-button'));
    });
    await waitFor(() => {
      expect(mockedOnSectionClicked).toHaveBeenCalledWith('name');
    });
    act(() => {
      fireEvent.click(screen.getByTestId('region-section-button'));
    });
    await waitFor(() => {
      expect(mockedOnSectionClicked).toHaveBeenCalledWith('region');
    });
    act(() => {
      fireEvent.click(screen.getByTestId('flavor-section-button'));
    });
    await waitFor(() => {
      expect(mockedOnSectionClicked).toHaveBeenCalledWith('flavor');
    });
    act(() => {
      fireEvent.click(screen.getByTestId('framework-section-button'));
    });
    await waitFor(() => {
      expect(mockedOnSectionClicked).toHaveBeenCalledWith('framework');
    });

    act(() => {
      fireEvent.click(screen.getByTestId('editor-section-button'));
    });
    await waitFor(() => {
      expect(mockedOnSectionClicked).toHaveBeenCalledWith('editor');
    });
    act(() => {
      fireEvent.click(screen.getByTestId('access-section-button'));
    });
    await waitFor(() => {
      expect(mockedOnSectionClicked).toHaveBeenCalledWith('access');
    });
    act(() => {
      fireEvent.click(screen.getByTestId('volumes-section-button'));
    });
    await waitFor(() => {
      expect(mockedOnSectionClicked).toHaveBeenCalledWith('volumes');
    });
    act(() => {
      fireEvent.click(screen.getByTestId('labels-section-button'));
    });
    await waitFor(() => {
      expect(mockedOnSectionClicked).toHaveBeenCalledWith('labels');
    });
    act(() => {
      fireEvent.click(screen.getByTestId('sshKeys-section-button'));
    });
    await waitFor(() => {
      expect(mockedOnSectionClicked).toHaveBeenCalledWith('sshKey');
    });
  });
});
