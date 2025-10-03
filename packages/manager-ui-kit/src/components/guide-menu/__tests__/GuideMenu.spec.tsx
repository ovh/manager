import { vi } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { GuideMenu } from '../GuideMenu.component';
import { GuideMenuItem } from '../GuideMenu.props';
import { render } from '../../../utils/test.provider';

describe('GuideMenu component', () => {
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

  describe('Rendering', () => {
    it('should render the guide button with correct text', () => {
      render(<GuideMenu {...defaultProps} />);
      expect(screen.getByText('OVH Guides')).toBeInTheDocument();
    });

    it('should render with loading state', () => {
      render(<GuideMenu {...defaultProps} isLoading={true} />);
      const button = screen.getByRole('button');

      expect(button).toHaveAttribute('disabled');
    });

    it('should render without loading state', () => {
      render(<GuideMenu {...defaultProps} isLoading={false} />);
      const button = screen.getByRole('button');
      expect(button).not.toHaveAttribute('aria-disabled', 'true');
    });

    it('should render all guide items', () => {
      render(<GuideMenu {...defaultProps} />);
      expect(screen.getByText('OVH Guides')).toBeInTheDocument();
      expect(screen.getByText('Documentation')).toBeInTheDocument();
    });
  });

  describe('Interaction', () => {
    it('should open popover when button is clicked', async () => {
      render(<GuideMenu {...defaultProps} />);
      const button = screen.getByRole('button');

      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText('OVH Guides')).toBeVisible();
        expect(screen.getByText('Documentation')).toBeVisible();
      });
    });

    it('should call onClick when guide item is clicked', async () => {
      const mockOnClick = vi.fn();
      const itemsWithClick: GuideMenuItem[] = [
        {
          id: 1,
          href: 'https://help.ovhcloud.com/guides',
          target: '_blank',
          children: 'OVH Guides',
          onClick: mockOnClick,
        },
      ];

      render(<GuideMenu items={itemsWithClick} isLoading={false} />);
      const button = screen.getByRole('button');

      fireEvent.click(button);

      await waitFor(() => {
        const guideLink = screen.getByText('OVH Guides');
        fireEvent.click(guideLink);
        expect(mockOnClick).toHaveBeenCalledTimes(1);
      });
    });

    it('should be disabled when loading', () => {
      render(<GuideMenu {...defaultProps} isLoading={true} />);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });
  });

  describe('Props validation', () => {
    it('should handle items with all optional properties', () => {
      const itemsWithAllProps: GuideMenuItem[] = [
        {
          id: 1,
          href: 'https://help.ovhcloud.com/guides',
          target: '_blank',
          rel: 'noopener noreferrer',
          download: 'guide.pdf',
          children: 'OVH Guides',
          onClick: vi.fn(),
        },
      ];
      render(<GuideMenu items={itemsWithAllProps} isLoading={false} />);
      expect(screen.getByText('Guides')).toBeInTheDocument();
    });

    it('should handle items with minimal required properties', () => {
      const itemsWithMinimalProps: GuideMenuItem[] = [
        {
          id: 1,
          href: 'https://help.ovhcloud.com/guides',
          children: 'OVH Guides',
        },
      ];
      render(<GuideMenu items={itemsWithMinimalProps} isLoading={false} />);
      expect(screen.getByText('Guides')).toBeInTheDocument();
    });

    it('should handle undefined onClick in items', () => {
      const itemsWithoutOnClick: GuideMenuItem[] = [
        {
          id: 1,
          href: 'https://help.ovhcloud.com/guides',
          children: 'OVH Guides',
        },
      ];
      render(<GuideMenu items={itemsWithoutOnClick} isLoading={false} />);
      expect(screen.getByText('Guides')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper button role', () => {
      render(<GuideMenu {...defaultProps} />);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('should have proper aria-label', () => {
      render(<GuideMenu {...defaultProps} />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Guides');
    });

    it('should be keyboard accessible', () => {
      render(<GuideMenu {...defaultProps} />);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      button.focus();
      expect(button).toHaveFocus();
    });

    it('should open popover on Enter key press', () => {
      render(<GuideMenu {...defaultProps} />);
      const button = screen.getByRole('button');

      fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });

      waitFor(() => {
        expect(screen.getByText('OVH Guides')).toBeVisible();
      });
    });

    it('should open popover on Space key press', () => {
      render(<GuideMenu {...defaultProps} />);
      const button = screen.getByRole('button');

      fireEvent.keyDown(button, { key: ' ', code: 'Space' });

      waitFor(() => {
        expect(screen.getByText('OVH Guides')).toBeVisible();
      });
    });
  });
});
