import { ExternalLink } from 'lucide-react';
import A from '@/components/links/A.component';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

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
  return (
    <Card className="flex flex-col justify-between">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{content}</p>
      </CardContent>
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
