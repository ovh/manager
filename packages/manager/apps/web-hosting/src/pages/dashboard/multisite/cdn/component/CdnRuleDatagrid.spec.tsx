import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { describe, it } from 'vitest';

import CdnRuleDatagrid from './CdnRuleDatagrid';

const queryClient = new QueryClient();

describe('useDatagridColumn', () => {
  it.skip('should return correct columns', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <CdnRuleDatagrid range="range" />
      </QueryClientProvider>,
    );

    expect(screen.getByTestId('header-priority')).not.toBeNull();
    expect(screen.getByTestId('header-rule')).not.toBeNull();
    expect(screen.getByTestId('header-type')).not.toBeNull();
    expect(screen.getByTestId('header-resource')).not.toBeNull();
    expect(screen.getByTestId('header-time')).not.toBeNull();
    expect(screen.getByTestId('header-status')).not.toBeNull();
    expect(screen.getByTestId('header-action')).not.toBeNull();
  });
});
