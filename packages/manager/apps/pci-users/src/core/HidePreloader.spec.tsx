import { describe, vi } from 'vitest';
import { render } from '@testing-library/react';
import { useUX } from '@ovh-ux/manager-react-shell-client';
import HidePreloader from './HidePreloader';

vi.mock('@ovh-ux/manager-react-shell-client', () => {
  const hidePreloader = vi.fn(() => {});
  return {
    useUX: () => ({
      hidePreloader,
    }),
  };
});

describe('HidePreloader', () => {
  it('should call hidePreloader function from shell ux plugin', async () => {
    expect(useUX().hidePreloader).not.toHaveBeenCalled();
    render(<HidePreloader />);
    expect(useUX().hidePreloader).toHaveBeenCalled();
  });
});
