import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TabsComponent } from '../Tabs.component';

vi.mock('@ovhcloud/ods-react', () => ({
  Tabs: ({ children, onValueChange, value }: any) => (
    <div data-testid="ods-tabs" data-value={value}>
      {children}
      <button
        data-testid="change-tab"
        onClick={() => onValueChange({ value: 'tab2' })}
      >
        Change to tab2
      </button>
    </div>
  ),
  TabList: ({ children }: any) => (
    <div data-testid="ods-tab-list">{children}</div>
  ),
  Tab: ({ children, value }: any) => (
    <div data-testid={`tab-${value}`} data-value={value}>
      {children}
    </div>
  ),
}));

describe('TabsComponent', () => {
  const mockItems = ['tab1', 'tab2', 'tab3'];
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Snapshot tests', () => {
    it('should match snapshot with default props', () => {
      const { container } = render(<TabsComponent items={mockItems} />);
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot with empty items array', () => {
      const { container } = render(<TabsComponent items={[]} />);
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot with custom className', () => {
      const { container } = render(
        <TabsComponent items={mockItems} className="custom-class" />,
      );
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot with custom titleElement', () => {
      const customTitleElement = (item: string) => (
        <span data-testid={`custom-title-${item}`}>Custom {item}</span>
      );

      const { container } = render(
        <TabsComponent items={mockItems} titleElement={customTitleElement} />,
      );
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot with custom contentElement', () => {
      const customContentElement = (item: string) => (
        <div data-testid={`custom-content-${item}`}>
          Custom content for {item}
        </div>
      );

      const { container } = render(
        <TabsComponent
          items={mockItems}
          contentElement={customContentElement}
        />,
      );
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot with single item', () => {
      const { container } = render(<TabsComponent items={['single-tab']} />);
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot with custom item types', () => {
      interface CustomItem {
        id: string;
        label: string;
        content: string;
      }

      const customItems: CustomItem[] = [
        { id: '1', label: 'First', content: 'Content 1' },
        { id: '2', label: 'Second', content: 'Content 2' },
      ];

      const customTitleElement = (item: CustomItem) => (
        <span data-testid={`title-${item.id}`}>{item.label}</span>
      );

      const customContentElement = (item: CustomItem) => (
        <div data-testid={`content-${item.id}`}>{item.content}</div>
      );

      const { container } = render(
        <TabsComponent<CustomItem>
          items={customItems}
          titleElement={customTitleElement}
          contentElement={customContentElement}
        />,
      );
      expect(container).toMatchSnapshot();
    });
  });

  describe('Basic rendering', () => {
    it('should render the component with default items', () => {
      render(<TabsComponent items={mockItems} />);

      expect(screen.getByTestId('ods-tabs')).toBeInTheDocument();
      expect(screen.getByTestId('ods-tab-list')).toBeInTheDocument();
      expect(screen.getByTestId('tab-tab1')).toBeInTheDocument();
      expect(screen.getByTestId('tab-tab2')).toBeInTheDocument();
      expect(screen.getByTestId('tab-tab3')).toBeInTheDocument();
    });

    it('should use the first item as the default selected tab', () => {
      render(<TabsComponent items={mockItems} />);

      const tabsElement = screen.getByTestId('ods-tabs');
      expect(tabsElement).toHaveAttribute('data-value', 'tab1');
    });

    it('should display the content of the first tab by default', () => {
      render(<TabsComponent items={mockItems} />);

      expect(screen.getByText('content tab1')).toBeInTheDocument();
    });

    it('should apply the custom CSS class', () => {
      const customClass = 'custom-tabs-class';
      const { container } = render(
        <TabsComponent items={mockItems} className={customClass} />,
      );

      const section = container.querySelector('section');
      expect(section).toHaveClass(customClass);
    });
  });

  describe('Optional props handling', () => {
    it('should handle an empty items array', () => {
      render(<TabsComponent items={[]} />);

      expect(screen.getByTestId('ods-tabs')).toBeInTheDocument();
      expect(screen.getByTestId('ods-tab-list')).toBeInTheDocument();
    });

    it('should use default functions for titleElement and contentElement', () => {
      render(<TabsComponent items={mockItems} />);

      expect(screen.getByText('title tab1')).toBeInTheDocument();
      expect(screen.getByText('title tab2')).toBeInTheDocument();
      expect(screen.getByText('title tab3')).toBeInTheDocument();
      expect(screen.getByText('content tab1')).toBeInTheDocument();
    });
  });

  describe('Custom functions', () => {
    it('should use a custom titleElement', () => {
      const customTitleElement = (item: string, isSelected?: boolean) => (
        <span data-testid={`custom-title-${item}`} data-selected={isSelected}>
          Custom {item}
        </span>
      );

      render(
        <TabsComponent items={mockItems} titleElement={customTitleElement} />,
      );

      expect(screen.getByTestId('custom-title-tab1')).toBeInTheDocument();
      expect(screen.getByTestId('custom-title-tab1')).toHaveAttribute(
        'data-selected',
        'true',
      );
      expect(screen.getByTestId('custom-title-tab2')).toHaveAttribute(
        'data-selected',
        'false',
      );
      expect(screen.getByText('Custom tab1')).toBeInTheDocument();
      expect(screen.getByText('Custom tab2')).toBeInTheDocument();
      expect(screen.getByText('Custom tab3')).toBeInTheDocument();
    });

    it('should use a custom contentElement', () => {
      const customContentElement = (item: string) => (
        <div data-testid={`custom-content-${item}`}>
          Custom content for {item}
        </div>
      );

      render(
        <TabsComponent
          items={mockItems}
          contentElement={customContentElement}
        />,
      );

      expect(screen.getByTestId('custom-content-tab1')).toBeInTheDocument();
      expect(screen.getByText('Custom content for tab1')).toBeInTheDocument();
    });
  });

  describe('Event handling', () => {
    it('should call onChange when a tab is selected', () => {
      render(<TabsComponent items={mockItems} onChange={mockOnChange} />);

      const changeButton = screen.getByTestId('change-tab');
      fireEvent.click(changeButton);

      expect(mockOnChange).toHaveBeenCalledWith({ value: 'tab2' });
    });

    it('should not throw if onChange is not provided', () => {
      render(<TabsComponent items={mockItems} />);

      const changeButton = screen.getByTestId('change-tab');

      // The component should not throw even if onChange is not defined
      expect(() => {
        fireEvent.click(changeButton);
      }).not.toThrow();

      expect(screen.getByTestId('ods-tabs')).toBeInTheDocument();
    });
  });

  describe('Generics', () => {
    it('should work with custom item types', () => {
      interface CustomItem {
        id: string;
        label: string;
        content: string;
      }

      const customItems: CustomItem[] = [
        { id: '1', label: 'First', content: 'Content 1' },
        { id: '2', label: 'Second', content: 'Content 2' },
      ];

      const customTitleElement = (item: CustomItem) => (
        <span data-testid={`title-${item.id}`}>{item.label}</span>
      );

      const customContentElement = (item: CustomItem) => (
        <div data-testid={`content-${item.id}`}>{item.content}</div>
      );

      render(
        <TabsComponent<CustomItem>
          items={customItems}
          titleElement={customTitleElement}
          contentElement={customContentElement}
        />,
      );

      expect(screen.getByTestId('title-1')).toBeInTheDocument();
      expect(screen.getByTestId('title-2')).toBeInTheDocument();
      expect(screen.getByTestId('content-1')).toBeInTheDocument();
      expect(screen.getByText('First')).toBeInTheDocument();
      expect(screen.getByText('Content 1')).toBeInTheDocument();
    });
  });

  describe('Accessibility and structure', () => {
    it('should have the correct HTML structure', () => {
      const { container } = render(<TabsComponent items={mockItems} />);

      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();

      const contentDiv = container.querySelector(
        '.bg-\\[--ods-color-primary-050\\]',
      );
      expect(contentDiv).toBeInTheDocument();
      expect(contentDiv).toHaveClass(
        'border',
        'border-solid',
        'border-[--ods-color-primary-100]',
        'border-t-0',
      );
    });

    it('should have unique keys for each tab', () => {
      const { container } = render(<TabsComponent items={mockItems} />);

      const tabs = container.querySelectorAll('[data-testid^="tab-"]');
      expect(tabs).toHaveLength(3);

      const values = Array.from(tabs).map((tab) =>
        tab.getAttribute('data-value'),
      );
      expect(values).toEqual(['tab1', 'tab2', 'tab3']);
    });
  });

  describe('Edge cases', () => {
    it('should handle a single item', () => {
      render(<TabsComponent items={['single-tab']} />);

      expect(screen.getByTestId('tab-single-tab')).toBeInTheDocument();
      expect(screen.getByText('content single-tab')).toBeInTheDocument();
    });

    it('should handle items with null or undefined values', () => {
      const itemsWithNull = ['tab1', null, 'tab3'] as any[];

      render(<TabsComponent items={itemsWithNull} />);

      expect(screen.getByTestId('tab-tab1')).toBeInTheDocument();
      expect(screen.getByTestId('tab-null')).toBeInTheDocument();
      expect(screen.getByTestId('tab-tab3')).toBeInTheDocument();
    });
  });
});
