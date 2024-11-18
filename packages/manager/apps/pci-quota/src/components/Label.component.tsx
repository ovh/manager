import { OdsIcon, OdsPopover, OdsText } from '@ovhcloud/ods-components/react';

type TLabelProps = {
  text: string;
  helpText?: string;
  className?: string;
  triggerId?: string;
};

export default function LabelComponent({
  text,
  helpText,
  className = '',
  triggerId,
}: Readonly<TLabelProps>): JSX.Element {
  return (
    <div className={`flex gap-2 items-center ${className}`.trim()}>
      <OdsText preset="caption" className="font-bold-class">
        {text}
      </OdsText>

      {!!helpText && (
        <div>
          <OdsIcon
            id={triggerId}
            name="circle-question"
            className="cursor-help text-[12px]"
          />
          <OdsPopover triggerId={triggerId} withArrow>
            <OdsText preset="caption">{helpText}</OdsText>
          </OdsPopover>
        </div>
      )}
    </div>
  );
}
