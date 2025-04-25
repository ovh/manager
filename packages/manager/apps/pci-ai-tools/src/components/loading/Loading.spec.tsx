import { render, screen, waitFor } from '@testing-library/react';
import { describe, it } from 'vitest';
import Loading from '@/components/loading/Loading.component';

describe('Loading component', () => {
  it('should display the loading component', async () => {
    render(<Loading />);
    await waitFor(() => {
      expect(screen.getByTestId('loading-container')).toBeTruthy();
      expect(screen.getByTestId('osds-spinner')).toBeTruthy();
    });
  });
});
