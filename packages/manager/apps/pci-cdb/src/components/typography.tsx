import * as React from 'react';
import { cn } from '@/lib/utils';

function H1({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  const baseClassName =
    'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl';
  return <h1 className={cn(baseClassName, className)} {...props} />;
}

function H2({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  const baseClassName =
    'mt-3 scroll-m-20 pb-3 text-3xl font-semibold tracking-tight transition-colors first:mt-0';
  return <h2 className={cn(baseClassName, className)} {...props} />;
}

function H3({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  const baseClassName =
    'mt-8 scroll-m-20 text-2xl font-semibold tracking-tight mb-2';
  return <h3 className={cn(baseClassName, className)} {...props} />;
}

function H4({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  const baseClassName = 'scroll-m-20 text-xl font-semibold tracking-tight';
  return <h4 className={cn(baseClassName, className)} {...props} />;
}

function P({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  const baseClassName = 'leading-7 [&:not(:first-child)]:mt-6';
  return <h4 className={cn(baseClassName, className)} {...props} />;
}
export { H1, H2, H3, H4, P };
