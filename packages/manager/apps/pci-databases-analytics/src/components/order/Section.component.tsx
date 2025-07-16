import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
} from '@datatr-ux/uxlib';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface OrderSectionProps {
  cardMode?: boolean;
  id?: string;
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
}
const OrderSection = ({
  cardMode = true,
  id,
  title,
  description,
  children,
  className,
}: OrderSectionProps) => {
  return cardMode ? (
    <Card id={id} className={cn('shadow-sm', className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  ) : (
    <>
      <div id={id} className="pt-6 pb-4">
        <div className="text-2xl font-semibold leading-none tracking-tight">
          {title}
        </div>
        <div className="text-sm text-muted-foreground">{description}</div>
      </div>
      <div>{children}</div>
      <Separator className="mt-8" />
    </>
  );
};

export default OrderSection;
