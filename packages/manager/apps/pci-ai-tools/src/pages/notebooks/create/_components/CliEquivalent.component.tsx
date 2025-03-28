import {
  Code,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  useToast,
} from '@datatr-ux/uxlib';
import { useTranslation } from 'react-i18next';
import ai from '@/types/AI';
import { ModalController } from '@/hooks/useModale';

interface CliEquivalentModalProps {
  command: ai.Command;
  controller: ModalController;
}
const CliEquivalent = ({ command, controller }: CliEquivalentModalProps) => {
  const { t } = useTranslation('ai-tools/notebooks/create');
  const toast = useToast();
  return (
    <Dialog {...controller}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle data-testid="cli-equivalent-modal">
            {t('cliEquivalentModalTitle')}
          </DialogTitle>
        </DialogHeader>
        <div className="p-2 max-w-lg">
          <Code
            label={t('cliEquivalentModalDescription')}
            code={command.command}
            theme="github-dark"
            lang="bash"
            onCopied={() =>
              toast.toast({
                title: t('cliEquivalentModalToastMessage'),
              })
            }
            lineNumbers={true}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CliEquivalent;
