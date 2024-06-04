import { useTranslation } from 'react-i18next';
import onboardingImgSrc from '../../../public/assets/onboarding-image.png';
import Guides from '@/components/guides';
import { GuideSections } from '@/models/guide';
import { Button } from '@/components/ui/button';
import { Link } from '@/components/links';
import { useTrackPage, useTrackAction } from '@/hooks/useTracking';
import { TRACKING } from '@/configuration/tracking';

const Onboarding = () => {
  const { t } = useTranslation('pci-databases-analytics/services/onboarding');
  useTrackPage(TRACKING.onboarding.page());
  const track = useTrackAction();
  return (
    <div
      data-testid="onbaording-container"
      className="flex flex-col items-center gap-2"
    >
      <div className="w-full text-right">
        <Guides
          section={GuideSections.onboarding}
          noEngineFilter
          onGuideClick={(guide) =>
            track(TRACKING.onboarding.guideClick(guide.title))
          }
        />
      </div>
      <h2>{t('title')}</h2>
      <img src={onboardingImgSrc} />
      <p>{t('description')}</p>
      <Button asChild>
        <Link
          onClick={() => track(TRACKING.onboarding.createDatabaseClick())}
          to="new"
          className="hover:no-underline hover:text-primary-foreground"
        >
          {t('create-service-button')}{' '}
        </Link>
      </Button>
    </div>
  );
};

export default Onboarding;
