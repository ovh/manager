import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@datatr-ux/uxlib';
import { useTranslation } from 'react-i18next';
import ai from '@/types/AI';
import CliCodeBlock from '@/components/cli-code-block/CliCodeBlock.component';
import { ModalController } from '@/hooks/useModale';

interface CliEquivalentModalProps {
  command: ai.Command;
  controller: ModalController;
}
const CliEquivalent = ({ command, controller }: CliEquivalentModalProps) => {
  const { t } = useTranslation('ai-tools/notebooks/create');
  return (
    <Dialog {...controller}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle data-testid="cli-equivalent-modal">
            {t('cliEquivalentModalTitle')}
          </DialogTitle>
        </DialogHeader>
        <CliCodeBlock
          title={t('cliEquivalentModalDescription')}
          code={command.command}
          toastMessage={t('cliEquivalentModalToastMessage')}
          size="max-h-[60vh] px-6"
        />
      </DialogContent>
    </Dialog>
  );
};

export default CliEquivalent;
