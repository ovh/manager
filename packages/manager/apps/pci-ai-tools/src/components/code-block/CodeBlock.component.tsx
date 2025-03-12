import { Button, useToast } from '@datatr-ux/uxlib';
import { Copy } from 'lucide-react';
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
        // variant="ghost"
        className="absolute top-2 right-2 p-1 hover:bg-gray-100 z-10"
      >
        <Copy className="size-4" />
      </Button>
      <pre className="p-4 text-sm rounded overflow-auto">
        <code>{code}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;
