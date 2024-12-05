import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { LoadingText, LoadingTextProps } from './LoadingText.component';

const renderComponent = ({ title, description }: LoadingTextProps) => {
  return render(<LoadingText title={title} description={description} />);
};

describe('LoadingText Component', () => {
  it('should display a loader with a text aside and a description', async () => {
    const { getByTestId, getByText } = renderComponent({
      title: 'test',
      description: 'description',
    });
    expect(getByTestId('loading-text-spinner')).toBeDefined();
    expect(getByText('test')).toBeDefined();
    expect(getByText('description')).toBeDefined();
  });
});
