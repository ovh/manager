import React from 'react';

import '@testing-library/jest-dom';
import { render } from '@testing-library/react';

import { SkeletonLoading } from './SkeletonLoading';

describe('SkeletonLoading Component', () => {
  it('should render the correct number of skeleton loaders', () => {
    const { container } = render(<SkeletonLoading />);

    const skeletons = container.querySelectorAll('osds-skeleton');
    expect(skeletons).toHaveLength(7);
  });

  it('should have the correct wrapper classes', () => {
    const { container } = render(<SkeletonLoading />);
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('w-[100%]', 'p-10');
  });
});
