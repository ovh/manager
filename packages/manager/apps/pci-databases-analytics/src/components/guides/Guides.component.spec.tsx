import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import Guides from '@/components/guides/Guides.component';
import { RouterWithQueryClientWrapper } from '../../__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import {
  mockedGuide,
  mockedGuideOnboarding,
} from '../../__tests__/helpers/mocks/guides';

vi.mock('@/data/api/guides/guides.api', () => ({
  getGuides: vi.fn(() => [mockedGuide, mockedGuideOnboarding]),
}));

describe('Guides component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
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
      expect(screen.getByTestId(mockedGuide.url)).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId(mockedGuide.url));
    });
    await waitFor(() => {
      expect(window.open).toHaveBeenCalledWith(
        mockedGuide.url,
        '_blank',
        'noopener,noreferrer',
      );
    });
  });
});
