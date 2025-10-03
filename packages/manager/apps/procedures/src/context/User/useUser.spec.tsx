import React, { FunctionComponent } from 'react';

import { renderHook } from '@testing-library/react';

import userContext, { UserContext } from '@/context/User/context';

import useUserContext from './useUser';

const mockContextValue: UserContext = {
  user: {
    legalForm: 'administration',
    email: 'johndoe@example.com',
    language: 'en',
    subsidiary: 'FR',
    iss: 'issuer.example.com',
    sub: '12345',
    exp: 1700000000,
    nbf: 1699990000,
    iat: 1699980000,
  },
};

const { Provider } = userContext;

const wrapper: FunctionComponent<any> = ({ children }: any) => (
  <Provider value={mockContextValue}>{children}</Provider>
);

describe('useUserContext', () => {
  it('should return the user context', () => {
    const { result } = renderHook(() => useUserContext(), {
      wrapper,
    });

    expect(result.current.user).toEqual(mockContextValue.user);
  });
});
