import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Configuration from './Configuration.component';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const mod = await vi.importActual('react-router-dom');
  return {
    ...mod,
    useParams: () => ({
      projectId: 'projectId',
      swiftId: 'test-swift-id',
    }),
    useNavigate: () => mockNavigate,
  };
});

describe('Configuration', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should display swiftId in copyable field', () => {
    render(<Configuration />, { wrapper: RouterWithQueryClientWrapper });

    expect(screen.getByRole('textbox')).toHaveTextContent('test-swift-id');
  });

  it('should navigate to delete route when delete button is clicked', () => {
    render(<Configuration />, { wrapper: RouterWithQueryClientWrapper });

    fireEvent.click(screen.getByTestId('swift-config-delete-button'));

    expect(mockNavigate).toHaveBeenCalledWith('./delete');
  });
});
