/* eslint-disable import/no-extraneous-dependencies */
import React, { useRef } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.min.css'; // Adjust based on your preferred theme
import { Copy } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';

type CodeBlockProps = {
  code: string;
  language: string;
  showCopyButton?: boolean;
};

const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language,
  showCopyButton = true,
}) => {
  const codeRef = useRef<HTMLElement>(null);
  const toast = useToast();
  // Highlight code on mount and update
  React.useEffect(() => {
    if (codeRef.current) {
      hljs.highlightElement(codeRef.current);
    }
  }, [code, language]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    toast.toast({
      title: 'Copié dans le presse papier',
    });
  };

  return (
    <div className="relative border rounded-md">
      {showCopyButton && (
        <Button
          onClick={handleCopy}
          variant="ghost"
          className="absolute top-2 right-2 p-1 hover:bg-gray-100 w-auto h-auto text-white z-10"
        >
          <Copy className="size-3" />
        </Button>
      )}
      <pre className="relative overflow-x-auto bg-transparent rounded-md text-sm">
        <code
          ref={codeRef}
          className={language ? `language-${language}` : ''}
          style={{ whiteSpace: 'pre', overflowX: 'auto', flex: 1 }}
        >
          {code}
        </code>
      </pre>
    </div>
  );
};

export default CodeBlock;
