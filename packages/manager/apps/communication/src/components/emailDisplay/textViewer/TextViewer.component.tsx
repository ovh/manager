import { Card, Text, TEXT_PRESET } from '@ovhcloud/ods-react';

export default function TextViewer({ text }: { text: string }) {
  return (
    <Card className="whitespace-pre-line p-4 overflow-y-auto">
      <Text preset={TEXT_PRESET.paragraph} className="rounded-[var(--ods-theme-border-radius)]">{text}</Text>
    </Card>
  );
}
