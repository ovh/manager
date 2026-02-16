import '@/common/setupTests';
import React from 'react';
import { render, screen } from '@/common/utils/test.provider';
import { describe, expect, it } from 'vitest';
import DatagridColumnTags from './DatagridColumnTags';
import { wrapper } from '@/common/utils/test.provider';

describe('DatagridColumnTags', () => {
  it('should render TagsList when tags are provided', () => {
    const mockTags = {
      environment: 'production',
      team: 'development',
      project: 'webapp',
    };

    render(<DatagridColumnTags tags={mockTags} />, { wrapper });

    expect(screen.getByTestId('tags-list')).toBeInTheDocument();
    expect(screen.getByTestId('tag-environment')).toHaveTextContent(
      'environment: production',
    );
    expect(screen.getByTestId('tag-team')).toHaveTextContent(
      'team: development',
    );
    expect(screen.getByTestId('tag-project')).toHaveTextContent(
      'project: webapp',
    );
  });

  it('should render empty when tags is null', () => {
    render(<DatagridColumnTags tags={null} />, { wrapper });

    expect(screen.queryByTestId('tags-list')).not.toBeInTheDocument();
  });

  it('should render empty when tags is undefined', () => {
    render(
      <DatagridColumnTags tags={undefined as Record<string, string> | null} />,
      { wrapper },
    );

    expect(screen.queryByTestId('tags-list')).not.toBeInTheDocument();
  });

  it('should render TagsList for empty tags object', () => {
    const emptyTags = {};

    render(<DatagridColumnTags tags={emptyTags} />, { wrapper });

    expect(screen.getByTestId('tags-list')).toBeInTheDocument();
    expect(screen.queryByTestId(/tag-/)).not.toBeInTheDocument();
  });

  it('should handle single tag', () => {
    const singleTag = { status: 'active' };

    render(<DatagridColumnTags tags={singleTag} />, { wrapper });

    expect(screen.getByTestId('tags-list')).toBeInTheDocument();
    expect(screen.getByTestId('tag-status')).toHaveTextContent(
      'status: active',
    );
  });

  it('should handle tags with special characters', () => {
    const specialTags = {
      'app-version': '1.2.3',
      'cost-center': 'CC-001',
      owner: 'john.doe@example.com',
    };

    render(<DatagridColumnTags tags={specialTags} />, { wrapper });

    expect(screen.getByTestId('tags-list')).toBeInTheDocument();
    expect(screen.getByTestId('tag-app-version')).toHaveTextContent(
      'app-version: 1.2.3',
    );
    expect(screen.getByTestId('tag-cost-center')).toHaveTextContent(
      'cost-center: CC-001',
    );
    expect(screen.getByTestId('tag-owner')).toHaveTextContent(
      'owner: john.doe@example.com',
    );
  });

  it('should handle tags with empty string values', () => {
    const tagsWithEmptyValues = {
      active: 'true',
      description: '',
      category: 'web',
    };

    render(<DatagridColumnTags tags={tagsWithEmptyValues} />, { wrapper });

    expect(screen.getByTestId('tags-list')).toBeInTheDocument();
    expect(screen.getByTestId('tag-active')).toHaveTextContent('active: true');
    expect(screen.getByTestId('tag-description')).toHaveTextContent(
      'description:',
    );
    expect(screen.getByTestId('tag-category')).toHaveTextContent(
      'category: web',
    );
  });
});
