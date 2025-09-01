import { ReactNode, ComponentProps, PropsWithChildren } from 'react';
import { OnboardingLayoutButtonProps } from './onboarding-layout-button';

export type OnboardingLayoutProps = OnboardingLayoutButtonProps &
  PropsWithChildren<{
    hideHeadingSection?: boolean;
    title: string;
    description?: ReactNode;
    img?: ComponentProps<'img'>;
  }>;
