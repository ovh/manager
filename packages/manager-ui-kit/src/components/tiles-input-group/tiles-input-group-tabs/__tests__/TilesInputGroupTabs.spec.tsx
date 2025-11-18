import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { render } from '@/commons/tests-utils/Render.utils';

import { TilesInputGroupTabs } from '../TilesInputGroupTabs.component';

describe('TilesInputGroupTabs Component', () => {
  const mockItems = ['tab1', 'tab2', 'tab3'];
  const mockOnChange = vi.fn();

  describe('Basic rendering', () => {
    it('should render the component with default items', () => {
      render(<TilesInputGroupTabs items={mockItems} />);

      // Check that tabs are rendered
      expect(screen.getAllByText('tab1')[0]).toBeInTheDocument();
      expect(screen.getByText('tab2')).toBeInTheDocument();
      expect(screen.getByText('tab3')).toBeInTheDocument();

      // Check that the first tab content is displayed by default
      expect(screen.getAllByText('tab1')).toHaveLength(2); // One in tab, one in content
    });

    it('should use the first item as the default selected tab', () => {
      render(<TilesInputGroupTabs items={mockItems} />);

      // The first tab should be selected by default
      const firstTab = screen.getAllByText('tab1')?.[0]?.closest?.('button');
      expect(firstTab).toHaveAttribute('aria-selected', 'true');
    });

    it('should display the content of the first tab by default', () => {
      render(<TilesInputGroupTabs items={mockItems} />);

      // Should show content for the first tab
      const contentArea = screen.getAllByText('tab1', { selector: 'div' })[0];
      expect(contentArea).toBeInTheDocument();
    });

    it('should apply the custom CSS class', () => {
      const customClass = 'custom-tabs-class';
      const { container } = render(
        <TilesInputGroupTabs items={mockItems} className={customClass} />,
      );

      const div = container.querySelector('div');
      expect(div).toHaveClass(customClass);
    });
  });

  describe('Optional props handling', () => {
    it('should handle an empty items array', () => {
      render(<TilesInputGroupTabs items={[]} />);

      // Should render without crashing
      expect(screen.getByRole('tablist')).toBeInTheDocument();
    });

    it('should use default functions for titleElement and contentElement', () => {
      render(<TilesInputGroupTabs items={mockItems} />);

      // Should render default tab titles
      expect(screen.getAllByText('tab1')[0]).toBeInTheDocument();
      expect(screen.getByText('tab2')).toBeInTheDocument();
      expect(screen.getByText('tab3')).toBeInTheDocument();

      // Should render default content
      expect(screen.getAllByText('tab1')).toHaveLength(2);
    });
  });

  describe('Event handling', () => {
    it('should call onChange when a tab is selected', async () => {
      render(<TilesInputGroupTabs items={mockItems} onChange={mockOnChange} />);

      // Click on the second tab
      const secondTab = screen.getByText('tab2');
      await userEvent.click(secondTab);

      // Should call onChange with the selected item
      expect(mockOnChange).toBeCalled();
    });

    it('should not throw if onChange is not provided', () => {
      render(<TilesInputGroupTabs items={mockItems} />);

      const secondTab = screen.getByText('tab2');

      // The component should not throw even if onChange is not defined
      expect(async () => {
        await userEvent.click(secondTab);
      }).not.toThrow();
    });
  });

  describe('Accessibility and structure', () => {
    it('should have the correct HTML structure', () => {
      render(<TilesInputGroupTabs items={mockItems} />);
      expect(screen.getByRole('tablist')).toBeInTheDocument();
      const tabs = screen.getAllByRole('tab');
      expect(tabs).toHaveLength(3);
    });
  });

  describe('Custom element props', () => {
    it('should pass isSelected prop to titleElement', () => {
      const customTitleElement = vi.fn(
        ({ item, isSelected }: { item?: string; isSelected?: boolean }) => (
          <span data-testid={`custom-title-${item}`} data-selected={isSelected}>
            Custom {item}
          </span>
        ),
      );

      render(<TilesInputGroupTabs items={mockItems} titleElement={customTitleElement} />);

      // Check that the first tab (selected by default) has isSelected=true
      const firstTabTitle = screen.getByTestId('custom-title-tab1');
      expect(firstTabTitle).toHaveAttribute('data-selected', 'true');

      // Check that other tabs have isSelected=false
      const secondTabTitle = screen.getByTestId('custom-title-tab2');
      expect(secondTabTitle).toHaveAttribute('data-selected', 'false');
    });

    it('should render custom contentElement with selected item', () => {
      const customContentElement = vi.fn(({ item }: { item?: string }) => (
        <div data-testid={`custom-content-${item}`}>Custom content for {item}</div>
      ));

      render(<TilesInputGroupTabs items={mockItems} contentElement={customContentElement} />);

      // Should render content for the first tab (selected by default)
      expect(screen.getByTestId('custom-content-tab1')).toBeInTheDocument();
      expect(screen.getByText('Custom content for tab1')).toBeInTheDocument();
    });

    it('should update content when switching tabs', async () => {
      const customContentElement = vi.fn(({ item }: { item?: string }) => (
        <div data-testid={`custom-content-${item}`}>Custom content for {item}</div>
      ));

      render(<TilesInputGroupTabs items={mockItems} contentElement={customContentElement} />);

      // Initially should show content for first tab
      expect(screen.getByTestId('custom-content-tab1')).toBeInTheDocument();
      expect(screen.getByText('Custom content for tab1')).toBeInTheDocument();

      // Click on second tab
      const secondTab = screen.getByText('tab2');
      await userEvent.click(secondTab);

      // Should now show content for second tab
      expect(screen.getByTestId('custom-content-tab2')).toBeInTheDocument();
      expect(screen.getByText('Custom content for tab2')).toBeInTheDocument();
    });
  });
});
