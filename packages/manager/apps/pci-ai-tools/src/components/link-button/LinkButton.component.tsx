import { Button, ButtonProps } from '@datatr-ux/uxlib';
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const LinkButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, ...props }, ref) => (
    <Button
      ref={ref}
      className={cn(
        'text-primary underline-offset-4 hover:underline border-0 bg-transparent hover:bg-transparent font-bold p-0',
        className,
      )}
      {...props}
    >
      {children}
    </Button>
  ),
);

export default LinkButton;
