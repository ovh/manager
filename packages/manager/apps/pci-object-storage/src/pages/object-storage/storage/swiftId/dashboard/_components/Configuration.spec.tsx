import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import * as reactRouterDom from 'react-router-dom';
import Configuration from './Configuration.component';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const mod = await vi.importActual<typeof reactRouterDom>('react-router-dom');
  return {
    ...mod,
    useParams: () => ({ swiftId: 'test-swift-id' }),
    useNavigate: () => mockNavigate,
  };
});

describe('Configuration', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

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
