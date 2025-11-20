import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import Flag from './Flag.component';

describe('Flag component', () => {
  it('renders flag', async () => {
    render(<Flag flagName="fr" className="w-4 h-4" />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.getByTestId('flag-container')).toBeTruthy();
    });
  });
});
