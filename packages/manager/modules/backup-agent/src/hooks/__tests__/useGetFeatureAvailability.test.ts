import React from 'react';

import { renderHook } from '@testing-library/react';

import { useGetFeaturesAvailabilityNames } from '@/hooks/useGetFeatureAvailability';
import { testWrapperBuilder } from '@/test-utils/testWrapperBuilder';
import { Feature } from '@/types/Feature.type';

const useCases: [Feature[], { [key in Feature]?: string }][] = [
  [[], {}],
  [['DELETE_TENANT'], { DELETE_TENANT: 'test:deleteTenant' }],
  [
    ['DELETE_TENANT', 'DELETE_VAULT'],
    { DELETE_TENANT: 'test:deleteTenant', DELETE_VAULT: 'test:deleteVault' },
  ],
];

describe('useGetFeatureAvailability', () => {
  beforeEach(() => {
    vi.spyOn(React, 'useContext').mockReturnValue({ appName: 'test' });
  });

  it.each(useCases)('Get features availabilities flags', async (input, expected) => {
    const wrapper = await testWrapperBuilder().withAppContext({ appName: 'test' }).build();
    const { result } = renderHook(() => useGetFeaturesAvailabilityNames(input), {
      wrapper,
    });
    expect(result.current).toEqual(expected);
  });
});
