import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useGetProject } from '@/hooks/useGetProject';

vi.mock('@ovh-ux/manager-pci-common', () => ({
  useProject: () => ({ data: {} }),
}));

vi.mock('@ovh-ux/manager-react-shell-client', () => ({
  useNavigation: () => ({
    getURL: () => Promise.resolve('http://public-cloud'),
  }),
}));

describe('useGetProject', () => {
  it('should toto', () => {
    renderHook(() => useGetProject());

    expect(true).toBe(true);
  });
});
