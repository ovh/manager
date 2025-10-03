import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import { User } from '@/context/User/context';
import { useSessionModal } from '@/context/User/useSessionModal';
import { useFetchServerTime } from '@/data/hooks/useUtils';

vi.mock('@/data/hooks/useUtils', () => ({
  useFetchServerTime: vi.fn(),
}));

const fakeUrl = 'http://example.com/login';

vi.mock('@/utils/url-builder', () => ({
  getRedirectLoginUrl: vi.fn(() => fakeUrl),
}));

const assignMock = vi.fn();

describe('useSessionModal', () => {
  const mockUser: Partial<User> = {
    exp: 0.002,
    iat: 0,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(0);
    Object.defineProperty(window, 'location', {
      value: {
        ...window.location,
        assign: assignMock,
      },
      writable: true,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should initialize modal states as false', () => {
    (useFetchServerTime as jest.Mock).mockReturnValue({
      data: 0,
      isError: false,
      isFetched: false,
    });

    const { result } = renderHook(() => useSessionModal(mockUser as User, 0.5));

    expect(result.current.showWarningModal).toBe(false);
    expect(result.current.showExpiredModal).toBe(false);
  });

  it('should redirect in expected url when the user is undefined', async () => {
    (useFetchServerTime as jest.Mock).mockReturnValue({
      data: undefined,
      isError: true,
      isFetched: true,
    });

    renderHook(() => useSessionModal(undefined, 0.5));

    await vi.waitFor(() => {
      expect(assignMock).toHaveBeenCalledWith(fakeUrl);
    });
  });

  it('should redirect in expected url when remaining Expire Time is reached', async () => {
    const serverTime = 0;
    mockUser.exp = -1;
    (useFetchServerTime as jest.Mock).mockReturnValue({
      data: serverTime,
      isError: false,
      isFetched: true,
    });

    renderHook(() => useSessionModal(mockUser as User, 0.5));

    await vi.waitFor(() => {
      expect(assignMock).toHaveBeenCalledWith(fakeUrl);
    });
  });

  it('should show the warning modal when warning time is reached', async () => {
    mockUser.exp = 0.1;
    const serverTime = 0;

    (useFetchServerTime as jest.Mock).mockReturnValue({
      data: serverTime,
      isError: false,
      isFetched: true,
    });

    const { result } = renderHook(() => useSessionModal(mockUser as User, 0.1));

    await vi.waitFor(() => {
      expect(result.current.showWarningModal).toBe(true);
      expect(result.current.showExpiredModal).toBe(false);
    });
  });

  it('should show the expired modal when expired time is reached', async () => {
    mockUser.exp = 0.1;
    const serverTime = 0;

    (useFetchServerTime as jest.Mock).mockReturnValue({
      data: serverTime,
      isError: false,
      isFetched: true,
    });

    const { result } = renderHook(() => useSessionModal(mockUser as User, 0.5));

    await vi.waitFor(() => {
      expect(result.current.showExpiredModal).toBe(true);
    });
  });

  it('should show the expired modal and warning modal when times are reached', async () => {
    mockUser.exp = 1;
    const serverTime = 0.5;

    (useFetchServerTime as jest.Mock).mockReturnValue({
      data: serverTime,
      isError: false,
      isFetched: true,
    });

    const { result } = renderHook(() => useSessionModal(mockUser as User, 0.5));

    await vi.waitFor(() => {
      expect(result.current.showWarningModal).toBe(true);
      expect(result.current.showExpiredModal).toBe(true);
    });
  });
});
