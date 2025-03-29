import '@/setupTests';
import React from 'react';
import { describe, it } from 'vitest';
import '@testing-library/jest-dom';
import { render, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DashboardPage from '@/pages/dashboard/Dashboard';

describe('dashboard test', () => {
  it('should display the tabs', async () => {
    const { getByText } = render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>,
    );

    await waitFor(() => {
      const tab = getByText('domain_operations_dashboard_title');
      expect(tab).toBeDefined();
      expect(tab).not.toHaveAttribute('active');
    });
  });
});
