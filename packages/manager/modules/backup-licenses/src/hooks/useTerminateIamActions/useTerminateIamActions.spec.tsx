import React from 'react';

import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ShellContext, ShellContextType } from '@ovh-ux/manager-react-shell-client';

import { IAM_ACTIONS } from '@/utils/iam.constants';

import { useTerminateIamActions } from './useTerminateIamActions';

const renderWithSubsidiary = (ovhSubsidiary?: string) => {
  const context = {
    environment: { getUser: () => ({ ovhSubsidiary }) },
  } as unknown as ShellContextType;

  return renderHook(() => useTerminateIamActions(), {
    wrapper: ({ children }) => (
      <ShellContext.Provider value={context}>{children}</ShellContext.Provider>
    ),
  });
};

describe('useTerminateIamActions', () => {
  it('asks for the action guarding the DELETE form served to the US subsidiary', () => {
    const { result } = renderWithSubsidiary('US');

    expect(result.current).toContain(IAM_ACTIONS.servicesTerminateWithoutConfirmation);
    expect(result.current).toContain(IAM_ACTIONS.servicesGet);
  });

  it('asks for the action guarding the POST form served everywhere else', () => {
    const { result } = renderWithSubsidiary('FR');

    expect(result.current).toContain(IAM_ACTIONS.servicesTerminate);
    expect(result.current).not.toContain(IAM_ACTIONS.servicesTerminateWithoutConfirmation);
  });

  it('falls back to the POST form when no shell provides the subsidiary', () => {
    const { result } = renderHook(() => useTerminateIamActions());

    expect(result.current).toEqual([IAM_ACTIONS.servicesGet, IAM_ACTIONS.servicesTerminate]);
  });
});
