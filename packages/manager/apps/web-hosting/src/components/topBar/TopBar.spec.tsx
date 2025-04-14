import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it } from 'vitest';
import '@testing-library/jest-dom';
import Topbar from '@/components/topBar/TopBar.component';

describe('Topbar component', () => {
  it('should display Topbar component', async () => {
    render(<Topbar />);
    const orderSsl = screen.getByTestId('order-ssl');
    const importrSsl = screen.getByTestId('import-ssl');
    expect(orderSsl).toBeInTheDocument();
    expect(importrSsl).toBeInTheDocument();
  });
});
