import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { Locale } from '@/hooks/useLocale';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedStatusVolume } from '@/__tests__/helpers/mocks/volume';
import DataSyncModal from './DataSync.component';
import { handleSelectOption } from '@/__tests__/helpers/unitTestHelper';

const onSubmit = vi.fn();
describe('Data Sync Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    // Mock necessary hooks and dependencies
    vi.mock('react-i18next', () => ({
      useTranslation: () => ({
        t: (key: string) => key,
      }),
    }));

    vi.mock('react-router-dom', async () => {
      const mod = await vi.importActual('react-router-dom');
      return {
        ...mod,
        useParams: vi.fn(),
      };
    });

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
        useNavigation: () => ({
          getURL: vi.fn(
            (app: string, path: string) => `#mockedurl-${app}${path}`,
          ),
        }),
      };
    });
    const mockScrollIntoView = vi.fn();
    window.HTMLElement.prototype.scrollIntoView = mockScrollIntoView;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders Data Sync component', async () => {
    render(
      <DataSyncModal
        onSubmitSync={onSubmit}
        pending={true}
        volume={mockedStatusVolume}
      />,
      { wrapper: RouterWithQueryClientWrapper },
    );
    expect(screen.getByTestId('datasync-modal')).toBeInTheDocument();
    expect(
      screen.getByText('dataSyncMountPathAlertDescription'),
    ).toBeInTheDocument();
  });

  it('renders Data sync Component', async () => {
    render(<DataSyncModal onSubmitSync={onSubmit} pending={false} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    expect(screen.getByTestId('datasync-modal')).toBeInTheDocument();
    expect(
      screen.getByText('dataSyncGlobalAlertDescription'),
    ).toBeInTheDocument();
  });

  it('expect submit button to be disabled', async () => {
    render(<DataSyncModal onSubmitSync={onSubmit} pending={true} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    expect(screen.getByTestId('datasync-modal')).toBeInTheDocument();
    act(() => {
      fireEvent.click(screen.getByTestId('datasync-submit-button'));
    });
    await waitFor(() => {
      expect(screen.getByTestId('datasync-submit-button')).toBeInTheDocument();
      expect(screen.getByTestId('datasync-submit-button')).toBeDisabled();
    });
  });

  it('trigger onSuccess on summit click', async () => {
    render(<DataSyncModal onSubmitSync={onSubmit} pending={false} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    expect(screen.getByTestId('datasync-modal')).toBeInTheDocument();
    await handleSelectOption('select-datasync-trigger', 'push');

    act(() => {
      fireEvent.click(screen.getByTestId('datasync-submit-button'));
    });
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith('push');
    });
  });
});
