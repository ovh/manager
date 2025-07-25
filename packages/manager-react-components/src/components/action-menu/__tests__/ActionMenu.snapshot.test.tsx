import {
  describe,
  expect,
  it,
  vi,
  beforeEach,
  type MockInstance,
} from 'vitest';
import { act, screen, fireEvent } from '@testing-library/react';
import {
  ODS_ICON_NAME,
  ODS_POPOVER_POSITION,
  ODS_BUTTON_VARIANT,
} from '@ovhcloud/ods-components';
import { ActionMenu } from '../index';
import { render } from '../../../utils/test.provider';
import { useAuthorizationIam } from '../../../hooks/iam';

// Mock the IAM hook
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
      onClick: vi.fn(),
      label: 'Action 2',
      urn: 'urn:v18:eu:resource:m--components:vrz-a878-dsflkds-fdsfdsfdsf',
      iamActions: ['vrackServices:apiovh:iam/resource/tag/remove'],
    },
    {
      id: 3,
      href: 'https://www.ovhcloud.com',
      target: '_blank',
      label: 'External Link',
    },
    {
      id: 4,
      href: `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify({ name: 'john' }),
      )}`,
      download: 'test.json',
      target: '_blank',
      label: 'Download File',
    },
    {
      id: 5,
      href: 'https://ovhcloud.com',
      target: '_blank',
      label: 'Disabled Link',
      isDisabled: true,
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
        <div data-testid="navigation-action-trigger-action">
          <ActionMenu id="test-action-menu" items={baseItems} />
        </div>,
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
        <div data-testid="navigation-action-trigger-action">
          <ActionMenu id="minimal-menu" items={minimalItems} />
        </div>,
      );
      expect(container.firstChild).toMatchSnapshot('minimal-props');
    });
  });

  describe('Compact mode', () => {
    it('should match snapshot in compact mode', () => {
      const { container } = render(
        <div data-testid="navigation-action-trigger-action">
          <ActionMenu id="compact-menu" items={baseItems} isCompact={true} />
        </div>,
      );
      expect(container.firstChild).toMatchSnapshot('compact-mode');
    });

    it('should match snapshot in compact mode with custom icon', () => {
      const { container } = render(
        <div data-testid="navigation-action-trigger-action">
          <ActionMenu
            id="compact-custom-icon"
            items={baseItems}
            isCompact={true}
            icon={ODS_ICON_NAME.ellipsisHorizontal}
          />
        </div>,
      );
      expect(container.firstChild).toMatchSnapshot('compact-mode-custom-icon');
    });
  });

  describe('Button variants', () => {
    it('should match snapshot with outline variant', () => {
      const { container } = render(
        <div data-testid="navigation-action-trigger-action">
          <ActionMenu
            id="outline-variant"
            items={baseItems}
            variant={ODS_BUTTON_VARIANT.outline}
          />
        </div>,
      );
      expect(container.firstChild).toMatchSnapshot('outline-variant');
    });

    it('should match snapshot with ghost variant', () => {
      const { container } = render(
        <div data-testid="navigation-action-trigger-action">
          <ActionMenu
            id="ghost-variant"
            items={baseItems}
            variant={ODS_BUTTON_VARIANT.ghost}
          />
        </div>,
      );
      expect(container.firstChild).toMatchSnapshot('ghost-variant');
    });

    it('should match snapshot with default variant', () => {
      const { container } = render(
        <div data-testid="navigation-action-trigger-action">
          <ActionMenu
            id="default-variant"
            items={baseItems}
            variant={ODS_BUTTON_VARIANT.default}
          />
        </div>,
      );
      expect(container.firstChild).toMatchSnapshot('default-variant');
    });
  });

  describe('States', () => {
    it('should match snapshot when disabled', () => {
      const { container } = render(
        <div data-testid="navigation-action-trigger-action">
          <ActionMenu id="disabled-menu" items={baseItems} isDisabled={true} />
        </div>,
      );
      expect(container.firstChild).toMatchSnapshot('disabled-state');
    });

    it('should match snapshot when loading', () => {
      const { container } = render(
        <div data-testid="navigation-action-trigger-action">
          <ActionMenu id="loading-menu" items={baseItems} isLoading={true} />
        </div>,
      );
      expect(container.firstChild).toMatchSnapshot('loading-state');
    });

    it('should match snapshot when disabled and loading', () => {
      const { container } = render(
        <div data-testid="navigation-action-trigger-action">
          <ActionMenu
            id="disabled-loading-menu"
            items={baseItems}
            isDisabled={true}
            isLoading={true}
          />
        </div>,
      );
      expect(container.firstChild).toMatchSnapshot('disabled-loading-state');
    });
  });

  describe('Custom labels and icons', () => {
    it('should match snapshot with custom label', () => {
      const { container } = render(
        <div data-testid="navigation-action-trigger-action">
          <ActionMenu
            id="custom-label-menu"
            items={baseItems}
            label="Custom Actions"
          />
        </div>,
      );
      expect(container.firstChild).toMatchSnapshot('custom-label');
    });

    it('should match snapshot with custom icon', () => {
      const { container } = render(
        <div data-testid="navigation-action-trigger-action">
          <ActionMenu
            id="custom-icon-menu"
            items={baseItems}
            icon={ODS_ICON_NAME.plus}
          />
        </div>,
      );
      expect(container.firstChild).toMatchSnapshot('custom-icon');
    });

    it('should match snapshot with custom label and icon', () => {
      const { container } = render(
        <div data-testid="navigation-action-trigger-action">
          <ActionMenu
            id="custom-label-icon-menu"
            items={baseItems}
            label="Settings"
            icon={ODS_ICON_NAME.plus}
          />
        </div>,
      );
      expect(container.firstChild).toMatchSnapshot('custom-label-and-icon');
    });
  });

  describe('Popover positions', () => {
    it('should match snapshot with top position', () => {
      const { container } = render(
        <div data-testid="navigation-action-trigger-action">
          <ActionMenu
            id="top-position-menu"
            items={baseItems}
            popoverPosition={ODS_POPOVER_POSITION.top}
          />
        </div>,
      );
      act(() => {
        const actionMenuIcon = screen.getByTestId(
          'navigation-action-trigger-action',
        );
        fireEvent.click(actionMenuIcon);
      });
      expect(container.firstChild).toMatchSnapshot('top-position');
    });

    it('should match snapshot with right position', () => {
      const { container } = render(
        <div data-testid="navigation-action-trigger-action">
          <ActionMenu
            id="right-position-menu"
            items={baseItems}
            popoverPosition={ODS_POPOVER_POSITION.right}
          />
        </div>,
      );
      act(() => {
        const actionMenuIcon = screen.getByTestId(
          'navigation-action-trigger-action',
        );
        fireEvent.click(actionMenuIcon);
      });
      expect(container.firstChild).toMatchSnapshot('right-position');
    });

    it('should match snapshot with left position', () => {
      const { container } = render(
        <div data-testid="navigation-action-trigger-action">
          <ActionMenu
            id="left-position-menu"
            items={baseItems}
            popoverPosition={ODS_POPOVER_POSITION.left}
          />
        </div>,
      );
      act(() => {
        const actionMenuIcon = screen.getByTestId(
          'navigation-action-trigger-action',
        );
        fireEvent.click(actionMenuIcon);
      });
      expect(container.firstChild).toMatchSnapshot('left-position');
    });
  });

  describe('Item variations', () => {
    it('should match snapshot with only link items', () => {
      const linkOnlyItems = [
        {
          id: 1,
          href: 'https://example.com',
          label: 'External Link',
          target: '_blank',
        },
        {
          id: 2,
          href: '/internal-link',
          label: 'Internal Link',
        },
      ];

      const { container } = render(
        <div data-testid="navigation-action-trigger-action">
          <ActionMenu id="link-only-menu" items={linkOnlyItems} />
        </div>,
      );
      expect(container.firstChild).toMatchSnapshot('link-only-items');
    });

    it('should match snapshot with only button items', () => {
      const buttonOnlyItems = [
        {
          id: 1,
          onClick: vi.fn(),
          label: 'Button Action 1',
        },
        {
          id: 2,
          onClick: vi.fn(),
          label: 'Button Action 2',
          isDisabled: true,
        },
      ];

      const { container } = render(
        <div data-testid="navigation-action-trigger-action">
          <ActionMenu id="button-only-menu" items={buttonOnlyItems} />
        </div>,
      );
      expect(container.firstChild).toMatchSnapshot('button-only-items');
    });

    it('should match snapshot with IAM protected items', () => {
      const iamItems = [
        {
          id: 1,
          onClick: vi.fn(),
          label: 'IAM Protected Action',
          urn: 'urn:v18:eu:resource:m--components:test',
          iamActions: ['test:action:read'],
        },
        {
          id: 2,
          onClick: vi.fn(),
          label: 'Another IAM Action',
          urn: 'urn:v18:eu:resource:m--components:test',
          iamActions: ['test:action:write'],
        },
      ];

      const { container } = render(
        <div data-testid="navigation-action-trigger-action">
          <ActionMenu id="iam-menu" items={iamItems} />
        </div>,
      );
      expect(container.firstChild).toMatchSnapshot('iam-protected-items');
    });

    it('should match snapshot with mixed item types', () => {
      const mixedItems = [
        {
          id: 1,
          onClick: vi.fn(),
          label: 'Button Action',
        },
        {
          id: 2,
          href: 'https://example.com',
          label: 'External Link',
          target: '_blank',
        },
        {
          id: 3,
          onClick: vi.fn(),
          label: 'IAM Protected',
          urn: 'urn:v18:eu:resource:m--components:test',
          iamActions: ['test:action:read'],
        },
        {
          id: 4,
          href: '/download',
          download: 'file.pdf',
          label: 'Download',
        },
      ];

      const { container } = render(
        <div data-testid="navigation-action-trigger-action">
          <ActionMenu id="mixed-menu" items={mixedItems} />
        </div>,
      );
      act(() => {
        const actionMenuIcon = screen.getByTestId(
          'navigation-action-trigger-action',
        );
        fireEvent.click(actionMenuIcon);
      });
      expect(container.firstChild).toMatchSnapshot('mixed-item-types');
    });
  });

  describe('Edge cases', () => {
    it('should match snapshot with empty items array', () => {
      const { container } = render(
        <div data-testid="navigation-action-trigger-action">
          <ActionMenu id="empty-menu" items={[]} />
        </div>,
      );
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
        <div data-testid="navigation-action-trigger-action">
          <ActionMenu id="single-item-menu" items={singleItem} />
        </div>,
      );
      expect(container.firstChild).toMatchSnapshot('single-item');
    });

    it('should match snapshot with many items', () => {
      const manyItems = Array.from({ length: 10 }, (_, index) => ({
        id: index + 1,
        label: `Action ${index + 1}`,
        onClick: vi.fn(),
      }));

      const { container } = render(
        <div data-testid="navigation-action-trigger-action">
          <ActionMenu id="many-items-menu" items={manyItems} />
        </div>,
      );
      expect(container.firstChild).toMatchSnapshot('many-items');
    });
  });

  describe('IAM authorization states', () => {
    it('should match snapshot when IAM is loading', () => {
      mockUseAuthorizationIam.mockReturnValue({
        isAuthorized: false,
        isLoading: true,
        isFetched: false,
      });

      const iamItems = [
        {
          id: 1,
          onClick: vi.fn(),
          label: 'IAM Action',
          urn: 'urn:v18:eu:resource:m--components:test',
          iamActions: ['test:action:read'],
        },
      ];

      const { container } = render(
        <div data-testid="navigation-action-trigger-action">
          <ActionMenu id="iam-loading-menu" items={iamItems} />
        </div>,
      );
      expect(container.firstChild).toMatchSnapshot('iam-loading-state');
    });

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
        <div data-testid="navigation-action-trigger-action">
          <ActionMenu id="iam-unauthorized-menu" items={iamItems} />
        </div>,
      );
      expect(container.firstChild).toMatchSnapshot('iam-unauthorized-state');
    });
  });
});
