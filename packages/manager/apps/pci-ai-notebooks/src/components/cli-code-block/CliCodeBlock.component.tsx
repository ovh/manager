import { Copy } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useToast } from '../ui/use-toast';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';

interface CliCodeBlockProps {
  title: string;
  code: string;
  toastMessage?: string;
  size?: string;
}

const CliCodeBlock = ({
  title,
  code,
  toastMessage,
  size,
}: CliCodeBlockProps) => {
  const { t } = useTranslation('components/configuration');
  const toast = useToast();
  const handleCopyPass = (valueToCopy: string) => {
    navigator.clipboard.writeText(valueToCopy);
    toast.toast({
      title: toastMessage || t('cliToastCopied'),
    });
  };

  return (
    <div className="flex flex-col" data-testid="cli-code-bloc-container">
      <div className="flex flex-row items-center p-2 pr-6 gap-4">
        <p>{title}</p>
        <Button
          data-testid="code-block-copy-button"
          onClick={() => handleCopyPass(code)}
          variant="table"
          size="table"
        >
          <Copy className="size-4" />
          <span className="sr-only">copy</span>
        </Button>
      </div>
      <ScrollArea className={size}>
        <pre
          data-testid="code-block-pre"
          style={{ wordBreak: 'break-word' }}
          className="p-4 whitespace-pre-wrap rounded-md bg-[#122844] text-white"
        >
          <code>{code}</code>
        </pre>
      </ScrollArea>
    </div>
  );
};

export default CliCodeBlock;
