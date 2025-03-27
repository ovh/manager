import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { mockManagerReactShellClient } from '@/__tests__/helpers/mockShellHelper';
import Guides from './Guides.component';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import {
  mockedGuideOnboarding,
  mockedGuides,
} from '@/__tests__/helpers/mocks/shared/guides';

describe('Guides component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockManagerReactShellClient();
    vi.mock('@/data/api/ai/guides/guide.api', () => ({
      getGuides: vi.fn(() => [mockedGuides, mockedGuideOnboarding]),
    }));
  });
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('renders the skeleton component while loading', async () => {
    render(<Guides />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('guide-skeleton')).toBeTruthy();
    });
  });
  it('renders the guide button, open with ctrl+k and close', async () => {
    render(<Guides />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('guide-open-button')).toBeTruthy();
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
      expect(screen.getByTestId('guide-header')).toBeTruthy();
    });
    act(() => {
      fireEvent.keyDown(screen.getByTestId('guide-header'), {
        key: 'Escape',
        code: 'Escape',
      });
    });
    await waitFor(() => {
      expect(screen.queryByTestId('guide-header')).toBeNull();
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
      expect(screen.getByTestId('guide-open-button')).toBeTruthy();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('guide-open-button'));
    });
    await waitFor(() => {
      expect(screen.getByTestId('guide-header')).toBeTruthy();
      expect(screen.getByTestId(mockedGuides.url)).toBeTruthy();
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
