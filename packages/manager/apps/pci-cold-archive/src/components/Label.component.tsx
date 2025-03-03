import { OdsText } from '@ovhcloud/ods-components/react';

export default function LabelComponent({
  text,
}: Readonly<{ text: string }>): JSX.Element {
  return (
    <OdsText preset="caption" className="font-bold-class">
      {text}
    </OdsText>
  );
}
