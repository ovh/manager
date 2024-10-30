import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { ModalController } from '@/hooks/useModale';
import * as ai from '@/types/cloud/project/ai';
import CliCodeBlock from '@/components/cli-code-block/CliCodeBlock.component';

interface CliEquivalentModalProps {
  command: ai.Command;
  controller: ModalController;
}
const CliEquivalent = ({ command, controller }: CliEquivalentModalProps) => {
  const { t } = useTranslation('pci-ai-notebooks/notebooks/create');
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
        />
      </DialogContent>
    </Dialog>
  );
};

export default CliEquivalent;
