import {
  describe,
  expect,
  it,
  vi,
  beforeEach,
  type MockInstance,
} from 'vitest';
import {
  ODS_ICON_NAME,
  ODS_POPOVER_POSITION,
  ODS_BUTTON_VARIANT,
} from '@ovhcloud/ods-components';
import { ActionMenu } from '../ActionMenu.component';
import { render } from '../../../utils/test.provider';
import { useAuthorizationIam } from '../../../hooks/iam';

vi.mock('../../../hooks/iam');

const mockUseAuthorizationIam = useAuthorizationIam as unknown as MockInstance;

describe('ActionMenu Snapshot Tests', () => {
  const baseItems = [
    {
      id: 1,
      onClick: vi.fn(),
      label: 'Action 1',
      urn: 'urn:v18:eu:resource:m--components:vrz-a878-dsflkds-fdsfdsfdsf',
      iamActions: ['vrackServices:apiovh:iam/resource/tag/remove'],
    },
    {
      id: 2,
      href: 'https://www.ovhcloud.com',
      target: '_blank',
      label: 'External Link',
    },
    {
      id: 3,
      onClick: vi.fn(),
      label: 'Simple Button',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuthorizationIam.mockReturnValue({
      isAuthorized: true,
      isLoading: false,
      isFetched: true,
    });
  });

  describe('Default rendering', () => {
    it('should match snapshot with default props', () => {
      const { container } = render(
        <ActionMenu
          id="test-action-menu"
          data-testid="navigation-action-trigger-action"
          items={baseItems}
        />,
      );
      expect(container.firstChild).toMatchSnapshot('default-props');
    });

    it('should match snapshot with minimal props', () => {
      const minimalItems = [
        {
          id: 1,
          label: 'Simple Action',
        },
      ];

      const { container } = render(
        <ActionMenu id="minimal-menu" items={minimalItems} />,
      );
      expect(container.firstChild).toMatchSnapshot('minimal-props');
    });
  });

  describe('Compact mode', () => {
    it('should match snapshot in compact mode', () => {
      const { container } = render(
        <ActionMenu id="compact-menu" items={baseItems} isCompact={true} />,
      );
      expect(container.firstChild).toMatchSnapshot('compact-mode');
    });

    it('should match snapshot with custom icon', () => {
      const { container } = render(
        <ActionMenu
          id="custom-icon-menu"
          items={baseItems}
          icon={ODS_ICON_NAME.plus}
        />,
      );
      expect(container.firstChild).toMatchSnapshot('custom-icon');
    });
  });

  describe('Button variants', () => {
    it('should match snapshot with outline variant', () => {
      const { container } = render(
        <ActionMenu
          id="outline-variant"
          items={baseItems}
          variant={ODS_BUTTON_VARIANT.outline}
        />,
      );
      expect(container.firstChild).toMatchSnapshot('outline-variant');
    });

    it('should match snapshot with ghost variant', () => {
      const { container } = render(
        <ActionMenu
          id="ghost-variant"
          items={baseItems}
          variant={ODS_BUTTON_VARIANT.ghost}
        />,
      );
      expect(container.firstChild).toMatchSnapshot('ghost-variant');
    });
  });

  describe('States', () => {
    it('should match snapshot when disabled', () => {
      const { container } = render(
        <ActionMenu id="disabled-menu" items={baseItems} isDisabled={true} />,
      );
      expect(container.firstChild).toMatchSnapshot('disabled-state');
    });

    it('should match snapshot when loading', () => {
      const { container } = render(
        <ActionMenu id="loading-menu" items={baseItems} isLoading={true} />,
      );
      expect(container.firstChild).toMatchSnapshot('loading-state');
    });
  });

  describe('Custom labels', () => {
    it('should match snapshot with custom label', () => {
      const { container } = render(
        <ActionMenu
          id="custom-label-menu"
          items={baseItems}
          label="Custom Actions"
        />,
      );
      expect(container.firstChild).toMatchSnapshot('custom-label');
    });
  });

  describe('Popover positions', () => {
    it('should match snapshot with top position', () => {
      const { container } = render(
        <ActionMenu
          id="top-position-menu"
          items={baseItems}
          popoverPosition={ODS_POPOVER_POSITION.top}
        />,
      );
      expect(container.firstChild).toMatchSnapshot('top-position');
    });

    it('should match snapshot with right position', () => {
      const { container } = render(
        <ActionMenu
          id="right-position-menu"
          items={baseItems}
          popoverPosition={ODS_POPOVER_POSITION.right}
        />,
      );
      expect(container.firstChild).toMatchSnapshot('right-position');
    });
  });

  describe('Edge cases', () => {
    it('should match snapshot with empty items array', () => {
      const { container } = render(<ActionMenu id="empty-menu" items={[]} />);
      expect(container.firstChild).toMatchSnapshot('empty-items');
    });

    it('should match snapshot with single item', () => {
      const singleItem = [
        {
          id: 1,
          label: 'Single Action',
          onClick: vi.fn(),
        },
      ];

      const { container } = render(
        <ActionMenu id="single-item-menu" items={singleItem} />,
      );
      expect(container.firstChild).toMatchSnapshot('single-item');
    });
  });

  describe('IAM authorization states', () => {
    it('should match snapshot when IAM is not authorized', () => {
      mockUseAuthorizationIam.mockReturnValue({
        isAuthorized: false,
        isLoading: false,
        isFetched: true,
      });

      const iamItems = [
        {
          id: 1,
          onClick: vi.fn(),
          label: 'Unauthorized Action',
          urn: 'urn:v18:eu:resource:m--components:test',
          iamActions: ['test:action:read'],
        },
      ];

      const { container } = render(
        <ActionMenu id="iam-unauthorized-menu" items={iamItems} />,
      );
      expect(container.firstChild).toMatchSnapshot('iam-unauthorized-state');
    });
  });
});
