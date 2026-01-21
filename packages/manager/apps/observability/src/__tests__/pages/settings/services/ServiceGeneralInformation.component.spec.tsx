import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ServiceGeneralInformation } from '@/pages/settings/services/general-information/ServiceGeneralInformation.component';
import { ResourceStatus } from '@/types/resource.type';

const { mockNavigate, mockUseHref } = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  mockUseHref: vi.fn((path: string) => `/mock${path}`),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useHref: mockUseHref,
}));

const mockFormatDate = vi.fn(({ date }: { date: string }) => `formatted-${date}`);

vi.mock('@ovhcloud/ods-react', () => ({
  BUTTON_COLOR: { primary: 'primary' },
  BUTTON_SIZE: { sm: 'sm' },
  BUTTON_VARIANT: { ghost: 'ghost' },
  ICON_NAME: { pen: 'pen' },
  TEXT_PRESET: { span: 'span' },
  Button: ({
    children,
    onClick,
    'data-testid': testId,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    'data-testid'?: string;
  }) => (
    <button data-testid={testId ?? 'ods-button'} onClick={onClick}>
      {children}
    </button>
  ),
  Icon: ({ name }: { name: string }) => <span data-testid={`icon-${name}`} />,
  Text: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
}));

vi.mock('@ovh-ux/muk', () => ({
  ActionMenu: ({
    id,
    items,
  }: {
    id: string;
    items: Array<{ id: number; label: string; href: string; isDisabled?: boolean }>;
  }) => (
    <div data-testid={id}>
      {items.map((item) => (
        <a
          key={item.id}
          href={item.href}
          data-testid={`action-item-${item.id}`}
          data-disabled={item.isDisabled}
        >
          {item.label}
        </a>
      ))}
    </div>
  ),
  Clipboard: ({ value, className }: { value?: string; className?: string }) => (
    <div data-testid="clipboard" data-value={value} className={className}>
      {value}
    </div>
  ),
  Tile: {
    Root: ({ title, children }: { title: string; children: React.ReactNode }) => (
      <div data-testid="tile-root" data-title={title}>
        {children}
      </div>
    ),
    Item: {
      Root: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="tile-item">{children}</div>
      ),
      Term: ({ label, actions }: { label: string; actions?: React.ReactNode }) => (
        <div data-testid={`tile-term-${label}`}>
          <span>{label}</span>
          {actions}
        </div>
      ),
      Description: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="tile-description">{children}</div>
      ),
    },
  },
  useFormatDate: () => mockFormatDate,
}));

vi.mock('@/components/dashboard/SkeletonWrapper.component', () => ({
  default: ({ children, isLoading }: { children: React.ReactNode; isLoading: boolean }) => (
    <div data-testid="skeleton-wrapper" data-loading={isLoading}>
      {children}
    </div>
  ),
}));

vi.mock('@/components/services/status/ResourceBadgeStatus.component', () => ({
  default: ({ status }: { status?: string }) => (
    <span data-testid="resource-badge-status" data-status={status}>
      {status}
    </span>
  ),
}));

vi.mock('@/routes/Routes.constants', () => ({
  urls: {
    deleteService: '/delete-service',
    editService: '/edit-service',
  },
}));

vi.mock('@/utils/labels.constants', () => ({
  LABELS: {
    ID: 'ID',
    URN: 'URN',
  },
}));

describe('ServiceGeneralInformation', () => {
  const defaultProps = {
    title: 'My Service',
    iam: {
      id: 'service-123',
      urn: 'urn:service:123',
    },
    createdAt: '2024-01-15T10:30:00Z',
    isLoading: false,
    resourceStatus: 'READY' as ResourceStatus,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it.each([
      { testId: 'tile-root', description: 'tile root' },
      { testId: 'resource-badge-status', description: 'resource status badge' },
      { testId: 'status-action-menu', description: 'action menu' },
    ])('should render $description', ({ testId }) => {
      render(<ServiceGeneralInformation {...defaultProps} />);

      expect(screen.getByTestId(testId)).toBeInTheDocument();
    });

    it('should render tile with correct title', () => {
      render(<ServiceGeneralInformation {...defaultProps} />);

      expect(screen.getByTestId('tile-root')).toHaveAttribute(
        'data-title',
        '@ovh-ux/manager-common-translations/dashboard:general_information',
      );
    });

    it.each([
      {
        label: '@ovh-ux/manager-common-translations/dashboard:name',
        description: 'name',
      },
      { label: 'ID', description: 'ID' },
      { label: 'URN', description: 'URN' },
      {
        label: '@ovh-ux/manager-common-translations/status:status',
        description: 'status',
      },
      {
        label: '@ovh-ux/manager-common-translations/dashboard:creation_date',
        description: 'creation date',
      },
    ])('should render $description term', ({ label }) => {
      render(<ServiceGeneralInformation {...defaultProps} />);

      expect(screen.getByTestId(`tile-term-${label}`)).toBeInTheDocument();
    });
  });

  describe('Data Display', () => {
    it('should display service title', () => {
      render(<ServiceGeneralInformation {...defaultProps} />);

      expect(screen.getByText('My Service')).toBeInTheDocument();
    });

    it('should display service ID in clipboard', () => {
      render(<ServiceGeneralInformation {...defaultProps} />);

      const clipboards = screen.getAllByTestId('clipboard');
      expect(clipboards[0]).toHaveAttribute('data-value', 'service-123');
    });

    it('should display service URN in clipboard', () => {
      render(<ServiceGeneralInformation {...defaultProps} />);

      const clipboards = screen.getAllByTestId('clipboard');
      expect(clipboards[1]).toHaveAttribute('data-value', 'urn:service:123');
    });

    it('should display resource status', () => {
      render(<ServiceGeneralInformation {...defaultProps} />);

      expect(screen.getByTestId('resource-badge-status')).toHaveAttribute('data-status', 'READY');
    });

    it('should display formatted creation date', () => {
      render(<ServiceGeneralInformation {...defaultProps} />);

      expect(mockFormatDate).toHaveBeenCalledWith({
        date: '2024-01-15T10:30:00Z',
        format: 'P',
      });
      expect(screen.getByText('formatted-2024-01-15T10:30:00Z')).toBeInTheDocument();
    });

    it('should not display creation date when not provided', () => {
      render(<ServiceGeneralInformation {...defaultProps} createdAt={undefined} />);

      expect(screen.queryByText(/formatted-/)).not.toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it.each([
      { isLoading: true, expectedValue: 'true' },
      { isLoading: false, expectedValue: 'false' },
    ])('should pass isLoading=$isLoading to skeleton wrappers', ({ isLoading, expectedValue }) => {
      render(<ServiceGeneralInformation {...defaultProps} isLoading={isLoading} />);

      const skeletons = screen.getAllByTestId('skeleton-wrapper');
      skeletons.forEach((skeleton) => {
        expect(skeleton).toHaveAttribute('data-loading', expectedValue);
      });
    });
  });

  describe('Edit Button', () => {
    it('should render edit button with pen icon', () => {
      render(<ServiceGeneralInformation {...defaultProps} />);

      expect(screen.getByTestId('icon-pen')).toBeInTheDocument();
    });

    it('should navigate to edit service page when edit button is clicked', () => {
      render(<ServiceGeneralInformation {...defaultProps} />);

      const editButton = screen.getByTestId('icon-pen').closest('button');
      fireEvent.click(editButton!);

      expect(mockNavigate).toHaveBeenCalledWith('/edit-service');
    });
  });

  describe('Action Menu', () => {
    it('should render terminate action item', () => {
      render(<ServiceGeneralInformation {...defaultProps} />);

      expect(screen.getByTestId('action-item-1')).toHaveTextContent(
        '@ovh-ux/manager-common-translations/actions:terminate',
      );
    });

    it('should have correct href for terminate action', () => {
      render(<ServiceGeneralInformation {...defaultProps} />);

      expect(screen.getByTestId('action-item-1')).toHaveAttribute('href', '/mock/delete-service');
    });

    it.each([
      { status: 'READY' as ResourceStatus, shouldBeDisabled: 'false' },
      { status: 'UPDATING' as ResourceStatus, shouldBeDisabled: 'true' },
      { status: 'ERROR' as ResourceStatus, shouldBeDisabled: 'true' },
      { status: 'DELETING' as ResourceStatus, shouldBeDisabled: 'true' },
      { status: 'CREATING' as ResourceStatus, shouldBeDisabled: 'true' },
    ])(
      'should have terminate action disabled=$shouldBeDisabled when status=$status',
      ({ status, shouldBeDisabled }) => {
        render(<ServiceGeneralInformation {...defaultProps} resourceStatus={status} />);

        expect(screen.getByTestId('action-item-1')).toHaveAttribute(
          'data-disabled',
          shouldBeDisabled,
        );
      },
    );
  });

  describe('Edge Cases', () => {
    it('should handle undefined iam gracefully', () => {
      render(<ServiceGeneralInformation {...defaultProps} iam={undefined} />);

      const clipboards = screen.getAllByTestId('clipboard');
      expect(clipboards[0]).not.toHaveAttribute('data-value');
      expect(clipboards[1]).not.toHaveAttribute('data-value');
    });

    it('should handle undefined title gracefully', () => {
      render(<ServiceGeneralInformation {...defaultProps} title={undefined} />);

      expect(screen.queryByText('My Service')).not.toBeInTheDocument();
    });

    it('should handle undefined resourceStatus gracefully', () => {
      render(<ServiceGeneralInformation {...defaultProps} resourceStatus={undefined} />);

      expect(screen.getByTestId('resource-badge-status')).not.toHaveAttribute('data-status');
    });
  });
});
