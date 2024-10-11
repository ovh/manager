import { NotebookSpec } from '@/types/cloud/project/ai/notebook/NotebookSpec';
import { NotebookStatus } from '@/types/cloud/project/ai/notebook/NotebookStatus';

/** AI Solutions Platform Notebook Object */
export interface Notebook {
  /** Notebook creation date */
  createdAt?: string;
  /** Notebook Id */
  id?: string;
  /** Notebook spec */
  spec?: NotebookSpec;
  /** Notebook Container Status */
  status?: NotebookStatus;
  /** Notebook last update date */
  updatedAt?: string;
  /** Notebook user owner */
  user?: string;
}
