import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';

import Guides from './Guides.component';

import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';

import { Locale } from '@/hooks/useLocale';
import {
  mockedGuideOnboarding,
  mockedGuides,
} from '@/__tests__/helpers/mocks/guides';

describe('Guides component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();

    // Mock necessary hooks and dependencies
    vi.mock('react-i18next', () => ({
      useTranslation: () => ({
        t: (key: string) => key,
      }),
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

    vi.mock('@/data/api/ai/guide.api', () => ({
      getGuides: vi.fn(() => [mockedGuides, mockedGuideOnboarding]),
    }));

    const ResizeObserverMock = vi.fn(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));
    vi.stubGlobal('ResizeObserver', ResizeObserverMock);
  });
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('renders the skeleton component while loading', async () => {
    render(<Guides />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('guide-skeleton')).toBeInTheDocument();
    });
  });
  it('renders the guide button, open with ctrl+k and close', async () => {
    render(<Guides />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('guide-open-button')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
    });
    const trigger = screen.getByTestId('guide-open-button');
    fireEvent.keyDown(trigger, {
      key: 'k',
      ctrlKey: true,
    });
    await waitFor(() => {
      expect(screen.getByTestId('guide-header')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.keyDown(screen.getByTestId('guide-header'), {
        key: 'Escape',
        code: 'Escape',
      });
    });
    await waitFor(() => {
      expect(screen.queryByTestId('guide-header')).not.toBeInTheDocument();
    });
  });
  it('open the guide component on button click and click on a guide', async () => {
    Object.assign(window, {
      open: vi.fn().mockImplementation(() => Promise.resolve()),
    });
    const mockedOnGuideClick = vi.fn();
    render(<Guides onGuideClick={mockedOnGuideClick} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.getByTestId('guide-open-button')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('guide-open-button'));
    });
    await waitFor(() => {
      expect(screen.getByTestId('guide-header')).toBeInTheDocument();
      expect(screen.getByTestId(mockedGuides.url)).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId(mockedGuides.url));
    });
    await waitFor(() => {
      expect(window.open).toHaveBeenCalledWith(
        mockedGuides.url,
        '_blank',
        'noopener,noreferrer',
      );
    });
  });
});
