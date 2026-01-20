import React from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { SkeletonWrapper } from '@/components/dashboard/SkeletonWrapper.component';

vi.mock('@ovhcloud/ods-react', () => ({
  Skeleton: () => <div data-testid="skeleton">Loading...</div>,
}));

describe('SkeletonWrapper', () => {
  it('should render Skeleton when isLoading is true', () => {
    // Act
    render(
      <SkeletonWrapper isLoading>
        <span>Content</span>
      </SkeletonWrapper>,
    );

    // Assert
    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  it('should render children when isLoading is false', () => {
    // Act
    render(
      <SkeletonWrapper isLoading={false}>
        <span data-testid="child-content">Content</span>
      </SkeletonWrapper>,
    );

    // Assert
    expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});
