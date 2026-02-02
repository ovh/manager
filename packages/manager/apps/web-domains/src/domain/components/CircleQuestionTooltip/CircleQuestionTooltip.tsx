import {
  Icon,
  ICON_NAME,
  TEXT_PRESET,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  Text,
} from '@ovhcloud/ods-react';

interface CircleQuestionTooltipProps {
  readonly translatedMessage: string;
}

export default function CircleQuestionTooltip({
  translatedMessage,
}: CircleQuestionTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Icon
          name={ICON_NAME.circleQuestion}
          className="text-[--ods-color-primary-500] pl-3"
          data-testid={`question-circle-icon-${translatedMessage}`}
        />
      </TooltipTrigger>
      <TooltipContent>
        <Text preset={TEXT_PRESET.paragraph}>{translatedMessage}</Text>
      </TooltipContent>
    </Tooltip>
  );
}
