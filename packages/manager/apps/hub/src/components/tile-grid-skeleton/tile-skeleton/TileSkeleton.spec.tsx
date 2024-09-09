import React from 'react';
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import TileSkeleton from '@/components/tile-grid-skeleton/tile-skeleton/TileSkeleton.component';

describe('TileGridSkeleton', () => {
  it('should display a skeleton for the title and 4 inner skeletons', async () => {
    const { getByTestId } = render(<TileSkeleton />);

    const headerContainer = getByTestId('tile_skeleton_header');
    expect(headerContainer).not.toBeNull();
    expect(headerContainer.children.length).toBe(2);
    const contentContainer = getByTestId('tile_skeleton_content');
    expect(contentContainer).not.toBeNull();
    expect(contentContainer.children.length).toBe(2);
  });
});
