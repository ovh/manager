/* eslint-disable react/display-name */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { PropsWithChildren } from 'react';
import { renderHook } from '@testing-library/react';

const queryClientWrapper = (
  wrapper?: React.JSXElementConstructor<{ children: React.ReactNode }>,
) => ({ children }: PropsWithChildren) => {
  const Wrapper = wrapper;

  const withExtraRender = Wrapper ? (
    <Wrapper>{children}</Wrapper>
  ) : (
    <>{children}</>
  );

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {withExtraRender}
    </QueryClientProvider>
  );
};

export const renderHookWithQueryClient: typeof renderHook = (
  render,
  { wrapper, ...restOptions } = {},
) =>
  renderHook(render, { wrapper: queryClientWrapper(wrapper), ...restOptions });
