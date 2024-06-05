import { useTranslation } from 'react-i18next';
import { ExternalLink } from 'lucide-react';
import onboardingImgSrc from '../../../public/assets/onboarding-image.png';
import Guides from '@/components/guides';
import { GuideSections } from '@/models/guide';
import { Button } from '@/components/ui/button';
import { A, Link } from '@/components/links';
import { useTrackPage, useTrackAction } from '@/hooks/useTracking';
import { TRACKING } from '@/configuration/tracking';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const Onboarding = () => {
  const { t } = useTranslation('pci-databases-analytics/services/onboarding');
  useTrackPage(TRACKING.onboarding.page());
  const track = useTrackAction();
  return (
    <div
      data-testid="onbaording-container"
      className="flex flex-col items-center gap-4"
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
      <img src={onboardingImgSrc} className="max-h-[250px]" />
      <p>{t('description1')}</p>
      <p className="font-bold">{t('description2')}</p>
      <p>{t('description3')}</p>
      <Button asChild>
        <Link
          onClick={() => track(TRACKING.onboarding.createDatabaseClick())}
          to="new"
          className="hover:no-underline hover:text-primary-foreground"
        >
          {t('createServiceButton')}{' '}
        </Link>
      </Button>
      <div className="flex flex-col md:grid md:grid-cols-3 gap-2">
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle>{t('cardGuidestitle')}</CardTitle>
            <CardDescription>{t('cardGuidesDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>{t('cardGuidesContent')}</p>
          </CardContent>
          <CardFooter>
            <A
              href="https://docs.ovh.com/gb/en/publiccloud/databases/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="inline-flex items-center gap-2">
                <span>{t('cardLink')}</span>
                <ExternalLink className="size-4" />
              </div>
            </A>
          </CardFooter>
        </Card>
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle>{t('cardQuickStartTitle')}</CardTitle>
            <CardDescription>{t('cardQuickStartDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>{t('cardQuickStartContent')}</p>
          </CardContent>
          <CardFooter>
            <A
              href="https://docs.ovh.com/gb/en/publiccloud/databases/getting-started"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="inline-flex items-center gap-2">
                <span>{t('cardLink')}</span>
                <ExternalLink className="size-4" />
              </div>
            </A>
          </CardFooter>
        </Card>
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle>{t('cardFreeTierTitle')}</CardTitle>
            <CardDescription>{t('cardFreeTierTescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>{t('cardFreeTierContent')}</p>
          </CardContent>
          <CardFooter>
            <A
              href="https://help.ovhcloud.com/csm/en-gb-public-cloud-databases-mongodb-getting-started?id=kb_article_view&sysparm_article=KB0061254"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="inline-flex items-center gap-2">
                <span>{t('cardLink')}</span>
                <ExternalLink className="size-4" />
              </div>
            </A>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
