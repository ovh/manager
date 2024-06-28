import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TabsMenu, { Tab } from '@/components/tabs-menu';
import { RouterWithQueryClientWrapper } from '../helpers/wrappers/RouterWithQueryClientWrapper';

function setup(tabs: Tab[] = []) {
  return render(<TabsMenu tabs={tabs} />, {
    wrapper: RouterWithQueryClientWrapper,
  });
}

describe('TabsMenu component', () => {
  beforeEach(() => {
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
  it('renders skeletons correctly', async () => {
    render(<TabsMenu.Skeleton />);
    expect(screen.getByTestId('skeleton-container')).toBeInTheDocument();
  });

  it('renders correctly with no tabs', () => {
    setup();
    const scrollArea = screen.getByTestId('tab-container');
    expect(scrollArea).toBeEmptyDOMElement();
  });

  it('renders tabs with labels and optional count badges', () => {
    const tabs = [
      { href: '/tab1', label: 'Tab 1', count: 10 },
      { href: '/tab2', label: 'Tab 2' },
      { href: '/tab3', label: 'Tab 3', count: 5 },
    ];
    setup(tabs);

    tabs.forEach((tab) => {
      const link = screen.getByText(tab.label);
      expect(link).toBeInTheDocument();
      if (tab.count) {
        const badge = screen.getAllByText(tab.count.toString())[0];
        expect(badge).toBeInTheDocument();
      }
    });
  });

  it('handles scroll on wheel event', async () => {
    const tabs = [
      { href: '/tab1', label: 'Tab 1', count: 10 },
      { href: '/tab2', label: 'Tab 2' },
      { href: '/tab3', label: 'Tab 3', count: 5 },
      { href: '/tab4', label: 'Tab 4', count: 20 },
    ];
    setup(tabs);
    const scrollArea = screen.getByTestId('scrollbar');
    const scrollLeftInitial = scrollArea.children[1].scrollLeft;

    fireEvent.wheel(scrollArea, { deltaY: 50 });
    await waitFor(() => {
      expect(scrollArea.children[1].scrollLeft).not.toBe(scrollLeftInitial);
    });
  });

  it('active tab gets scrolled into view on click', async () => {
    const scrollMock = vi.fn();
    window.HTMLElement.prototype.scrollIntoView = scrollMock;
    const tabs = [
      { href: '/', label: 'Tab 1', count: 10 },
      { href: '/tab2', label: 'Tab 2' },
      { href: '/tab3', label: 'Tab 3', count: 5 },
    ];
    setup(tabs);
    const tab1 = screen.getByText('Tab 1').closest('span');

    await userEvent.click(tab1);

    await waitFor(() => {
      expect(scrollMock).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'center',
      });
    });
  });
});
