import { describe, it } from 'vitest';
import { act, renderHook, screen, waitFor } from '@testing-library/react';
import { DEFAULT_OPEN_VALUE, useModale } from '@/hooks/useModale';
import { RouterWithLocationWrapper } from '../__tests__/helpers/wrappers/RouterWithLocationWrapper';

describe('useModale', () => {
  it('should init properly', async () => {
    const { result } = renderHook(() => useModale('modalKey'), {
      wrapper: RouterWithLocationWrapper,
    });
    await waitFor(() => {
      expect(result.current.isOpen).toBe(false);
      expect(result.current.value).toBe(undefined);
      expect(screen.getByText('/test')).toBeInTheDocument();
    });
  });

  it('should open properly with DEFAULT_OPEN_VALUE', async () => {
    const modalkey = 'modalKey';
    const page = '/modal';
    const { result } = renderHook(() => useModale(modalkey), {
      wrapper: ({ children }) => (
        <RouterWithLocationWrapper initialEntries={[page]}>
          {children}
        </RouterWithLocationWrapper>
      ),
    });
    act(() => {
      result.current.open();
    });
    await waitFor(() => {
      expect(result.current.isOpen).toBe(true);
      expect(result.current.value).toBe(DEFAULT_OPEN_VALUE);
      expect(
        screen.getByText(`${page}?${modalkey}=${DEFAULT_OPEN_VALUE}`),
      ).toBeInTheDocument();
    });
  });

  it('should open properly with custom value', async () => {
    const modalkey = 'modalKey';
    const page = '/modal';
    const customValue = '123456';
    const { result } = renderHook(() => useModale(modalkey), {
      wrapper: ({ children }) => (
        <RouterWithLocationWrapper initialEntries={[page]}>
          {children}
        </RouterWithLocationWrapper>
      ),
    });
    act(() => {
      result.current.open(customValue);
    });
    await waitFor(() => {
      expect(result.current.isOpen).toBe(true);
      expect(result.current.value).toBe(customValue);
      expect(
        screen.getByText(`${page}?${modalkey}=${customValue}`),
      ).toBeInTheDocument();
    });
  });

  it('should close properly', async () => {
    const modalkey = 'modalKey';
    const page = '/modal';
    const customValue = '123456';
    const { result } = renderHook(() => useModale(modalkey), {
      wrapper: ({ children }) => (
        <RouterWithLocationWrapper initialEntries={[page]}>
          {children}
        </RouterWithLocationWrapper>
      ),
    });
    act(() => {
      result.current.open(customValue);
      result.current.close();
    });
    await waitFor(() => {
      expect(result.current.isOpen).toBe(false);
      expect(result.current.value).toBe(undefined);
      expect(screen.getByText(`${page}`)).toBeInTheDocument();
    });
  });

  it('should toggle properly', async () => {
    const modalkey = 'modalKey';
    const page = '/modal';
    const { result } = renderHook(() => useModale(modalkey), {
      wrapper: ({ children }) => (
        <RouterWithLocationWrapper initialEntries={[page]}>
          {children}
        </RouterWithLocationWrapper>
      ),
    });
    await waitFor(() => {
      expect(result.current.isOpen).toBe(false);
    });
    act(() => {
      result.current.open();
    });
    await waitFor(() => {
      expect(result.current.isOpen).toBe(true);
    });
    act(() => {
      result.current.toggle();
    });
    await waitFor(() => {
      expect(result.current.isOpen).toBe(false);
    });
    act(() => {
      result.current.toggle();
    });
    await waitFor(() => {
      expect(result.current.isOpen).toBe(true);
    });
  });

  it('should expose a controller', async () => {
    const modalkey = 'modalKey';
    const page = '/modal';
    const { result } = renderHook(() => useModale(modalkey), {
      wrapper: ({ children }) => (
        <RouterWithLocationWrapper initialEntries={[page]}>
          {children}
        </RouterWithLocationWrapper>
      ),
    });
    await waitFor(() => {
      expect(result.current.controller.open).toBe(false);
    });
    act(() => {
      result.current.open();
    });
    await waitFor(() => {
      expect(result.current.controller.open).toBe(true);
    });
    act(() => {
      result.current.controller.onOpenChange(true);
    });
    await waitFor(() => {
      expect(result.current.isOpen).toBe(true);
    });
    act(() => {
      result.current.controller.onOpenChange(false);
    });
    await waitFor(() => {
      expect(result.current.isOpen).toBe(false);
    });
  });
});
