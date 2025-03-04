import { OdsIcon, OdsPopover, OdsText } from '@ovhcloud/ods-components/react';

type TLabelProps = {
  text: string;
  helpText?: string;
  slot?: string;
  className?: string;
  triggerId?: string;
};

export default function LabelComponent({
  text,
  helpText,
  slot = 'label',
  className = '',
  triggerId,
}: Readonly<TLabelProps>): JSX.Element {
  return (
    <div slot={slot} className={`flex gap-2 items-center ${className}`.trim()}>
      <OdsText preset="caption" className="font-bold-class">
        {text}
      </OdsText>

      {!!helpText && (
        <div>
          <OdsIcon
            id={triggerId}
            name="circle-question"
            className="cursor-help"
          />
          <OdsPopover triggerId={triggerId}>
            <OdsText preset="caption">{helpText}</OdsText>
          </OdsPopover>
        </div>
      )}
    </div>
  );
}
