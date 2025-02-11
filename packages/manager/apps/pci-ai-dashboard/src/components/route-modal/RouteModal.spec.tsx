import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import RouteModal from './RouteModal';

const mockedUsedNavigate = vi.fn();
describe('Route Modal component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  vi.mock('react-router-dom', async () => {
    const mod = await vi.importActual('react-router-dom');
    return {
      ...mod,
      useNavigate: () => mockedUsedNavigate,
    };
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
