import { Trans } from 'react-i18next';
import { Button } from '@datatr-ux/uxlib';
import { PropsWithChildren } from 'react';
import Guides from '@/components/guides/Guides.component';
import { GuideSections } from '@/types/guide';
import Link from '@/components/links/Link.component';
import { useTrackAction } from '@/hooks/useTracking.hook';
import { TRACKING } from '@/configuration/tracking.constants';

interface OnboardingLayoutProps {
  title: string;
  subtitle: string;
  imageSrc: string;
  imageAlt: string;
  descriptionsKeys: string[];
  createButtonText: string;
  createButtonLink: string;
  createButtonTestId: string;
  onGuideClick?: (guide: { title: string }) => void;
}

const OnboardingLayout = ({
  title,
  subtitle,
  imageSrc,
  imageAlt,
  descriptionsKeys,
  createButtonText,
  createButtonLink,
  createButtonTestId,
  onGuideClick,
  children,
}: PropsWithChildren<OnboardingLayoutProps>) => {
  const track = useTrackAction();

  const handleGuideClick = (guide: { title: string }) => {
    if (onGuideClick) {
      onGuideClick(guide);
    } else {
      track(TRACKING.onboarding.guideClick(guide.title));
    }
  };

  return (
    <div
      data-testid="onboarding-container"
      className="flex flex-col items-center gap-4"
    >
      <div className="w-full text-right">
        <Guides
          section={GuideSections.onboarding}
          noEngineFilter
          onGuideClick={handleGuideClick}
        />
      </div>

      <div className="flex flex-col items-center text-center gap-4 max-w-8xl">
        <h1>{title}</h1>
        <h4>{subtitle}</h4>

        <img src={imageSrc} className="max-h-[250px]" alt={imageAlt} />

        {descriptionsKeys.map((key) => (
          <p key={key}>
            <Trans
              i18nKey={key}
              ns="pci-databases-analytics/services/onboarding"
              components={{ strong: <strong /> }}
            />
          </p>
        ))}
      </div>

      <Button data-testid={createButtonTestId} size="lg" asChild>
        <Link
          onClick={() => track(TRACKING.onboarding.createDatabaseClick())}
          to={createButtonLink}
          className="hover:no-underline hover:text-primary-foreground"
        >
          {createButtonText}
        </Link>
      </Button>

      <div className="flex flex-col md:grid md:grid-cols-3 gap-2">
        {children}
      </div>
    </div>
  );
};

export default OnboardingLayout;
