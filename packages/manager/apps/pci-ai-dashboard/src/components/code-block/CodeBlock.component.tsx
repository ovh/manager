import { Copy } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useToast } from '../ui/use-toast';
import { Button } from '../ui/button';

interface CodeBlockProps {
  code: string;
  toastMessage?: string;
}

const CodeBlock = ({ code, toastMessage }: CodeBlockProps) => {
  const { t } = useTranslation('common');
  const toast = useToast();
  const handleCopyPass = (valueToCopy: string) => {
    navigator.clipboard.writeText(valueToCopy);
    toast.toast({
      title: toastMessage || t('copied'),
    });
  };
  return (
    <div className="relative my-2 rounded bg-black">
      <Button
        data-testid="code-block-copy-button"
        onClick={() => handleCopyPass(code)}
        className="absolute top-0 right-0 m-2 p-2 text-sm
           bg-primary-500 text-white rounded hover:bg-primary-700 transition duration-300"
      >
        <Copy className="size-4" />
        <span className="sr-only">copy</span>
      </Button>
      <pre className="p-4 bg-black rounded text-white overflow-auto">
        <code>{code}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;
