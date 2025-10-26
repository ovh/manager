import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ActionMenuItemProps } from '@/components/action-menu/ActionMenu.props';
import { IamAuthorizationResponse } from '@/hooks/iam/IAM.type';
import { useAuthorizationIam } from '@/hooks/iam/useOvhIam';

import { ActionMenuItem } from '../ActionMenuItem.component';

vi.mock('@/hooks/iam/useOvhIam');

const mockedHook = useAuthorizationIam as unknown as jest.Mock<IamAuthorizationResponse>;

describe('ActionMenuItemProps', () => {
  const mockItem: Omit<ActionMenuItemProps, 'id'> = {
    label: 'Test Menu Item',
    onClick: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Menu item rendering', () => {
    it('should render a link when href is provided', () => {
      const itemWithHref = {
        ...mockItem,
        href: 'https://example.com',
        target: '_blank',
        download: 'test-file.pdf',
      };
      mockedHook.mockReturnValue({
        isAuthorized: true,
        isLoading: false,
        isFetched: true,
      });

      render(<ActionMenuItem item={itemWithHref} isTrigger={false} id={1} />);

      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', 'https://example.com');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('download', 'test-file.pdf');
      expect(link).toHaveTextContent('Test Menu Item');
    });

    it('should render a link with href and IAM actions', () => {
      const itemWithHrefIamActions = {
        ...mockItem,
        href: 'https://example.com',
        label: 'Action 1',
        urn: 'urn:v18:eu:resource:m--components:vrz-a878-dsflkds-fdsfdsfdsf',
        iamActions: ['vrackServices:apiovh:iam/resource/tag/remove'],
      };
      mockedHook.mockReturnValue({
        isAuthorized: true,
        isLoading: false,
        isFetched: true,
      });
      render(<ActionMenuItem item={itemWithHrefIamActions} isTrigger={false} id={1} />);

      expect(screen.getByText('Action 1')).toBeInTheDocument();
      expect(screen.getByText('Action 1')).not.toBeDisabled();
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', 'https://example.com');
    });

    it('should render a link with no IAM actions', () => {
      const itemWithHrefIamActions = {
        ...mockItem,
        href: 'https://example.com',
        label: 'Action 1',
        urn: 'urn:v18:eu:resource:m--components:vrz-a878-dsflkds-fdsfdsfdsf',
        iamActions: ['vrackServices:apiovh:iam/resource/tag/remove'],
      };
      mockedHook.mockReturnValue({
        isAuthorized: false,
        isLoading: false,
        isFetched: true,
      });
      render(<ActionMenuItem item={itemWithHrefIamActions} isTrigger={false} id={1} />);
      expect(screen.getByText('Action 1')).toBeInTheDocument();
    });
  });

  describe('Button rendering', () => {
    it('should render a regular button when no href and no IAM actions', () => {
      render(<ActionMenuItem item={mockItem} isTrigger={false} id={1} />);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Test Menu Item');
      expect(button).toHaveClass('menu-item-button', 'w-full');
    });

    it('should render a regular button with custom props', () => {
      const itemWithCustomProps = {
        ...mockItem,
        variant: 'primary' as any,
        color: 'success' as any,
        isDisabled: true,
        isLoading: true,
        'data-testid': 'custom-button',
      };

      render(<ActionMenuItem item={itemWithCustomProps} isTrigger={false} id={1} />);

      const button = screen.getByTestId('custom-button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Test Menu Item');
    });

    it('should call onClick when button is clicked', () => {
      const onClickMock = vi.fn();
      const itemWithOnClick = {
        ...mockItem,
        onClick: onClickMock,
      };
      render(<ActionMenuItem item={itemWithOnClick} isTrigger={false} id={1} />);
      const button = screen.getByRole('button');
      fireEvent.click(button);
      expect(onClickMock).toHaveBeenCalledTimes(1);
    });

    it('should render a Button with href and IAM actions', () => {
      const itemWithHrefIamActions = {
        ...mockItem,
        label: 'Action 2',
        urn: 'urn:v18:eu:resource:m--components:vrz-a878-dsflkds-fdsfdsfdsf',
        iamActions: ['vrackServices:apiovh:iam/resource/tag/remove'],
      };
      mockedHook.mockReturnValue({
        isAuthorized: true,
        isLoading: false,
        isFetched: true,
      });
      render(<ActionMenuItem item={itemWithHrefIamActions} isTrigger={false} id={1} />);

      // Remove comment after merging Button Component
      //   const button = screen.getByRole('Button');
      //   expect(button).toHaveTextContent('Action 2');
      //   expect(button).not.toBeDisabled();
    });

    it('should render a Button with no IAM actions', () => {
      const itemWithHrefIamActions = {
        ...mockItem,
        label: 'Action 2',
        urn: 'urn:v18:eu:resource:m--components:vrz-a878-dsflkds-fdsfdsfdsf',
        iamActions: ['vrackServices:apiovh:iam/resource/tag/remove'],
      };
      mockedHook.mockReturnValue({
        isAuthorized: false,
        isLoading: false,
        isFetched: true,
      });
      render(<ActionMenuItem item={itemWithHrefIamActions} isTrigger={false} id={1} />);
      // Remove comment after merging Button Component
      //   const button = screen.getByRole('button');
      //   expect(button).toHaveTextContent('Action 2');
      //   expect(button).toBeDisabled();
    });
  });
});
