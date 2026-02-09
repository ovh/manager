import { Card, Link, Text, TEXT_PRESET } from '@ovhcloud/ods-react';
import { useMemo } from 'react';
import { emailRegex, urlRegex } from './textViewer.constants';
import { Trans } from 'react-i18next';

export default function TextViewer({ text }: { text: string }) {
  const formattedText = useMemo(() => {
    let linkifiedText = text.replace(urlRegex, '<anchor href="$1">$1</anchor>');
    linkifiedText = linkifiedText.replace(emailRegex, '<anchor href="mailto:$1">$1</anchor>');
    return linkifiedText;
  }, [text]);

  return (
    <Card className="p-4 overflow-y-auto">
      <Text preset={TEXT_PRESET.span} className="rounded-[var(--ods-theme-border-radius)]">
        <pre className="m-0 font-mono whitespace-pre-wrap break-words">
          <Trans
            defaults={formattedText}
            components={{
              anchor: <Link target="_blank" rel="noopener noreferrer" className="font-mono" />,
            }}
          />
        </pre>
      </Text>
    </Card>
  );
}
