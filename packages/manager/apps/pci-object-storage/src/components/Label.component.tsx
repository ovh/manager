import { OdsIcon, OdsText, OdsTooltip } from '@ovhcloud/ods-components/react';

type TLabelProps = {
  text: string;
  helpText?: string;
  hasError?: boolean;
  slot?: string;
  className?: string;
};

export default function LabelComponent({
  text,
  helpText,
  slot = 'label',
  className = '',
}: Readonly<TLabelProps>): JSX.Element {
  return (
    <div slot={slot} className={`flex gap-2 items-center ${className}`.trim()}>
      <OdsText preset="caption" className="font-bold-class">
        {text}
      </OdsText>

      {!!helpText && (
        <>
          <OdsIcon
            id="popover-trigger"
            name="circle-question"
            className="cursor-help"
          />
          <OdsTooltip triggerId="popover-trigger" className="w-4 h-4">
            {helpText}
          </OdsTooltip>
        </>
      )}
    </div>
  );
}
