import '@/common/setupTests';
import { describe, expect, vi, it } from 'vitest';
import { fireEvent, render } from '@/common/utils/test.provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Onboarding from './onboarding';

const queryClient = new QueryClient();

const onboardingA11yRules = {
  'link-name': { enabled: false },
};

describe('Onboarding page', () => {
  it('should display page correctly', async () => {
    const { findByText, container } = render(
      <QueryClientProvider client={queryClient}>
        <Onboarding />
      </QueryClientProvider>,
    );

    const title = await findByText('title');
    expect(title).toBeDefined();
    await expect(container).toBeAccessible({ rules: onboardingA11yRules });
  });

  it('should call window open on click', async () => {
    const { getByTestId, container } = render(
      <QueryClientProvider client={queryClient}>
        <Onboarding />
      </QueryClientProvider>,
    );

    const spy = vi.spyOn(globalThis, 'open');

    const button = getByTestId('manager-button');
    expect(button).toBeInTheDocument();

    fireEvent.click(button);

    expect(spy).toHaveBeenCalledOnce();
    await expect(container).toBeAccessible({ rules: onboardingA11yRules });
  });
});

describe('Onboarding page W3C Validation', () => {
  it('should have valid html', async () => {
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <Onboarding />
      </QueryClientProvider>,
    );
    const html = container.innerHTML;

    await expect(html).toBeValidHtml();
  });
});
