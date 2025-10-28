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

// Mock ODS components
vi.mock('@ovhcloud/ods-components/react', () => ({
  OdsBadge: ({
    id,
    label,
    color,
    className,
    icon,
    iconAlignment,
    size,
  }: {
    id?: string;
    label?: string;
    color?: string;
    className?: string;
    icon?: string;
    iconAlignment?: string;
    size?: string;
  }) => (
    <div
      data-testid="badge"
      id={id}
      data-label={label}
      data-color={color}
      className={className}
      data-icon={icon}
      data-icon-alignment={iconAlignment}
      data-size={size}
    >
      {label}
    </div>
  ),
  OdsText: ({
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
  OdsTooltip: ({
    children,
    triggerId,
    position,
    withArrow,
  }: {
    children: React.ReactNode;
    triggerId?: string;
    position?: string;
    withArrow?: boolean;
  }) => (
    <div
      data-testid="tooltip"
      data-trigger-id={triggerId}
      data-position={position}
      data-with-arrow={withArrow}
    >
      {children}
    </div>
  ),
}));

// Mock ODS constants
vi.mock('@ovhcloud/ods-components', () => ({
  ODS_BADGE_COLOR: {
    information: 'information',
    promotion: 'promotion',
  },
}));

describe('RegionBadgeType', () => {
  describe('Rendering', () => {
    it.each<{ type: RegionType; label: string }>([
      { type: 'LOCAL-ZONE', label: 'Local Zone' },
      { type: 'REGION-1-AZ', label: '1-AZ' },
      { type: 'REGION-3-AZ', label: '3-AZ' },
    ])('should render badge and tooltip for $type type', ({ type, label }) => {
      const id = `test-${type}`;
      render(<RegionBadgeType type={type} id={id} />);

      const badge = screen.getByTestId('badge');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveAttribute('id', id);
      expect(badge).toHaveAttribute('data-label', label);

      const tooltip = screen.getByTestId('tooltip');
      expect(tooltip).toBeInTheDocument();
      expect(tooltip).toHaveAttribute('data-trigger-id', id);
    });
  });

  describe('Badge Properties', () => {
    it.each<{ type: RegionType; color: string }>([
      { type: 'LOCAL-ZONE', color: 'information' },
      { type: 'REGION-1-AZ', color: 'promotion' },
      { type: 'REGION-3-AZ', color: 'promotion' },
    ])('should apply correct color for $type', ({ type, color }) => {
      render(<RegionBadgeType type={type} id={`${type}-color`} />);

      const badge = screen.getByTestId('badge');
      expect(badge).toHaveAttribute('data-color', color);
    });

    it.each<{ type: RegionType; bgClass: string }>([
      { type: 'LOCAL-ZONE', bgClass: '[&::part(badge)]:bg-[--ods-color-primary-100]' },
      { type: 'REGION-1-AZ', bgClass: '[&::part(badge)]:bg-[--ods-color-primary-400]' },
      { type: 'REGION-3-AZ', bgClass: '[&::part(badge)]:bg-[--ods-color-primary-700]' },
    ])('should apply correct background color class for $type', ({ type, bgClass }) => {
      render(<RegionBadgeType type={type} id={`${type}-bg`} />);

      const badge = screen.getByTestId('badge');
      expect(badge).toHaveClass(bgClass);
    });

    it('should have correct icon properties', () => {
      render(<RegionBadgeType type="LOCAL-ZONE" id="icon-test" />);

      const badge = screen.getByTestId('badge');
      expect(badge).toHaveAttribute('data-icon', 'circle-info');
      expect(badge).toHaveAttribute('data-icon-alignment', 'right');
    });

    it('should have correct size property', () => {
      render(<RegionBadgeType type="LOCAL-ZONE" id="size-test" />);

      const badge = screen.getByTestId('badge');
      expect(badge).toHaveAttribute('data-size', 'sm');
    });
  });

  describe('Tooltip Properties', () => {
    it('should configure tooltip correctly', () => {
      const id = 'tooltip-config-test';
      render(<RegionBadgeType type="LOCAL-ZONE" id={id} />);

      const tooltip = screen.getByTestId('tooltip');
      expect(tooltip).toHaveAttribute('data-trigger-id', id);
      expect(tooltip).toHaveAttribute('data-position', 'right');
      expect(tooltip).toHaveAttribute('data-with-arrow', 'true');
    });

    it.each<{ type: RegionType; tooltipText: string }>([
      { type: 'LOCAL-ZONE', tooltipText: 'infrastructure.region.zone.local' },
      { type: 'REGION-1-AZ', tooltipText: 'infrastructure.region.zone.1_az' },
      { type: 'REGION-3-AZ', tooltipText: 'infrastructure.region.zone.3_az' },
    ])('should display correct tooltip text for $type', ({ type, tooltipText }) => {
      render(<RegionBadgeType type={type} id={`${type}-tooltip`} />);

      const text = screen.getByTestId('text');
      expect(text).toHaveTextContent(tooltipText);
    });

    it('should apply correct text preset to tooltip content', () => {
      render(<RegionBadgeType type="LOCAL-ZONE" id="text-preset-test" />);

      const text = screen.getByTestId('text');
      expect(text).toHaveAttribute('data-preset', 'caption');
    });

    it('should apply correct className to tooltip text', () => {
      render(<RegionBadgeType type="LOCAL-ZONE" id="text-class-test" />);

      const text = screen.getByTestId('text');
      expect(text).toHaveClass('w-56');
    });
  });

  describe('Component Structure', () => {
    it('should render badge and tooltip together', () => {
      const { container } = render(<RegionBadgeType type="LOCAL-ZONE" id="structure-test" />);

      const badge = screen.getByTestId('badge');
      const tooltip = screen.getByTestId('tooltip');

      expect(badge).toBeInTheDocument();
      expect(tooltip).toBeInTheDocument();
      expect(container.firstChild).toBeTruthy();
    });

    it('should use same id for badge and tooltip triggerId', () => {
      const id = 'same-id-test';
      render(<RegionBadgeType type="LOCAL-ZONE" id={id} />);

      const badge = screen.getByTestId('badge');
      const tooltip = screen.getByTestId('tooltip');

      expect(badge.id).toBe(id);
      expect(tooltip).toHaveAttribute('data-trigger-id', id);
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
        expectedBgClass: '[&::part(badge)]:bg-[--ods-color-primary-100]',
        expectedTooltip: 'infrastructure.region.zone.local',
      },
      {
        type: 'REGION-1-AZ',
        expectedLabel: '1-AZ',
        expectedColor: 'promotion',
        expectedBgClass: '[&::part(badge)]:bg-[--ods-color-primary-400]',
        expectedTooltip: 'infrastructure.region.zone.1_az',
      },
      {
        type: 'REGION-3-AZ',
        expectedLabel: '3-AZ',
        expectedColor: 'promotion',
        expectedBgClass: '[&::part(badge)]:bg-[--ods-color-primary-700]',
        expectedTooltip: 'infrastructure.region.zone.3_az',
      },
    ];

    it.each(testCases)(
      'should render correct properties for $type',
      ({ type, expectedLabel, expectedColor, expectedBgClass, expectedTooltip }) => {
        const id = `test-${type}`;
        render(<RegionBadgeType type={type} id={id} />);

        const badge = screen.getByTestId('badge');
        expect(badge).toHaveAttribute('data-label', expectedLabel);
        expect(badge).toHaveAttribute('data-color', expectedColor);
        expect(badge).toHaveClass(expectedBgClass);

        const text = screen.getByTestId('text');
        expect(text).toHaveTextContent(expectedTooltip);
      },
    );
  });

  describe('Edge Cases', () => {
    it('should handle unique ids for multiple instances', () => {
      const { rerender } = render(<RegionBadgeType type="LOCAL-ZONE" id="first-instance" />);

      let badge = screen.getByTestId('badge');
      expect(badge).toHaveAttribute('id', 'first-instance');

      rerender(<RegionBadgeType type="REGION-1-AZ" id="second-instance" />);

      badge = screen.getByTestId('badge');
      expect(badge).toHaveAttribute('id', 'second-instance');
    });

    it('should render with special characters in id', () => {
      const specialId = 'test-id-123_special-chars';
      render(<RegionBadgeType type="LOCAL-ZONE" id={specialId} />);

      const badge = screen.getByTestId('badge');
      expect(badge).toHaveAttribute('id', specialId);

      const tooltip = screen.getByTestId('tooltip');
      expect(tooltip).toHaveAttribute('data-trigger-id', specialId);
    });

    it('should maintain component structure when type changes', () => {
      const { rerender } = render(<RegionBadgeType type="LOCAL-ZONE" id="type-change-test" />);

      let badge = screen.getByTestId('badge');
      expect(badge).toHaveAttribute('data-label', 'Local Zone');

      rerender(<RegionBadgeType type="REGION-3-AZ" id="type-change-test" />);

      badge = screen.getByTestId('badge');
      expect(badge).toHaveAttribute('data-label', '3-AZ');
      expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have informative icon for accessibility', () => {
      render(<RegionBadgeType type="LOCAL-ZONE" id="a11y-test" />);

      const badge = screen.getByTestId('badge');
      expect(badge).toHaveAttribute('data-icon', 'circle-info');
    });

    it('should associate tooltip with badge via triggerId', () => {
      const id = 'a11y-association-test';
      render(<RegionBadgeType type="LOCAL-ZONE" id={id} />);

      const badge = screen.getByTestId('badge');
      const tooltip = screen.getByTestId('tooltip');

      expect(badge.id).toBe(id);
      expect(tooltip).toHaveAttribute('data-trigger-id', id);
    });

    it('should provide descriptive tooltip text', () => {
      render(<RegionBadgeType type="LOCAL-ZONE" id="a11y-tooltip-test" />);

      const text = screen.getByTestId('text');
      const content = text.textContent;

      expect(content).toBeTruthy();
      expect(content!.length).toBeGreaterThan(10);
    });
  });
});
