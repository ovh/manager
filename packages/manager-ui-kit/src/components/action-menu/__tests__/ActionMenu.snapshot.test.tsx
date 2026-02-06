import { act, fireEvent, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { BUTTON_VARIANT, ICON_NAME, POPOVER_POSITION } from '@ovhcloud/ods-react';

import { buildIamMock, mockUseAuthorizationIam } from '@/commons/tests-utils/Mock.utils';
import { renderActionMenu } from '@/commons/tests-utils/Render.utils';
import type { IamCheckResponse } from '@/hooks/iam/IAM.type';

describe('ActionMenu Snapshot Tests', () => {
  beforeEach(() => {
    mockUseAuthorizationIam.mockReturnValue(buildIamMock());
  });

  describe('Default rendering', () => {
    it('matches snapshot with default props', () => {
      const { container } = renderActionMenu({});
      expect(container.firstChild).toMatchSnapshot('default-props');
    });

    it('matches snapshot with minimal props', () => {
      const minimalItems = [{ id: 1, label: 'Simple Action' }];
      const { container } = renderActionMenu({ id: 'minimal-menu', items: minimalItems });
      expect(container.firstChild).toMatchSnapshot('minimal-props');
    });
  });

  describe('Compact mode', () => {
    it('matches snapshot in compact mode', () => {
      const { container } = renderActionMenu({ id: 'compact-menu', isCompact: true });
      expect(container.firstChild).toMatchSnapshot('compact-mode');
    });

    it('matches snapshot in compact mode with custom icon', () => {
      const { container } = renderActionMenu({
        id: 'compact-custom-icon',
        isCompact: true,
        icon: ICON_NAME.ellipsisHorizontal,
      });
      expect(container.firstChild).toMatchSnapshot('compact-mode-custom-icon');
    });
  });

  describe('Button variants', () => {
    it.each([
      ['outline-solid', BUTTON_VARIANT.outline],
      ['ghost', BUTTON_VARIANT.ghost],
      ['default', BUTTON_VARIANT.default],
    ])('matches snapshot with %s variant', (_, variant) => {
      const { container } = renderActionMenu({ id: `${variant}-variant`, variant });
      expect(container.firstChild).toMatchSnapshot(`${variant}-variant`);
    });
  });

  describe('States', () => {
    it.each([
      ['disabled', { isDisabled: true }],
      ['loading', { isLoading: true }],
      ['disabled-loading', { isDisabled: true, isLoading: true }],
    ])('matches snapshot when %s', (label, state) => {
      const { container } = renderActionMenu({ id: `${label}-menu`, ...state });
      expect(container.firstChild).toMatchSnapshot(`${label}-state`);
    });
  });

  describe('Custom labels and icons', () => {
    it('matches snapshot with custom label', () => {
      const { container } = renderActionMenu({ id: 'custom-label-menu', label: 'Custom Actions' });
      expect(container.firstChild).toMatchSnapshot('custom-label');
    });

    it('matches snapshot with custom icon', () => {
      const { container } = renderActionMenu({ id: 'custom-icon-menu', icon: ICON_NAME.plus });
      expect(container.firstChild).toMatchSnapshot('custom-icon');
    });

    it('matches snapshot with custom label and icon', () => {
      const { container } = renderActionMenu({
        id: 'custom-label-icon-menu',
        label: 'Settings',
        icon: ICON_NAME.plus,
      });
      expect(container.firstChild).toMatchSnapshot('custom-label-and-icon');
    });
  });

  describe('Popover positions', () => {
    it.each([
      ['top', POPOVER_POSITION.top],
      ['right', POPOVER_POSITION.right],
      ['left', POPOVER_POSITION.left],
    ])('matches snapshot with %s position', (label, position) => {
      const { container } = renderActionMenu({
        id: `${label}-position-menu`,
        popoverPosition: position,
      });

      act(() => {
        const trigger = screen.getByTestId('navigation-action-trigger-action');
        fireEvent.click(trigger);
      });

      expect(container.firstChild).toMatchSnapshot(`${label}-position`);
    });
  });

  describe('Item variations', () => {
    it('matches snapshot with only link items', () => {
      const linkItems = [
        { id: 1, href: 'https://example.com', label: 'External Link', target: '_blank' },
        { id: 2, href: '/internal-link', label: 'Internal Link' },
      ];
      const { container } = renderActionMenu({ id: 'link-only-menu', items: linkItems });
      expect(container.firstChild).toMatchSnapshot('link-only-items');
    });

    it('matches snapshot with only button items', () => {
      const buttonItems = [
        { id: 1, onClick: vi.fn(), label: 'Button Action 1' },
        { id: 2, onClick: vi.fn(), label: 'Button Action 2', isDisabled: true },
      ];
      const { container } = renderActionMenu({ id: 'button-only-menu', items: buttonItems });
      expect(container.firstChild).toMatchSnapshot('button-only-items');
    });

    it('matches snapshot with IAM-protected items', () => {
      const iamItems = [
        {
          id: 1,
          onClick: vi.fn(),
          label: 'IAM Protected Action',
          urn: 'urn:v18:eu:resource:m--components:test',
          iamActions: ['test:action:read'],
        },
      ];
      const { container } = renderActionMenu({ id: 'iam-menu', items: iamItems });
      expect(container.firstChild).toMatchSnapshot('iam-protected-items');
    });

    it('matches snapshot with mixed item types', () => {
      const mixedItems = [
        { id: 1, onClick: vi.fn(), label: 'Button Action' },
        { id: 2, href: 'https://example.com', label: 'External Link', target: '_blank' },
        {
          id: 3,
          onClick: vi.fn(),
          label: 'IAM Protected',
          urn: 'urn:v18:eu:resource:m--components:test',
          iamActions: ['test:action:read'],
        },
        { id: 4, href: '/download', download: 'file.pdf', label: 'Download' },
      ];
      const { container } = renderActionMenu({ id: 'mixed-menu', items: mixedItems });

      act(() => {
        const trigger = screen.getByTestId('navigation-action-trigger-action');
        fireEvent.click(trigger);
      });

      expect(container.firstChild).toMatchSnapshot('mixed-item-types');
    });
  });

  describe('Edge cases', () => {
    it('matches snapshot with empty items array', () => {
      const { container } = renderActionMenu({ id: 'empty-menu', items: [] });
      expect(container.firstChild).toMatchSnapshot('empty-items');
    });

    it('matches snapshot with single item', () => {
      const singleItem = [{ id: 1, label: 'Single Action', onClick: vi.fn() }];
      const { container } = renderActionMenu({ id: 'single-item-menu', items: singleItem });
      expect(container.firstChild).toMatchSnapshot('single-item');
    });

    it('matches snapshot with many items', () => {
      const manyItems = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        label: `Action ${i + 1}`,
        onClick: vi.fn(),
      }));
      const { container } = renderActionMenu({ id: 'many-items-menu', items: manyItems });
      expect(container.firstChild).toMatchSnapshot('many-items');
    });
  });

  describe('IAM authorization states', () => {
    it('matches snapshot when IAM is loading', () => {
      mockUseAuthorizationIam.mockReturnValue(
        buildIamMock({
          isAuthorized: false,
          isLoading: true,
        }),
      );

      const iamItems = [
        {
          id: 1,
          onClick: vi.fn(),
          label: 'IAM Action',
          urn: 'urn:v18:eu:resource:m--components:test',
          iamActions: ['test:action:read'],
        },
      ];

      const { container } = renderActionMenu({ id: 'iam-loading-menu', items: iamItems });
      expect(container.firstChild).toMatchSnapshot('iam-loading-state');
    });

    it('matches snapshot when IAM is not authorized', () => {
      const unauthorizedData: IamCheckResponse = {
        urn: 'urn:v18:eu:resource:m--components:test',
        authorizedActions: [],
        unauthorizedActions: ['test:action:read'],
      };

      mockUseAuthorizationIam.mockReturnValue(
        buildIamMock({
          isAuthorized: false,
          data: unauthorizedData,
        }),
      );

      const iamItems = [
        {
          id: 1,
          onClick: vi.fn(),
          label: 'Unauthorized Action',
          urn: unauthorizedData.urn,
          iamActions: unauthorizedData.unauthorizedActions,
        },
      ];

      const { container } = renderActionMenu({ id: 'iam-unauthorized-menu', items: iamItems });
      expect(container.firstChild).toMatchSnapshot('iam-unauthorized-state');
    });
  });
});
