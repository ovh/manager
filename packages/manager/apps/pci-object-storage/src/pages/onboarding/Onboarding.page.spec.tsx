import { render } from '@testing-library/react';
import { useFeatureAvailability } from '@ovh-ux/manager-react-components';
import { vi } from 'vitest';
import OnBoardingPage from './Onboarding.page';
import { wrapper } from '@/wrapperRenders';

describe('OnboardingPage', () => {
  it('sould display correctly', () => {
    vi.mocked(useFeatureAvailability).mockReturnValue({
      data: { feature: false },
      isPending: false,
    } as never);
    const { container } = render(<OnBoardingPage />, { wrapper });
    expect(container).toMatchSnapshot();
  });
});
