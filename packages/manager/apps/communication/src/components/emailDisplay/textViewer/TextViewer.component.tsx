import { OdsCard, OdsText } from '@ovhcloud/ods-components/react';

export default function TextViewer({ text }: { text: string }) {
  return (
    <OdsCard className="p-4 overflow-y-auto">
      <OdsText preset="paragraph"><pre className="m-0 font-mono whitespace-pre-wrap break-words">{text}</pre></OdsText>
    </OdsCard>
  );
}
