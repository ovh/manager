import { describe, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import Ellipsis from '@/components/datagrid/pagination/Ellipsis';

describe('Datagrid Pagination Ellipsis', () => {
  it('render default ellipsis', async () => {
    render(<Ellipsis />);

    const tooltipContent = screen.getByText('…');

    await waitFor(() => {
      expect(tooltipContent).toBeInTheDocument();
    });
  });
});
