import React from 'react';

import { MemoryRouter } from 'react-router-dom';

import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import { useActionClick } from '@/hooks';

// Mock window.open
const mockWindowOpen = vi.fn();
Object.defineProperty(window, 'open', {
  writable: true,
  value: mockWindowOpen,
});

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('useActionClick', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call navigate for internal links', () => {
    // Arrange
    const { result } = renderHook(() => useActionClick(), {
      wrapper: ({ children }: { children: React.ReactNode }) => (
        <MemoryRouter>{children}</MemoryRouter>
      ),
    });

    // Act
    result.current('/dashboard', false);

    // Assert
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    expect(mockWindowOpen).not.toHaveBeenCalled();
  });

  it('should call window.open for external links', () => {
    // Arrange
    const { result } = renderHook(() => useActionClick(), {
      wrapper: ({ children }: { children: React.ReactNode }) => (
        <MemoryRouter>{children}</MemoryRouter>
      ),
    });

    // Act
    result.current('https://example.com', true);

    // Assert
    expect(mockWindowOpen).toHaveBeenCalledWith('https://example.com', '_blank');
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should handle multiple internal link clicks', () => {
    // Arrange
    const { result } = renderHook(() => useActionClick(), {
      wrapper: ({ children }: { children: React.ReactNode }) => (
        <MemoryRouter>{children}</MemoryRouter>
      ),
    });

    // Act
    result.current('/page1', false);
    result.current('/page2', false);
    result.current('/page3', false);

    // Assert
    expect(mockNavigate).toHaveBeenCalledTimes(3);
    expect(mockNavigate).toHaveBeenNthCalledWith(1, '/page1');
    expect(mockNavigate).toHaveBeenNthCalledWith(2, '/page2');
    expect(mockNavigate).toHaveBeenNthCalledWith(3, '/page3');
  });

  it('should handle multiple external link clicks', () => {
    // Arrange
    const { result } = renderHook(() => useActionClick(), {
      wrapper: ({ children }: { children: React.ReactNode }) => (
        <MemoryRouter>{children}</MemoryRouter>
      ),
    });

    // Act
    result.current('https://example.com', true);
    result.current('https://test.com', true);

    // Assert
    expect(mockWindowOpen).toHaveBeenCalledTimes(2);
    expect(mockWindowOpen).toHaveBeenNthCalledWith(1, 'https://example.com', '_blank');
    expect(mockWindowOpen).toHaveBeenNthCalledWith(2, 'https://test.com', '_blank');
  });

  it('should handle mixed internal and external links', () => {
    // Arrange
    const { result } = renderHook(() => useActionClick(), {
      wrapper: ({ children }: { children: React.ReactNode }) => (
        <MemoryRouter>{children}</MemoryRouter>
      ),
    });

    // Act
    result.current('/internal', false);
    result.current('https://external.com', true);
    result.current('/another-internal', false);

    // Assert
    expect(mockNavigate).toHaveBeenCalledTimes(2);
    expect(mockNavigate).toHaveBeenNthCalledWith(1, '/internal');
    expect(mockNavigate).toHaveBeenNthCalledWith(2, '/another-internal');
    expect(mockWindowOpen).toHaveBeenCalledTimes(1);
    expect(mockWindowOpen).toHaveBeenCalledWith('https://external.com', '_blank');
  });

  it('should handle empty string links', () => {
    // Arrange
    const { result } = renderHook(() => useActionClick(), {
      wrapper: ({ children }: { children: React.ReactNode }) => (
        <MemoryRouter>{children}</MemoryRouter>
      ),
    });

    // Act
    result.current('', false);

    // Assert
    expect(mockNavigate).toHaveBeenCalledWith('');
    expect(mockWindowOpen).not.toHaveBeenCalled();
  });

  it('should handle complex internal routes', () => {
    // Arrange
    const { result } = renderHook(() => useActionClick(), {
      wrapper: ({ children }: { children: React.ReactNode }) => (
        <MemoryRouter>{children}</MemoryRouter>
      ),
    });

    // Act
    result.current('/dashboard/metrics/123?tab=overview', false);

    // Assert
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard/metrics/123?tab=overview');
  });
});
