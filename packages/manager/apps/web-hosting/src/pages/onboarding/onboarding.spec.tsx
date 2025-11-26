import React, { ComponentType } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, fireEvent, render } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { describe, expect, vi } from 'vitest';

import onboardingTranslation from '@/public/translations/onboarding/Messages_fr_FR.json';
import { createWrapper, i18n } from '@/utils/test.provider';

import Onboarding from './Onboarding.page';

const testQueryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      retry: false,
    },
    queries: {
      retry: false,
    },
  },
});

const RouterWrapper = createWrapper();

const Wrappers = ({ children }: { children: React.ReactElement }) => {
  return (
    <RouterWrapper>
      <QueryClientProvider client={testQueryClient}>
        <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
      </QueryClientProvider>
    </RouterWrapper>
  );
};

describe('Onboarding page', () => {
  it('should display page correctly', () => {
    const { getByText } = render(<Onboarding />, { wrapper: Wrappers as ComponentType });
    const title = getByText(onboardingTranslation.title);
    expect(title).toBeVisible();
  });

  it('should call window open on click', () => {
    const { container } = render(<Onboarding />, { wrapper: Wrappers as ComponentType });
    const spy = vi.spyOn(window, 'open');
    const button = container.querySelector(
      `ods-button[label="${onboardingTranslation.order_btn}"]`,
    );
    act(() => {
      fireEvent.click(button);
    });
    expect(spy).toHaveBeenCalledOnce();
  });
});
