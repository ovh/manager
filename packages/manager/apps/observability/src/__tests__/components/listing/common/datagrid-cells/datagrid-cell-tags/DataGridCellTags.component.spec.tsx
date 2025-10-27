import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import DataGridCellTags from '@/components/listing/common/datagrid-cells/datagrid-cell-tags/DataGridCellTags.component';
import { DataGridCellTagsProps } from '@/components/listing/common/datagrid-cells/datagrid-cell-tags/DataGridCellTags.props';

// Mock ODS components
vi.mock('@ovhcloud/ods-components/react', () => ({
  OdsBadge: ({ label, size, color }: { label: string; size: string; color: string }) => (
    <span data-testid="badge-tag" data-size={size} data-color={color}>
      {label}
    </span>
  ),
}));

vi.mock('@ovhcloud/ods-components', () => ({
  ODS_BADGE_SIZE: {
    md: 'md',
  },
  ODS_BADGE_COLOR: {
    neutral: 'neutral',
  },
}));

describe('DataGridCellTags', () => {
  const defaultProps: DataGridCellTagsProps = {
    tags: ['production', 'monitoring', 'critical'],
  };

  describe('Rendering', () => {
    it('should render all tags as badges', () => {
      render(<DataGridCellTags {...defaultProps} />);

      const badges = screen.getAllByTestId('badge-tag');
      expect(badges).toHaveLength(3);
    });

    it('should render tags with correct labels', () => {
      render(<DataGridCellTags {...defaultProps} />);

      expect(screen.getByText('production')).toBeInTheDocument();
      expect(screen.getByText('monitoring')).toBeInTheDocument();
      expect(screen.getByText('critical')).toBeInTheDocument();
    });

    it('should apply correct CSS classes', () => {
      const { container } = render(<DataGridCellTags {...defaultProps} />);

      const gridContainer = container.querySelector('.grid.grid-cols-3.gap-3.w-max');
      expect(gridContainer).toBeInTheDocument();
    });

    it('should render badges with correct attributes', () => {
      render(<DataGridCellTags {...defaultProps} />);

      const badges = screen.getAllByTestId('badge-tag');
      expect(badges).toHaveLength(3);

      badges.forEach((badge) => {
        expect(badge).toHaveAttribute('data-size', 'md');
        expect(badge).toHaveAttribute('data-color', 'neutral');
      });
    });
  });

  describe('Empty Tags', () => {
    it('should return null when tags array is empty', () => {
      const { container } = render(<DataGridCellTags tags={[]} />);

      expect(container.firstChild).toBeNull();
    });

    it('should return null when tags is null', () => {
      const { container } = render(<DataGridCellTags tags={null as unknown as string[]} />);

      expect(container.firstChild).toBeNull();
    });

    it('should return null when tags is undefined', () => {
      const { container } = render(<DataGridCellTags tags={undefined as unknown as string[]} />);

      expect(container.firstChild).toBeNull();
    });
  });

  describe('Single Tag', () => {
    it('should render single tag correctly', () => {
      render(<DataGridCellTags tags={['single-tag']} />);

      const badges = screen.getAllByTestId('badge-tag');
      expect(badges).toHaveLength(1);
      expect(screen.getByText('single-tag')).toBeInTheDocument();
    });
  });

  describe('Multiple Tags', () => {
    it('should render multiple tags with correct keys', () => {
      const tags = ['tag1', 'tag2', 'tag3', 'tag4', 'tag5'];
      render(<DataGridCellTags tags={tags} />);

      const badges = screen.getAllByTestId('badge-tag');
      expect(badges).toHaveLength(5);
    });

    it('should handle large number of tags', () => {
      const manyTags = Array.from({ length: 20 }, (_, i) => `tag-${i}`);
      render(<DataGridCellTags tags={manyTags} />);

      const badges = screen.getAllByTestId('badge-tag');
      expect(badges).toHaveLength(20);
    });
  });

  describe('Special Characters', () => {
    it('should handle tags with special characters', () => {
      const specialTags = [
        'tag with spaces',
        'tag-with-dashes',
        'tag_with_underscores',
        'tag.with.dots',
        'tag"with"quotes',
        'tag<with>tags',
        'tag&with&symbols',
      ];

      render(<DataGridCellTags tags={specialTags} />);

      const badges = screen.getAllByTestId('badge-tag');
      expect(badges).toHaveLength(specialTags.length);

      specialTags.forEach((tag) => {
        expect(screen.getByText(tag)).toBeInTheDocument();
      });
    });

    it('should handle tags with unicode characters', () => {
      const unicodeTags = ['tag-é', 'tag-ñ', 'tag-中文', 'tag-🚀', 'tag-αβγ'];

      render(<DataGridCellTags tags={unicodeTags} />);

      const badges = screen.getAllByTestId('badge-tag');
      expect(badges).toHaveLength(unicodeTags.length);

      unicodeTags.forEach((tag) => {
        expect(screen.getByText(tag)).toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string tags', () => {
      render(<DataGridCellTags tags={['', 'valid-tag', '']} />);

      const badges = screen.getAllByTestId('badge-tag');
      expect(badges).toHaveLength(3);
      expect(screen.getByText('valid-tag')).toBeInTheDocument();
    });

    it('should handle very long tag names', () => {
      const longTag = 'a'.repeat(100);
      render(<DataGridCellTags tags={[longTag]} />);

      expect(screen.getByText(longTag)).toBeInTheDocument();
    });

    it('should handle tags with only whitespace', () => {
      render(<DataGridCellTags tags={['   ', '\t', '\n']} />);

      const badges = screen.getAllByTestId('badge-tag');
      expect(badges).toHaveLength(3);
    });
  });

  describe('Component Structure', () => {
    it('should have correct DOM structure', () => {
      const { container } = render(<DataGridCellTags {...defaultProps} />);

      const gridContainer = container.querySelector('.grid');
      expect(gridContainer).toBeInTheDocument();
      expect(gridContainer).toHaveClass('grid-cols-3', 'gap-3', 'w-max');
    });

    it('should render badges in correct order', () => {
      const tags = ['first', 'second', 'third'];
      render(<DataGridCellTags tags={tags} />);

      const badges = screen.getAllByTestId('badge-tag');
      expect(badges).toHaveLength(3);

      expect(badges[0]).toHaveTextContent('first');
      expect(badges[1]).toHaveTextContent('second');
      expect(badges[2]).toHaveTextContent('third');
    });
  });

  describe('Performance', () => {
    it('should not re-render unnecessarily', () => {
      const { rerender } = render(<DataGridCellTags {...defaultProps} />);

      const initialBadges = screen.getAllByTestId('badge-tag');

      // Re-render with same props
      rerender(<DataGridCellTags {...defaultProps} />);

      const rerenderedBadges = screen.getAllByTestId('badge-tag');
      expect(rerenderedBadges).toHaveLength(initialBadges.length);
    });

    it('should handle frequent updates', () => {
      const { rerender } = render(<DataGridCellTags tags={['tag1']} />);

      // Update with different tags multiple times
      for (let i = 0; i < 10; i++) {
        rerender(<DataGridCellTags tags={[`tag-${i}`]} />);
        expect(screen.getByText(`tag-${i}`)).toBeInTheDocument();
      }
    });
  });

  describe('Accessibility', () => {
    it('should render badges as semantic elements', () => {
      render(<DataGridCellTags {...defaultProps} />);

      const badges = screen.getAllByTestId('badge-tag');
      badges.forEach((badge) => {
        expect(badge.tagName).toBe('SPAN');
      });
    });

    it('should maintain proper text content for screen readers', () => {
      render(<DataGridCellTags {...defaultProps} />);

      expect(screen.getByText('production')).toBeInTheDocument();
      expect(screen.getByText('monitoring')).toBeInTheDocument();
      expect(screen.getByText('critical')).toBeInTheDocument();
    });
  });

  describe('Badge Configuration', () => {
    it('should use correct badge size and color', () => {
      render(<DataGridCellTags {...defaultProps} />);

      const badges = screen.getAllByTestId('badge-tag');
      badges.forEach((badge) => {
        expect(badge).toHaveAttribute('data-size', 'md');
        expect(badge).toHaveAttribute('data-color', 'neutral');
      });
    });

    it('should maintain consistent styling across all badges', () => {
      const tags = ['tag1', 'tag2', 'tag3', 'tag4', 'tag5'];
      render(<DataGridCellTags tags={tags} />);

      const badges = screen.getAllByTestId('badge-tag');
      badges.forEach((badge) => {
        expect(badge).toHaveAttribute('data-size', 'md');
        expect(badge).toHaveAttribute('data-color', 'neutral');
      });
    });
  });
});
