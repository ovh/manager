import { describe, vi } from 'vitest';
import { render } from '@testing-library/react';
import { TabsComponent } from './Tabs.component';

type TProps<Item> = {
  id: string;
  items?: Item[];
  titleElement?: (item: Item, selected: boolean) => JSX.Element;
  contentElement?: (item: Item) => JSX.Element;
  mobileBreakPoint?: number;
  className?: string;
};

const id = 'id';

const renderTabs = (props: TProps<string>) =>
  render(<TabsComponent {...props} />);

const mocks = vi.hoisted(() => {
  return {
    useMedia: vi.fn(),
  };
});

vi.mock('react-use', () => {
  return {
    useMedia: mocks.useMedia,
  };
});

describe('TabsComponent', () => {
  describe('Desktop view', () => {
    it('should render desktop view if view is desktop', () => {
      mocks.useMedia.mockReturnValue(true);
      const { queryByTestId } = renderTabs({ id });

      expect(queryByTestId('desktop')).toBeInTheDocument();
      expect(queryByTestId('mobile')).not.toBeInTheDocument();
    });
  });
  describe('Mobile view', () => {
    it('should render mobile view if view is mobile', () => {
      mocks.useMedia.mockReturnValue(false);
      const { queryByTestId } = renderTabs({ id });

      expect(queryByTestId('mobile')).toBeInTheDocument();
      expect(queryByTestId('desktop')).not.toBeInTheDocument();
    });
  });
});
