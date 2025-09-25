import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LargeSpinner from './LargeSpinner';
import { createWrapper } from '@/wrapperRenders';

describe('LargeSpinner', () => {
  const renderComponent = (props = {}) =>
    render(<LargeSpinner {...props} />, { wrapper: createWrapper() });

  it('should render the spinner', () => {
    renderComponent();

    const spinner = document.querySelector('.large-spinner');
    expect(spinner).toBeInTheDocument();

    const svgElements = document.querySelectorAll('.large-spinner svg');
    expect(svgElements).toHaveLength(3);
  });

  it('should render children content when provided', () => {
    const testContent = 'Loading project...';
    renderComponent({ children: testContent });

    expect(screen.getByText(testContent)).toBeInTheDocument();
  });

  it('should render without children when none provided', () => {
    renderComponent();

    const contentContainer = document.querySelector('.large-spinner-content');
    expect(contentContainer).toBeInTheDocument();
    expect(contentContainer).toBeEmptyDOMElement();
  });
});
