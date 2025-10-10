import { screen, fireEvent } from '@testing-library/react';
import { vitest } from 'vitest';
import { TagsTile } from '../TagsTile.component';
import { render } from '../../../../setupTest';
import fr_FR from '../translations/Messages_fr_FR.json';

describe('TagsTile component', () => {
  const mockOnEditTags = vitest.fn();

  afterEach(() => {
    vitest.clearAllMocks();
  });

  describe('when tags are empty', () => {
    it('should display empty state message', () => {
      render(<TagsTile tags={{}} onEditTags={mockOnEditTags} />);

      expect(screen.getByText(fr_FR.tags_tile_empty)).toBeInTheDocument();
    });

    it('should display "Add a tag" link when no tags', () => {
      render(<TagsTile tags={{}} onEditTags={mockOnEditTags} />);

      expect(screen.getByText(fr_FR.tags_tile_add_tag)).toBeInTheDocument();
    });

    it('should call onEditTags when clicking add tag link', () => {
      render(<TagsTile tags={{}} onEditTags={mockOnEditTags} />);

      const addTagLink = screen.getByText(fr_FR.tags_tile_add_tag);
      fireEvent.click(addTagLink);

      expect(mockOnEditTags).toHaveBeenCalledTimes(1);
    });
  });

  describe('when tags are provided', () => {
    const mockTags = {
      environment: 'production',
      team: 'frontend',
      version: '1.0.0',
    };

    it('should display the tags tile title', () => {
      render(<TagsTile tags={mockTags} onEditTags={mockOnEditTags} />);

      expect(screen.getByText(fr_FR.tags_tile_title)).toBeInTheDocument();
    });

    it('should display "Manage tags" link when tags exist', () => {
      render(<TagsTile tags={mockTags} onEditTags={mockOnEditTags} />);

      expect(screen.getByText(fr_FR.manage_tags)).toBeInTheDocument();
    });

    it('should call onEditTags when clicking manage tags link', () => {
      render(<TagsTile tags={mockTags} onEditTags={mockOnEditTags} />);

      const manageTagsLink = screen.getByText(fr_FR.manage_tags);
      fireEvent.click(manageTagsLink);

      expect(mockOnEditTags).toHaveBeenCalledTimes(1);
    });

    it('should not display empty state message', () => {
      render(<TagsTile tags={mockTags} onEditTags={mockOnEditTags} />);

      expect(screen.queryByText(fr_FR.tags_tile_empty)).not.toBeInTheDocument();
    });
  });

  describe('props handling', () => {
    it('should work without onEditTags callback', () => {
      render(<TagsTile tags={{}} />);

      const addTagLink = screen.getByText(fr_FR.tags_tile_add_tag);
      fireEvent.click(addTagLink);

      // Should not throw error
      expect(addTagLink).toBeInTheDocument();
    });

    it('should handle null tags', () => {
      render(<TagsTile tags={null} onEditTags={mockOnEditTags} />);

      expect(screen.getByText(fr_FR.tags_tile_empty)).toBeInTheDocument();
    });

    it('should handle undefined tags', () => {
      render(<TagsTile tags={undefined} onEditTags={mockOnEditTags} />);

      expect(screen.getByText(fr_FR.tags_tile_empty)).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should render link with href attribute', () => {
      render(<TagsTile tags={{}} onEditTags={mockOnEditTags} />);

      const link = screen.getByText(fr_FR.tags_tile_add_tag);
      expect(link).toHaveAttribute('href', '#');
    });

    it('should prevent default link behavior on click', () => {
      render(<TagsTile tags={{}} onEditTags={mockOnEditTags} />);

      const link = screen.getByText(fr_FR.tags_tile_add_tag);
      const event = fireEvent.click(link);

      expect(event).toBe(false); // preventDefault was called
    });
  });
});
