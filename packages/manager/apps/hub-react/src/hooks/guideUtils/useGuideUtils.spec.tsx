import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { describe, it, vi } from 'vitest';
import useGuideUtils from './useGuideUtils';
import { GUIDE_LIST } from './useGuideUtils.constants';

const environmentMock = {
  getUser: () => ({
    ovhSubsidiary: 'FR',
  }),
};

vi.mock('@ovh-ux/manager-react-shell-client', () => ({
  ShellContext: React.createContext({
    environment: {
      getEnvironment: vi.fn(() => environmentMock),
    },
    shell: {
      environment: {
        getEnvironment: vi.fn(() => environmentMock),
      },
    },
  }),
}));

describe('useGuideUtils Hook', () => {
  it('returns guide links based on FR subsidiary', async () => {
    environmentMock.getUser = () => ({
      ovhSubsidiary: 'FR',
    });

    const { result } = renderHook(() => useGuideUtils());

    await waitFor(() => {
      expect(result.current.Home).toBe(GUIDE_LIST.Home.FR);
    });
  });

  it('returns guide links for US subsidiary', async () => {
    environmentMock.getUser = () => ({
      ovhSubsidiary: 'US',
    });

    const { result } = renderHook(() => useGuideUtils());

    await waitFor(() => {
      expect(result.current.Home).toBe(GUIDE_LIST.Home.US);
    });
  });
});
