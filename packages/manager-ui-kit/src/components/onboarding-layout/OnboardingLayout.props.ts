import { ComponentProps, PropsWithChildren, ReactNode } from 'react';

import { OnboardingLayoutButtonProps } from './onboarding-layout-button/OnboardingLayoutButton.props';

export type OnboardingLayoutProps = OnboardingLayoutButtonProps &
  PropsWithChildren<{
    hideHeadingSection?: boolean;
    title: string;
    description?: ReactNode;
    img?: ComponentProps<'img'>;
  }>;
