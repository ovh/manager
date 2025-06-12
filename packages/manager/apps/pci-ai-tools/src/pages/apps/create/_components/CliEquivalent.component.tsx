import { useTranslation } from 'react-i18next';
import {
  Code,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  bash,
  githubDark,
  useToast,
} from '@datatr-ux/uxlib';

import { ModalController } from '@/hooks/useModale';
import ai from '@/types/AI';

interface CliEquivalentModalProps {
  command: ai.Command;
  controller: ModalController;
}
const CliEquivalent = ({ command, controller }: CliEquivalentModalProps) => {
  const { t } = useTranslation('ai-tools/apps/create');
  const toast = useToast();
  return (
    <Dialog {...controller}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle data-testid="cli-equivalent-modal">
            {t('cliEquivalentModalTitle')}
          </DialogTitle>
        </DialogHeader>
        <Code
          label={t('cliEquivalentModalDescription')}
          code={command.command}
          theme={githubDark}
          lang={bash}
          onCopied={() =>
            toast.toast({
              title: t('cliEquivalentModalToastMessage'),
            })
          }
          lineNumbers={true}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CliEquivalent;
