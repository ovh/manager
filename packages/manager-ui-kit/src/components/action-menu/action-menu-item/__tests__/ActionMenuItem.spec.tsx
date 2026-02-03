import { fireEvent, screen } from '@testing-library/react';
import { Mock, beforeEach, describe, expect, it, vi } from 'vitest';

import { buildIamMock } from '@/commons/tests-utils/Mock.utils';
import { render } from '@/commons/tests-utils/Render.utils';
import type { ActionMenuItemProps } from '@/components/action-menu/ActionMenu.props';
import { useAuthorizationIam } from '@/hooks';

import { ActionMenuItem } from '../ActionMenuItem.component';

vi.mock('@/hooks/iam/useOvhIam', () => ({
  useAuthorizationIam: vi.fn(),
}));

const mockUseAuthorizationIam = useAuthorizationIam as Mock;

describe('ActionMenuItem', () => {
  const mockItem: Omit<ActionMenuItemProps, 'id'> = {
    label: 'Test Menu Item',
    onClick: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuthorizationIam.mockReturnValue(buildIamMock());
  });

  describe('Menu item rendering', () => {
    it('renders a link when href is provided', () => {
      const itemWithHref = {
        ...mockItem,
        href: 'https://example.com',
        target: '_blank',
        download: 'test-file.pdf',
      };

      render(<ActionMenuItem item={itemWithHref} closeMenu={() => {}} id={1} />);

      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', 'https://example.com');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('download', 'test-file.pdf');
      expect(link).toHaveTextContent('Test Menu Item');
    });

    it('renders a link with href and IAM actions (authorized)', () => {
      const itemWithIam = {
        ...mockItem,
        href: 'https://example.com',
        label: 'Action 1',
        urn: 'urn:v18:eu:resource:m--components:test',
        iamActions: ['vrackServices:apiovh:iam/resource/tag/remove'],
      };

      mockUseAuthorizationIam.mockReturnValue(
        buildIamMock({ isAuthorized: true, isLoading: false }),
      );

      render(<ActionMenuItem item={itemWithIam} closeMenu={() => {}} id={1} />);

      const link = screen.getByText('Action 1');
      expect(link).toBeInTheDocument();
      expect(link.tagName).toBe('A');
      expect(link).not.toHaveAttribute('aria-disabled', 'true');
      expect(link).toHaveAttribute('href', 'https://example.com');
    });

    it('renders a link when IAM denies authorization', () => {
      const itemWithIam = {
        ...mockItem,
        href: 'https://example.com',
        label: 'Action 1',
        urn: 'urn:v18:eu:resource:m--components:test',
        iamActions: ['vrackServices:apiovh:iam/resource/tag/remove'],
      };

      mockUseAuthorizationIam.mockReturnValue(
        buildIamMock({ isAuthorized: false, isLoading: false }),
      );

      render(<ActionMenuItem item={itemWithIam} closeMenu={() => {}} id={1} />);
      expect(screen.getByText('Action 1')).toBeInTheDocument();
    });
  });

  describe('Button rendering', () => {
    it('renders a regular button when no href or IAM actions', () => {
      render(<ActionMenuItem item={mockItem} closeMenu={() => {}} id={1} />);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Test Menu Item');
      expect(button).toHaveClass('menu-item-button', 'w-full');
    });

    it('renders a button with custom props', () => {
      const itemWithCustomProps: ActionMenuItemProps = {
        ...mockItem,
        id: 1,
        variant: 'primary' as never,
        color: 'success' as never,
        isDisabled: true,
        isLoading: true,
        'data-testid': 'custom-button',
      };

      render(<ActionMenuItem item={itemWithCustomProps} closeMenu={() => {}} id={1} />);

      const button = screen.getByTestId('custom-button');
      expect(button).toBeInTheDocument();
      expect(button).toBeDisabled();
      expect(button).toHaveTextContent('Test Menu Item');
      expect(button).not.toHaveAttribute('isDisabled');
      expect(button).not.toHaveAttribute('isLoading');
    });

    it('calls onClick and closeMenu when the button is clicked', () => {
      const onClickMock = vi.fn();
      const closeMenuMock = vi.fn();
      const clickableItem: ActionMenuItemProps = {
        ...mockItem,
        id: 1,
        onClick: onClickMock,
      };

      render(<ActionMenuItem item={clickableItem} closeMenu={closeMenuMock} id={1} />);
      const button = screen.getByRole('button');
      fireEvent.click(button);
      expect(onClickMock).toHaveBeenCalledTimes(1);
      expect(closeMenuMock).toHaveBeenCalledTimes(1);
    });

    it('renders an authorized IAM button', () => {
      const iamItem = {
        ...mockItem,
        label: 'Action 2',
        urn: 'urn:v18:eu:resource:m--components:test',
        iamActions: ['vrackServices:apiovh:iam/resource/tag/remove'],
      };

      mockUseAuthorizationIam.mockReturnValue(buildIamMock({ isAuthorized: true }));

      render(<ActionMenuItem item={iamItem} closeMenu={() => {}} id={1} />);
      expect(screen.getByText('Action 2')).toBeInTheDocument();
    });

    it('renders a disabled IAM button when unauthorized', () => {
      const iamItem = {
        ...mockItem,
        label: 'Action 2',
        urn: 'urn:v18:eu:resource:m--components:test',
        iamActions: ['vrackServices:apiovh:iam/resource/tag/remove'],
      };

      mockUseAuthorizationIam.mockReturnValue(buildIamMock({ isAuthorized: false }));

      render(<ActionMenuItem item={iamItem} closeMenu={() => {}} id={1} />);
      expect(screen.getByText('Action 2')).toBeInTheDocument();
    });
  });
});
