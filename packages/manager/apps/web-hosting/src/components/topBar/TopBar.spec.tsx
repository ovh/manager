import React from 'react';

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, it } from 'vitest';

import Topbar from '@/components/topBar/TopBar.component';
import { wrapper } from '@/utils/test.provider';

describe('Topbar component', () => {
  it('should display Topbar component', () => {
    render(<Topbar />, { wrapper });
    const orderSsl = screen.getByTestId('order-ssl');
    const importrSsl = screen.getByTestId('import-ssl');
    expect(orderSsl).toBeInTheDocument();
    expect(importrSsl).toBeInTheDocument();
  });
});
