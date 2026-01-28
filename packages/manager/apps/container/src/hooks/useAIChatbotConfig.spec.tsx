import { ReactNode } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import i18next from 'i18next';
import { useAIChatbotConfig } from './useAIChatbotConfig';
import { getComponentWrapper } from '@/utils/tests/component-wrapper';
import useContainer from '@/core/container';

const mockSetAIChatbotOpen = vi.fn();

vi.mock('@/core/container', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/core/container')>();
  return {
    ...actual,
    default: vi.fn(),
  };
});

vi.mock('i18next', () => ({
  default: {
    language: 'fr_FR',
    on: vi.fn(),
    off: vi.fn(),
  },
}));

describe('useAIChatbotConfig', () => {
  const baseWrapper = getComponentWrapper({
    configuration: {},
  });

  const wrapper = ({ children }: { children: ReactNode }) => {
    return baseWrapper(<>{children}</>);
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useContainer).mockReturnValue({
      setAIChatbotOpen: mockSetAIChatbotOpen,
    } as any);

    vi.mocked(i18next).language = 'fr_FR';
  });

  it('should return config with required fields', () => {
    const { result } = renderHook(() => useAIChatbotConfig(), { wrapper });

    expect(result.current.locale).toBeDefined();
    expect(result.current.linkPolicy).toContain(
      'https://www.ovhcloud.com/',
    );
    expect(result.current.linkPolicy).toContain('terms-and-conditions/privacy-policy/');
    expect(result.current.onClose).toBeDefined();
    expect(result.current.onTracking).toBeDefined();
  });

  it('should call setAIChatbotOpen(false) when onClose is invoked', () => {
    const { result } = renderHook(() => useAIChatbotConfig(), { wrapper });

    result.current.onClose();

    expect(mockSetAIChatbotOpen).toHaveBeenCalledWith(false);
  });
});
