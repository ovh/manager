import { P } from '@/components/typography';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { OrderNbProps, notebookApi } from '@/data/aiapi';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Files } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ai } from '@/models/types';

interface EquivalentOrderNbModalProps {
  projectId: string;
  notebook: OrderNbProps;
  open: boolean;
  onClose: () => void;
}

const EquivalentOrderNbModal = ({
  projectId,
  notebook,
  open,
  onClose,
}: EquivalentOrderNbModalProps) => {
  const [command, setCommand] = useState('');
  useEffect(() => {
    if (!open) return;
    getCliEquivalentOrderNbMutation.mutate(notebook);
  }, [open]);

  const getCliEquivalentOrderNbMutation = useMutation({
    mutationFn: (mutationData: OrderNbProps) =>
      notebookApi.cliCommandNotebook(projectId, mutationData),
    onSuccess: (data: ai.Command) => {
      setCommand(data.command);
    },
    onError: (error: Error) => {
      console.log(
        `A error occured while deleting your notebook: ${error.message}`,
      );
    },
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => (open === false ? onClose() : null)}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Création automatique d'un notebook équivalent
          </DialogTitle>
          <div>
            <P className="my-3">
              Vous pouvez créer le même notebook en utilisant ces lignes de
              commande dans votre ovhai CLI. En savoir plus.
            </P>
            <div className="flex flex-row justify-between items-center my-2 rounded border border-gray-200 bg-muted w-full px-2 py-4 font-mono text-sm font-semibold">
              <code>{command}</code>
              <Files
                className="w-4 h-4 ml-3 mb-1 hover:text-primary"
                onClick={() => {
                  navigator.clipboard.writeText(command);
                  toast.success('Command saved in clipboard', {
                    dismissible: true,
                  });
                }}
              />
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default EquivalentOrderNbModal;
