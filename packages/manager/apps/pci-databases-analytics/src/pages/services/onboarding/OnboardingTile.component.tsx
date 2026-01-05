import { ExternalLink } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@datatr-ux/uxlib';
import { PropsWithChildren } from 'react';
import A from '@/components/links/A.component';

interface OnboardingTileProps {
  title: string;
  description?: string;
  href: string;
  linkName: string;
}
const OnboardingTile = ({
  title,
  description,
  href,
  linkName,
  children,
}: PropsWithChildren<OnboardingTileProps>) => {
  return (
    <Card className="flex flex-col justify-between">
      <CardHeader className="py-4">
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="pb-4">{children}</CardContent>
      <CardFooter>
        <A href={href} target="_blank" rel="noopener noreferrer">
          <div className="inline-flex items-center gap-2">
            <span>{linkName}</span>
            <ExternalLink className="size-4" />
          </div>
        </A>
      </CardFooter>
    </Card>
  );
};

export default OnboardingTile;
