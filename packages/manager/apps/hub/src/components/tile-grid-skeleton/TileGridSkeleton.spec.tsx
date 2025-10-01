import React from 'react';

import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import TileGridSkeleton from '@/components/tile-grid-skeleton/TileGridSkeleton.component';

describe('TileGridSkeleton', () => {
  it('should display a skeleton for the title and 6 inner skeletons', async () => {
    const { getByTestId } = render(<TileGridSkeleton />);

    expect(getByTestId('tile_grid_title_skeleton')).not.toBeNull();
    const contentContainer = getByTestId('tile_grid_content_skeletons');
    expect(contentContainer).not.toBeNull();
    expect(contentContainer.children.length).toBe(6);
  });
});
