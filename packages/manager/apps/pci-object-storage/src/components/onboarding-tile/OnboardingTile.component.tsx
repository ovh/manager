import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@datatr-ux/uxlib';
import { ExternalLink } from 'lucide-react';
import { Trans, useTranslation } from 'react-i18next';
import A from '@/components/links/A.component';

interface OnboardingTileProps {
  title: string;
  description: string;
  content: string;
  href: string;
  linkName: string;
}
const OnboardingTile = ({
  title,
  description,
  content,
  href,
  linkName,
}: OnboardingTileProps) => {
  const { t } = useTranslation('dataplatform');

  return (
    <Card
      className="flex flex-col justify-between"
      data-testid="onboarding-card"
    >
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="text-2xl text-heading font-semibold text-[#00185e]">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <Trans
          t={t}
          i18nKey={content}
          components={{
            br: <br />,
          }}
        ></Trans>
      </CardContent>
      <CardFooter>
        <A href={href} target="_blank" rel="noopener noreferrer">
          <div className="inline-flex items-center gap-2">
            <span className="text-primary-500">{linkName}</span>
            <ExternalLink className="size-4 text-primary-500" />
          </div>
        </A>
      </CardFooter>
    </Card>
  );
};

export default OnboardingTile;
