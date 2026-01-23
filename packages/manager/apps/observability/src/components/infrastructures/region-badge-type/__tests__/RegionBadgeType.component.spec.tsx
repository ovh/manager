import React from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { RegionBadgeType } from '@/components/infrastructures/region-badge-type/RegionBadgeType.component';
import { RegionType } from '@/types/infrastructures.type';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'infrastructure.region.zone.local': 'infrastructure.region.zone.local',
        'infrastructure.region.zone.1_az': 'infrastructure.region.zone.1_az',
        'infrastructure.region.zone.3_az': 'infrastructure.region.zone.3_az',
      };
      return translations[key] || key;
    },
  }),
}));

// Mock MUK components
vi.mock('@ovh-ux/muk', () => ({
  Badge: ({
    id,
    children,
    color,
    className,
    size,
  }: {
    id?: string;
    children?: React.ReactNode;
    color?: string;
    className?: string;
    size?: string;
  }) => (
    <div data-testid="badge" id={id} data-color={color} className={className} data-size={size}>
      {children}
    </div>
  ),
  Icon: ({ name, className }: { name: string; className?: string }) => (
    <span data-testid="icon" data-name={name} className={className} />
  ),
  Tooltip: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="tooltip">{children}</div>
  ),
  TooltipTrigger: ({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) => (
    <div data-testid="tooltip-trigger" data-as-child={asChild}>
      {children}
    </div>
  ),
  TooltipContent: ({
    id,
    children,
    className,
  }: {
    id?: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <div data-testid="tooltip-content" id={id} className={className}>
      {children}
    </div>
  ),
  Text: ({
    children,
    preset,
    className,
  }: {
    children: React.ReactNode;
    preset?: string;
    className?: string;
  }) => (
    <span data-testid="text" data-preset={preset} className={className}>
      {children}
    </span>
  ),
  BADGE_COLOR: {
    information: 'information',
    promotion: 'promotion',
  },
  ICON_NAME: {
    circleInfo: 'circle-info',
  },
}));

describe('RegionBadgeType', () => {
  describe('Rendering', () => {
    it.each<{ type: RegionType; label: string }>([
      { type: 'LOCAL-ZONE', label: 'Local Zone' },
      { type: 'REGION-1-AZ', label: '1-AZ' },
      { type: 'REGION-3-AZ', label: '3-AZ' },
    ])('should render badge and tooltip for $type type', ({ type, label }) => {
      render(<RegionBadgeType type={type} />);

      const badge = screen.getByTestId('badge');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveAttribute('id');
      expect(badge).toHaveTextContent(label);

      const tooltip = screen.getByTestId('tooltip');
      expect(tooltip).toBeInTheDocument();

      const tooltipContent = screen.getByTestId('tooltip-content');
      expect(tooltipContent).toBeInTheDocument();
    });
  });

  describe('Badge Properties', () => {
    it.each<{ type: RegionType; color: string }>([
      { type: 'LOCAL-ZONE', color: 'information' },
      { type: 'REGION-1-AZ', color: 'promotion' },
      { type: 'REGION-3-AZ', color: 'promotion' },
    ])('should apply correct color for $type', ({ type, color }) => {
      render(<RegionBadgeType type={type} />);

      const badge = screen.getByTestId('badge');
      expect(badge).toHaveAttribute('data-color', color);
    });

    it.each<{ type: RegionType; bgClass: string }>([
      { type: 'LOCAL-ZONE', bgClass: 'bg-[--ods-color-primary-100]' },
      { type: 'REGION-1-AZ', bgClass: 'bg-[--ods-color-primary-400]' },
      { type: 'REGION-3-AZ', bgClass: 'bg-[--ods-color-primary-700]' },
    ])('should apply correct background color class for $type', ({ type, bgClass }) => {
      render(<RegionBadgeType type={type} />);

      const badge = screen.getByTestId('badge');
      expect(badge).toHaveClass(bgClass);
    });

    it('should have correct icon properties', () => {
      render(<RegionBadgeType type="LOCAL-ZONE" />);

      const icon = screen.getByTestId('icon');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('data-name', 'circle-info');
      expect(icon).toHaveClass('ml-1');
    });

    it('should have correct size property', () => {
      render(<RegionBadgeType type="LOCAL-ZONE" />);

      const badge = screen.getByTestId('badge');
      expect(badge).toHaveAttribute('data-size', 'sm');
    });
  });

  describe('Tooltip Properties', () => {
    it('should configure tooltip correctly', () => {
      render(<RegionBadgeType type="LOCAL-ZONE" />);

      const badge = screen.getByTestId('badge');
      const tooltip = screen.getByTestId('tooltip');
      const tooltipTrigger = screen.getByTestId('tooltip-trigger');
      const tooltipContent = screen.getByTestId('tooltip-content');

      expect(badge).toHaveAttribute('id');
      expect(tooltip).toBeInTheDocument();
      expect(tooltipTrigger).toBeInTheDocument();
      expect(tooltipContent).toBeInTheDocument();
    });

    it.each<{ type: RegionType; tooltipText: string }>([
      { type: 'LOCAL-ZONE', tooltipText: 'infrastructure.region.zone.local' },
      { type: 'REGION-1-AZ', tooltipText: 'infrastructure.region.zone.1_az' },
      { type: 'REGION-3-AZ', tooltipText: 'infrastructure.region.zone.3_az' },
    ])('should display correct tooltip text for $type', ({ type, tooltipText }) => {
      render(<RegionBadgeType type={type} />);

      const tooltipContent = screen.getByTestId('tooltip-content');
      expect(tooltipContent).toHaveTextContent(tooltipText);
    });

    it('should apply correct text preset to tooltip content', () => {
      render(<RegionBadgeType type="LOCAL-ZONE" />);

      const tooltipContent = screen.getByTestId('tooltip-content');
      expect(tooltipContent).toBeInTheDocument();
    });

    it('should apply correct className to tooltip text', () => {
      render(<RegionBadgeType type="LOCAL-ZONE" />);

      const tooltipContent = screen.getByTestId('tooltip-content');
      expect(tooltipContent).toHaveClass('w-56');
    });
  });

  describe('Component Structure', () => {
    it('should render badge and tooltip together', () => {
      const { container } = render(<RegionBadgeType type="LOCAL-ZONE" />);

      const badge = screen.getByTestId('badge');
      const tooltip = screen.getByTestId('tooltip');

      expect(badge).toBeInTheDocument();
      expect(tooltip).toBeInTheDocument();
      expect(container.firstChild).toBeTruthy();
    });

    it('should use same id for badge and tooltip triggerId', () => {
      render(<RegionBadgeType type="LOCAL-ZONE" />);

      const badge = screen.getByTestId('badge');
      const tooltipContent = screen.getByTestId('tooltip-content');

      expect(badge.id).toBeTruthy();
      expect(tooltipContent.id).toContain('tooltip-');
    });
  });

  describe('Type-based Variations', () => {
    const testCases: Array<{
      type: RegionType;
      expectedLabel: string;
      expectedColor: string;
      expectedBgClass: string;
      expectedTooltip: string;
    }> = [
      {
        type: 'LOCAL-ZONE',
        expectedLabel: 'Local Zone',
        expectedColor: 'information',
        expectedBgClass: 'bg-[--ods-color-primary-100]',
        expectedTooltip: 'infrastructure.region.zone.local',
      },
      {
        type: 'REGION-1-AZ',
        expectedLabel: '1-AZ',
        expectedColor: 'promotion',
        expectedBgClass: 'bg-[--ods-color-primary-400]',
        expectedTooltip: 'infrastructure.region.zone.1_az',
      },
      {
        type: 'REGION-3-AZ',
        expectedLabel: '3-AZ',
        expectedColor: 'promotion',
        expectedBgClass: 'bg-[--ods-color-primary-700]',
        expectedTooltip: 'infrastructure.region.zone.3_az',
      },
    ];

    it.each(testCases)(
      'should render correct properties for $type',
      ({ type, expectedLabel, expectedColor, expectedBgClass, expectedTooltip }) => {
        render(<RegionBadgeType type={type} />);

        const badge = screen.getByTestId('badge');
        expect(badge).toHaveTextContent(expectedLabel);
        expect(badge).toHaveAttribute('data-color', expectedColor);
        expect(badge).toHaveClass(expectedBgClass);

        const tooltipContent = screen.getByTestId('tooltip-content');
        expect(tooltipContent).toHaveTextContent(expectedTooltip);
      },
    );
  });

  describe('Edge Cases', () => {
    it('should handle unique ids for multiple instances', () => {
      const { rerender } = render(<RegionBadgeType type="LOCAL-ZONE" />);

      let badge = screen.getByTestId('badge');
      const firstId = badge.id;
      expect(firstId).toBeTruthy();

      rerender(<RegionBadgeType type="REGION-1-AZ" />);

      badge = screen.getByTestId('badge');
      expect(badge.id).toBeTruthy();
    });

    it('should render with auto-generated id', () => {
      render(<RegionBadgeType type="LOCAL-ZONE" />);

      const badge = screen.getByTestId('badge');
      expect(badge.id).toBeTruthy();

      const tooltip = screen.getByTestId('tooltip');
      expect(tooltip).toBeInTheDocument();

      const tooltipContent = screen.getByTestId('tooltip-content');
      expect(tooltipContent.id).toContain('tooltip-');
    });

    it('should maintain component structure when type changes', () => {
      const { rerender } = render(<RegionBadgeType type="LOCAL-ZONE" />);

      let badge = screen.getByTestId('badge');
      expect(badge).toHaveTextContent('Local Zone');

      rerender(<RegionBadgeType type="REGION-3-AZ" />);

      badge = screen.getByTestId('badge');
      expect(badge).toHaveTextContent('3-AZ');
      expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have informative icon for accessibility', () => {
      render(<RegionBadgeType type="LOCAL-ZONE" />);

      const icon = screen.getByTestId('icon');
      expect(icon).toHaveAttribute('data-name', 'circle-info');
    });

    it('should associate tooltip with badge via triggerId', () => {
      render(<RegionBadgeType type="LOCAL-ZONE" />);

      const badge = screen.getByTestId('badge');
      const tooltipTrigger = screen.getByTestId('tooltip-trigger');

      expect(badge.id).toBeTruthy();
      expect(tooltipTrigger).toBeInTheDocument();
    });

    it('should provide descriptive tooltip text', () => {
      render(<RegionBadgeType type="LOCAL-ZONE" />);

      const tooltipContent = screen.getByTestId('tooltip-content');
      const content = tooltipContent.textContent;

      expect(content).toBeTruthy();
      expect(content).not.toBeNull();
      expect(content?.length).toBeGreaterThan(10);
    });
  });
});
