import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useIsDesktop } from '@/zone/hooks/useIsDesktop';

describe('useIsDesktop', () => {
    let mockMatchMedia: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        mockMatchMedia = vi.fn();
        Object.defineProperty(globalThis, 'matchMedia', {
            writable: true,
            value: mockMatchMedia,
        });
    });

    it('returns true when viewport matches (min-width: 48em)', () => {
        mockMatchMedia.mockReturnValue({
            matches: true,
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
        });
        const { result } = renderHook(() => useIsDesktop());
        expect(result.current).toBe(true);
    });

    it('returns false when viewport does not match (min-width: 48em)', () => {
        mockMatchMedia.mockReturnValue({
            matches: false,
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
        });
        const { result } = renderHook(() => useIsDesktop());
        expect(result.current).toBe(false);
    });

    it('subscribes to media query changes', () => {
        const addEventListener = vi.fn();
        const removeEventListener = vi.fn();
        mockMatchMedia.mockReturnValue({
            matches: true,
            addEventListener,
            removeEventListener,
        });
        const { unmount } = renderHook(() => useIsDesktop());
        expect(addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
        unmount();
        expect(removeEventListener).toHaveBeenCalledWith(
            'change',
            expect.any(Function),
        );
    });
});
