import { Button } from '@datatr-ux/uxlib';
import { useTranslation } from 'react-i18next';
import onboardingImgSrc from '@/../public/assets/ObjectSto.png';
import OnboardingTile from '../../../components/onboarding-tile/OnboardingTile.component';
import RoadmapChangelog from '@/components/roadmap-changelog/RoadmapChangelog.component';
import { GUIDES, getGuideUrl } from '@/configuration/guide';
import { useLocale } from '@/hooks/useLocale';
import Link from '@/components/links/Link.component';

const Onboarding = () => {
  const { t } = useTranslation('pci-object-storage/onboarding');
  const locale = useLocale();
  return (
    <div
      data-testid="onboarding-container-test"
      className="flex flex-col items-center gap-4"
    >
      <div className="w-full flex flex-row justify-end">
        <RoadmapChangelog />
      </div>
      <img
        src={onboardingImgSrc}
        className="max-w-[500px]"
        alt="object-storage-image"
      />
      <h2>{t('title')}</h2>
      <div className="flex flex-col items-center text-center gap-2 mx-16">
        <p>{t('description1')}</p>
        <p>{t('description2')}</p>
        <p>{t('description3')}</p>
        <p>{t('description4')}</p>
      </div>
      <Button data-testid="create-object-sto-link" asChild>
        <Link
          to="../new"
          className="hover:no-underline hover:text-primary-foreground"
        >
          {t('createButtonLabel')}
        </Link>
      </Button>
      <div className="flex flex-col md:grid md:grid-cols-3 gap-2">
        <OnboardingTile
          title={t('cardTopGuide')}
          description={t('cardLeftTitle')}
          content={t('cardLeftDesc')}
          href={getGuideUrl(GUIDES.OBJ_STO_ONBOARDING_TUTO_1, locale)}
          linkName={t('cardFindOutMore')}
        />
        <OnboardingTile
          title={t('cardTopGuide')}
          description={t('cardMiddleTitle')}
          content={t('cardMiddleDescription')}
          href={getGuideUrl(GUIDES.OBJ_STO_ONBOARDING_TUTO_2, locale)}
          linkName={t('cardFindOutMore')}
        />
        <OnboardingTile
          title={t('cardTopGuide')}
          description={t('cardRightTitle')}
          content={t('cardRightDescription')}
          href={getGuideUrl(GUIDES.OBJ_STO_ONBOARDING_TUTO_3, locale)}
          linkName={t('cardFindOutMore')}
        />
      </div>
    </div>
  );
};

export default Onboarding;
