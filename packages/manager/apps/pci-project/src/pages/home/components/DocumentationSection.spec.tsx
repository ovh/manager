/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { setupAllMocks, mockDocumentationLinks } from '@/data/__mocks__';
import DocumentationSection from './DocumentationSection.component';

setupAllMocks();

describe('DocumentationSection', () => {
  it('renders links to documentation', async () => {
    render(<DocumentationSection links={mockDocumentationLinks} />);
    expect(screen.getAllByTestId('ods-link')).toHaveLength(
      mockDocumentationLinks.length,
    );
  });
});
