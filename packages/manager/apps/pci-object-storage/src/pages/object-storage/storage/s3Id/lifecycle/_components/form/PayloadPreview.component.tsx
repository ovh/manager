import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Code, EyeOff, Copy, Check } from 'lucide-react';
import { Button } from '@datatr-ux/uxlib';
import { LifecycleFormValues } from './useLifecycleForm.hook';
import { buildLifecycleRule } from './buildLifecycleRule';

interface PayloadPreviewProps {
  form: UseFormReturn<LifecycleFormValues>;
}

export const PayloadPreview = ({ form }: PayloadPreviewProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const formValues = form.watch();

  const rule = buildLifecycleRule({
    ...formValues,
    ruleId: formValues.ruleId || '<rule-id>',
  });
  const payload = JSON.stringify({ rules: [rule] }, null, 2);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(payload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) {
    return (
      <Button
        type="button"
        mode="outline"
        size="menu"
        className="fixed bottom-4 right-4 z-50 shadow-lg"
        onClick={() => setIsOpen(true)}
      >
        <Code className="size-4 mr-1" />
      </Button>
    );
  }

  return (
    <div className="fixed top-16 right-4 z-50 w-96 max-h-[calc(100vh-5rem)] bg-background border border-border rounded-lg shadow-xl flex flex-col">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/50 rounded-t-lg">
        <span className="text-sm font-medium flex items-center gap-1.5">
          <Code className="size-3.5" />
          API Payload
        </span>
        <div className="flex items-center gap-2">
          <Button type="button" mode="ghost" size="menu" onClick={handleCopy}>
            {copied ? (
              <Check className="size-3.5 text-green-500" />
            ) : (
              <Copy className="size-3.5" />
            )}
          </Button>
          <Button
            type="button"
            mode="ghost"
            size="menu"
            onClick={() => setIsOpen(false)}
          >
            <EyeOff className="size-3.5" />
          </Button>
        </div>
      </div>
      <pre className="p-3 text-xs overflow-auto flex-1 font-mono leading-relaxed">
        {payload}
      </pre>
    </div>
  );
};
