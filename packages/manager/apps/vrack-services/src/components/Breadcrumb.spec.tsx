// V Should be first V
import '@/test-utils/setupTests';
// -----
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { Breadcrumb, BreadcrumbProps } from './Breadcrumb.component';

/** Render */
const renderComponent = ({ items, overviewUrl }: BreadcrumbProps) => {
  return render(<Breadcrumb items={items} overviewUrl={overviewUrl} />);
};

/** END RENDER */

describe('Breadcrumb Component', () => {
  it('should display ODS breadcrumb', async () => {
    const { getByRole } = renderComponent({
      items: [],
    });

    await waitFor(() => {
      expect(getByRole('navigation')).toBeDefined();
    });
  });
});
