import { Button, useToast } from '@datatr-ux/uxlib';
import { Files } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface CodeBlockProps {
  code: string;
  toastMessage?: string;
}

const CodeBlock = ({ code, toastMessage }: CodeBlockProps) => {
  const { t } = useTranslation('common');
  const toast = useToast();
  const handleCopyPass = () => {
    navigator.clipboard.writeText(code);
    toast.toast({
      title: toastMessage || t('copied'),
    });
  };
  return (
    <div className="relative border rounded-md bg-slate-300">
      <Button
        data-testid="code-block-copy-button"
        onClick={handleCopyPass}
        size="menu"
        variant="menu"
        mode="menu"
        className="absolute top-2 right-2 p-1 z-10 shrink-0"
      >
        <Files className="w-4 h-4" />
        <span className="sr-only">copy</span>
      </Button>
      <pre className="p-4 text-sm rounded overflow-auto">
        <code>{code}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;
