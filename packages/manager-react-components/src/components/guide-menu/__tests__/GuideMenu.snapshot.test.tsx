import { vi } from 'vitest';
import { GuideMenu } from '../GuideMenu.component';
import { GuideMenuItem } from '../GuideMenu.props';
import { render } from '../../../utils/test.provider';

describe('GuideMenu', () => {
  const mockItems: GuideMenuItem[] = [
    {
      id: 1,
      href: 'https://help.ovhcloud.com/guides',
      target: '_blank',
      children: 'OVH Guides',
      onClick: vi.fn(),
    },
    {
      id: 2,
      href: 'https://docs.ovh.com',
      target: '_blank',
      children: 'Documentation',
      onClick: vi.fn(),
    },
  ];

  const defaultProps = {
    items: mockItems,
    isLoading: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GuideMenu snapshots', () => {
    it('should match snapshot with default props', () => {
      const { container } = render(<GuideMenu {...defaultProps} />);
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot with loading state', () => {
      const { container } = render(
        <GuideMenu {...defaultProps} isLoading={true} />,
      );
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot with empty items', () => {
      const { container } = render(<GuideMenu items={[]} isLoading={false} />);
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot with single item', () => {
      const singleItemProps = {
        items: [mockItems[0]],
        isLoading: false,
      };
      const { container } = render(<GuideMenu {...singleItemProps} />);
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot with multiple items', () => {
      const { container } = render(<GuideMenu {...defaultProps} />);
      expect(container).toMatchSnapshot();
    });
  });
});
