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
        <CardTitle className="text-xl text-primary">{title}</CardTitle>
        <CardDescription className="text-2xl text-heading font-semibold text-[#00185e]">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Trans
          t={t}
          i18nKey={content}
          components={{
            br: <br />,
          }}
        ></Trans>
      </CardContent>
      <CardFooter>
        <a href={href} target="_blank" rel="noopener noreferrer">
          <div className="inline-flex items-center gap-2 text-primary">
            <span>{linkName}</span>
            <ExternalLink className="size-4" />
          </div>
        </a>
      </CardFooter>
    </Card>
  );
};

export default OnboardingTile;
