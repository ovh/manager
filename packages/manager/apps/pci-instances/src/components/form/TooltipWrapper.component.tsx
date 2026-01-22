import { FC, ReactNode, PropsWithChildren } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@ovhcloud/ods-react';

type TooltipWrapperProps = PropsWithChildren<{
  content?: string | ReactNode;
}>;

export const TooltipWrapper: FC<TooltipWrapperProps> = ({
  children,
  content,
}) => {
  if (content) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent withArrow>{content}</TooltipContent>
      </Tooltip>
    );
  }

  return <>{children}</>;
};
