import { vi } from 'vitest';
import { renderHook, act, waitFor, screen } from '@testing-library/react';
import * as ReactRouter from 'react-router-dom';
import { useQueryState } from '@/hooks/useQueryState';
import { RouterWithLocationWrapper } from '@/__tests__/helpers/wrappers/RouterWithLocationWrapper';

describe('useQueryState', () => {
  it('should set the state in the url', async () => {
    const { result } = renderHook(() => useQueryState('param'), {
      wrapper: RouterWithLocationWrapper,
    });
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
    const { result } = renderHook(() => useQueryState('param'), {
      wrapper: RouterWithLocationWrapper,
    });
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
