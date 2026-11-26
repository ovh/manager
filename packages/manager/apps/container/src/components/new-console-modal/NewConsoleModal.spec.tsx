import { vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NewConsoleModal } from './NewConsoleModal.component';
import { NEW_CONSOLE_MODAL_PREFERENCE_KEY } from './newConsoleModal.constants';

const DAY_IN_MS = 24 * 60 * 60 * 1000;

const mocks = vi.hoisted(() => ({
  isFeatureAvailable: true,
  preference: null as null | { lastShowDate: number; lastChoice: string },
  notifyModalActionDone: vi.fn(),
  trackClick: vi.fn(),
  trackPage: vi.fn(),
  get: vi.fn(),
  put: vi.fn(),
  post: vi.fn(),
}));

vi.mock('@ovh-ux/manager-react-components', () => ({
  useFeatureAvailability: () => ({
    data: { 'pnr:beta-manager': mocks.isFeatureAvailable },
    isFetched: true,
  }),
}));

vi.mock('@ovh-ux/manager-core-api', () => ({
  v6: { get: mocks.get, put: mocks.put, post: mocks.post },
}));

vi.mock('@/context', () => ({
  useShell: () => ({
    getPlugin: (plugin: string) =>
      plugin === 'ux'
        ? { notifyModalActionDone: mocks.notifyModalActionDone }
        : { trackClick: mocks.trackClick, trackPage: mocks.trackPage },
  }),
}));

const renderComponent = () =>
  render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
    >
      <NewConsoleModal />
    </QueryClientProvider>,
  );

describe('NewConsoleModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.isFeatureAvailable = true;
    mocks.preference = null;
    mocks.get.mockImplementation(() =>
      mocks.preference
        ? Promise.resolve({
            data: { value: JSON.stringify(mocks.preference) },
          })
        : Promise.reject({ response: { status: 404 } }),
    );
    mocks.put.mockResolvedValue({});
    mocks.post.mockResolvedValue({});
  });

  it('is displayed when the user has never answered it', async () => {
    renderComponent();
    expect(await screen.findByTestId('new-console-modal')).toBeInTheDocument();
    expect(mocks.trackPage).toHaveBeenCalled();
  });

  it('is displayed again once 24 hours have elapsed', async () => {
    mocks.preference = {
      lastShowDate: Date.now() - DAY_IN_MS - 1000,
      lastChoice: 'close',
    };
    renderComponent();
    expect(await screen.findByTestId('new-console-modal')).toBeInTheDocument();
  });

  it('is skipped when it was answered less than 24 hours ago', async () => {
    mocks.preference = {
      lastShowDate: Date.now() - DAY_IN_MS + 60 * 1000,
      lastChoice: 'close',
    };
    renderComponent();
    await waitFor(() =>
      expect(mocks.notifyModalActionDone).toHaveBeenCalledWith('NewConsoleModal'),
    );
    expect(screen.queryByTestId('new-console-modal')).not.toBeInTheDocument();
  });

  it('is skipped when the new Console is not available', async () => {
    mocks.isFeatureAvailable = false;
    renderComponent();
    await waitFor(() =>
      expect(mocks.notifyModalActionDone).toHaveBeenCalledWith('NewConsoleModal'),
    );
    expect(mocks.get).not.toHaveBeenCalled();
    expect(screen.queryByTestId('new-console-modal')).not.toBeInTheDocument();
  });

  it('creates the preference on first close', async () => {
    renderComponent();
    fireEvent.click(await screen.findByTestId('new-console-modal-close'));

    await waitFor(() =>
      expect(mocks.notifyModalActionDone).toHaveBeenCalledWith('NewConsoleModal'),
    );
    expect(mocks.put).not.toHaveBeenCalled();
    const [url, payload] = mocks.post.mock.calls[0];
    expect(url).toBe('/me/preferences/manager');
    expect(payload.key).toBe(NEW_CONSOLE_MODAL_PREFERENCE_KEY);
    expect(JSON.parse(payload.value)).toMatchObject({ lastChoice: 'close' });
    expect(screen.queryByTestId('new-console-modal')).not.toBeInTheDocument();
  });

  it('updates the existing preference and opens the new Console on CTA click', async () => {
    mocks.preference = {
      lastShowDate: Date.now() - 2 * DAY_IN_MS,
      lastChoice: 'close',
    };
    const assign = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { ...window.location, assign },
      writable: true,
    });

    renderComponent();
    fireEvent.click(await screen.findByTestId('new-console-modal-discover'));

    await waitFor(() => expect(assign).toHaveBeenCalledWith('/beta/#/'));
    expect(mocks.post).not.toHaveBeenCalled();
    const [url, payload] = mocks.put.mock.calls[0];
    expect(url).toBe(`/me/preferences/manager/${NEW_CONSOLE_MODAL_PREFERENCE_KEY}`);
    expect(JSON.parse(payload.value)).toMatchObject({ lastChoice: 'discover' });
  });
});
