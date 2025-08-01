import { OdsCard, OdsText } from '@ovhcloud/ods-components/react';

export default function TextViewer({ text }: { text: string }) {
  return (
    <OdsCard className="whitespace-pre-line p-4 overflow-y-auto">
      <OdsText preset="paragraph">{text}</OdsText>
    </OdsCard>
  );
}
