import React from 'react';
import { vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GuideButton } from '../GuideButton.component';
import { GuideItem } from '../GuideButton.props';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations = {
        user_account_guides_header: 'Guides',
      };
      return translations[key] || key;
    },
  }),
}));

vi.mock('@ovhcloud/ods-react', () => ({
  Button: ({ children, loading = false, ...props }) => (
    <button
      data-testid="guide-button"
      data-loading={String(loading)}
      {...props}
    >
      {children}
    </button>
  ),
  BUTTON_SIZE: { sm: 'sm' },
  BUTTON_VARIANT: { ghost: 'ghost' },
  Popover: ({ children, position }) => (
    <div data-testid="popover" data-position={position}>
      {children}
    </div>
  ),
  PopoverTrigger: ({ children, asChild }) => (
    <div data-testid="popover-trigger" data-as-child={asChild}>
      {children}
    </div>
  ),
  PopoverContent: ({ children }) => (
    <div data-testid="popover-content">{children}</div>
  ),
  POPOVER_POSITION: { bottom: 'bottom' },
  Icon: ({ name }) => <span data-testid="icon" data-name={name} />,
  ICON_NAME: { book: 'book' },
}));

// Mock the Links component
vi.mock('../typography', () => ({
  Links: ({ children, onClickReturn, ...props }) => (
    <a data-testid="guide-link" onClick={onClickReturn} {...props}>
      {children}
    </a>
  ),
  LinkType: { external: 'external' },
}));

describe('GuideButton', () => {
  const mockItems: GuideItem[] = [
    {
      id: 1,
      href: 'https://help.ovhcloud.com/guides',
      target: '_blank',
      label: 'OVH Guides',
      onClick: vi.fn(),
    },
    {
      id: 2,
      href: 'https://docs.ovh.com',
      target: '_blank',
      label: 'Documentation',
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
      render(<GuideButton {...defaultProps} />);
      expect(screen.getByText('Guides')).toBeInTheDocument();
    });

    it('should render the book icon', () => {
      render(<GuideButton {...defaultProps} />);
      expect(screen.getByTestId('icon')).toBeInTheDocument();
      expect(screen.getByTestId('icon')).toHaveAttribute('data-name', 'book');
    });

    it('should render with loading state', () => {
      render(<GuideButton {...defaultProps} isLoading={true} />);
      const button = screen.getByTestId('guide-button');
      expect(button).toHaveAttribute('data-loading', 'true');
    });

    it('should render without loading state', () => {
      render(<GuideButton {...defaultProps} isLoading={false} />);
      const button = screen.getByTestId('guide-button');
      expect(button).toHaveAttribute('data-loading', 'false');
    });

    it('should render with empty items array', () => {
      render(<GuideButton items={[]} isLoading={false} />);
      expect(screen.getByText('Guides')).toBeInTheDocument();
      expect(screen.getByTestId('guide-button')).toBeInTheDocument();
    });

    it('should render popover structure correctly', () => {
      render(<GuideButton {...defaultProps} />);
      expect(screen.getByTestId('popover')).toBeInTheDocument();
      expect(screen.getByTestId('popover-trigger')).toBeInTheDocument();
      expect(screen.getByTestId('popover-content')).toBeInTheDocument();
    });
  });

  describe('Props validation', () => {
    it('should handle items with all optional properties', () => {
      const itemsWithAllProps: GuideItem[] = [
        {
          id: 1,
          href: 'https://help.ovhcloud.com/guides',
          target: '_blank',
          rel: 'noopener noreferrer',
          download: 'guide.pdf',
          label: 'OVH Guides',
          onClick: vi.fn(),
        },
      ];
      render(<GuideButton items={itemsWithAllProps} isLoading={false} />);
      expect(screen.getByText('Guides')).toBeInTheDocument();
    });

    it('should handle items with minimal required properties', () => {
      const itemsWithMinimalProps: GuideItem[] = [
        {
          id: 1,
          href: 'https://help.ovhcloud.com/guides',
          label: 'OVH Guides',
        },
      ];
      render(<GuideButton items={itemsWithMinimalProps} isLoading={false} />);
      expect(screen.getByText('Guides')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper button role', () => {
      render(<GuideButton {...defaultProps} />);
      const button = screen.getByTestId('guide-button');
      expect(button).toBeInTheDocument();
    });

    it('should be keyboard accessible', () => {
      render(<GuideButton {...defaultProps} />);
      const button = screen.getByTestId('guide-button');
      expect(button).toBeInTheDocument();
      button.focus();
      expect(button).toHaveFocus();
    });
  });

  describe('Snapshots', () => {
    it('should match snapshot with default props', () => {
      const { container } = render(<GuideButton {...defaultProps} />);
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot with loading state', () => {
      const { container } = render(
        <GuideButton {...defaultProps} isLoading={true} />,
      );
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot with empty items', () => {
      const { container } = render(
        <GuideButton items={[]} isLoading={false} />,
      );
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot with single item', () => {
      const singleItemProps = {
        items: [mockItems[0]],
        isLoading: false,
      };
      const { container } = render(<GuideButton {...singleItemProps} />);
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot with multiple items', () => {
      const { container } = render(<GuideButton {...defaultProps} />);
      expect(container).toMatchSnapshot();
    });
  });
});
