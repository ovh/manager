import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TabsComponent } from '../Tabs.component';

describe('TabsComponent', () => {
  const mockItems = ['tab1', 'tab2', 'tab3'];

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
      const customTitleElement = ({
        item,
        isSelected,
      }: {
        item?: string;
        isSelected?: boolean;
      }) => (
        <span data-testid={`custom-title-${item}`} data-selected={isSelected}>
          Custom {item}
        </span>
      );

      const { container } = render(
        <TabsComponent items={mockItems} titleElement={customTitleElement} />,
      );
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot with custom contentElement', () => {
      const customContentElement = ({ item }: { item?: string }) => (
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

      const customTitleElement = ({
        item,
        isSelected,
      }: {
        item?: CustomItem;
        isSelected?: boolean;
      }) => (
        <span data-testid={`title-${item?.id}`} data-selected={isSelected}>
          {item?.label}
        </span>
      );

      const customContentElement = ({ item }: { item?: CustomItem }) => (
        <div data-testid={`content-${item?.id}`}>{item?.content}</div>
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
});
