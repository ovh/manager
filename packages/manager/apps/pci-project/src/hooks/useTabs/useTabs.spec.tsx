import { renderHook } from '@testing-library/react';
import { createWrapper } from '@/wrapperRenders';
import { useTabs } from './useTabs';

describe('useTabs', () => {
  it('should return the correct tabs structure', () => {
    const { result } = renderHook(() => useTabs(), {
      wrapper: createWrapper(),
    });

    expect(result.current.tabs).toEqual([
      {
        name: 'home',
        title: 'pci_projects_project_home',
        to: '/',
      },
      {
        name: 'settings',
        title: 'pci_projects_project_parameters',
        to: '/edit',
      },
    ]);
  });
});
