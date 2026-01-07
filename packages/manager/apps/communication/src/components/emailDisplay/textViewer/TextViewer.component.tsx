import { Card, Text, TEXT_PRESET } from '@ovhcloud/ods-react';

export default function TextViewer({ text }: { text: string }) {
  return (
    <Card className="p-4 overflow-y-auto">
      <Text preset={TEXT_PRESET.paragraph} className="rounded-[var(--ods-theme-border-radius)]">
        <pre className="m-0 font-mono whitespace-pre-wrap break-words">
          {text}
        </pre>
      </Text>
    </Card>
  );
}
