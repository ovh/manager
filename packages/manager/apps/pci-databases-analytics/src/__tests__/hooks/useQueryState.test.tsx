import { vi } from 'vitest';
import { renderHook, act, waitFor, screen } from '@testing-library/react';
import * as ReactRouter from 'react-router-dom';
import { useQueryState } from '@/hooks/useQueryState';
import '@testing-library/jest-dom';

/**
 * Displays the current location in order to test the syncing between the state of the hook and the url
 */
const LocationDisplay = () => {
  const location = ReactRouter.useLocation();
  return (
    <div data-testid="location-display">{`${location.pathname}${location.search}`}</div>
  );
};

const wrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <ReactRouter.MemoryRouter initialEntries={['/test']}>
      {children}
      <LocationDisplay />
    </ReactRouter.MemoryRouter>
  );
};

describe('useQueryState', () => {
  it('should set the state in the url', async () => {
    const { result } = renderHook(() => useQueryState('param'), { wrapper });
    const spy = vi.spyOn(ReactRouter, 'useNavigate');
    act(() => {
      result.current[1]('value');
    });
    await waitFor(() => {
      expect(result.current[0]).toBe('value');
      expect(spy).toHaveBeenCalled();
      expect(screen.getByText('/test?param=value')).toBeInTheDocument();
    });
  });
  it('should remove the state from the url when undefined', async () => {
    const { result } = renderHook(() => useQueryState('param'), { wrapper });
    const spy = vi.spyOn(ReactRouter, 'useNavigate');
    act(() => {
      result.current[1]('value');
    });
    await waitFor(() => {
      expect(result.current[0]).toBe('value');
      expect(spy).toHaveBeenCalled();
      expect(screen.getByText('/test?param=value')).toBeInTheDocument();
    });
    // remove the state
    act(() => {
      result.current[1](undefined);
    });
    await waitFor(() => {
      expect(result.current[0]).toBe(undefined);
      expect(spy).toHaveBeenCalled();
      expect(screen.getByText('/test')).toBeInTheDocument();
    });
  });
});
