import { OrderNbProps, notebookApi } from '@/data/aiapi';
import { ai } from '@/models/types';
import { useMutation } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

interface OrderNotebookQueryProps {
  onError: (cause: Error) => void;
  onSuccess: (notebook: ai.notebook.Notebook) => void;
}


export function useOrderNotebook({ onError, onSuccess }: OrderNotebookQueryProps) {
    const { projectId } = useParams();
    const mutation = useMutation({

      mutationFn: (notebook: OrderNbProps) => {
        return notebookApi.orderNotebook(projectId || '', notebook);
      },
      onError,
      onSuccess,
    });
  
    return {
      orderNotebook: (notebook: OrderNbProps) => {
        return mutation.mutate(notebook);
      },
      ...mutation,
    };
  }