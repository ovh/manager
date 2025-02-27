import { describe, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { mockedUsedNavigate } from '@/__tests__/helpers/mockRouterDomHelper';
import RouteModal from './RouteModal';

describe('Route Modal component', () => {
  beforeEach(() => {
    mockedUsedNavigate();
  });
  const onClose = vi.fn();
  it('renders Route Modal Skeleton on isLoading', async () => {
    render(
      <RouteModal
        backUrl={'../'}
        isLoading={true}
        onClose={onClose}
        children={<>HelloWorld</>}
      />,
    );
    await waitFor(() => {
      expect(screen.getByTestId('dialog-container')).toBeInTheDocument();
    });
  });

  it('renders Route Modal HelloWorld', async () => {
    render(
      <RouteModal
        backUrl={'../'}
        isLoading={false}
        onClose={onClose}
        children={<div>HelloWorld</div>}
      />,
    );
    await waitFor(() => {
      expect(screen.getByText('HelloWorld')).toBeInTheDocument();
    });
  });
});
