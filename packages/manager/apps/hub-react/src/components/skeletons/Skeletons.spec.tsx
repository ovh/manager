import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { Skeletons } from './Skeletons.component';

vi.mock('@ovhcloud/ods-components/react', () => ({
  OsdsSkeleton: ({
    inline,
    randomized,
  }: {
    inline: boolean;
    randomized: boolean;
  }) => (
    <div
      data-testid="osds-skeleton"
      data-inline={inline}
      data-randomized={randomized}
    ></div>
  ),
}));

describe('Skeletons Component', () => {
  it('renders four OsdsSkeleton components', () => {
    render(<Skeletons />);

    const skeletons = screen.getAllByTestId('osds-skeleton');

    expect(skeletons).toHaveLength(4);

    skeletons.forEach((skeleton) => {
      expect(skeleton).toHaveAttribute('data-inline', 'true');
      expect(skeleton).toHaveAttribute('data-randomized', 'true');
    });
  });
});
