import { Link } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'sonner';
import { useRequiredParams } from '@/hooks/useRequiredParams';
import { useMutation } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Pencil } from 'lucide-react';

import { ai } from '@/models/types';
import { LabelsProps, notebookApi } from '@/data/aiapi';

import NotebookTags from './notebookTags';
import AddLabelModal, {
  AddLabelSubmitData,
} from '@/pages/projects/[projectId]/_components/addLabelModal';

interface GeneralProps {
  notebook: ai.notebook.Notebook;
  onLabelUpdate: () => void;
}

const GeneralCard = ({ notebook, onLabelUpdate }: GeneralProps) => {
  const { projectId } = useRequiredParams<{ projectId: string }>();
  const [isAddLabelModalOpen, setIsAddLabelModalOpen] = useState(false);

  const onSubmit = (data: AddLabelSubmitData) => {
    setIsAddLabelModalOpen(false);
    const newList: Record<string, string> = { ...notebook.spec.labels };
    const nouvelElement = { key: data.key, value: data.value };
    newList[nouvelElement.key] = nouvelElement.value;

    addLabelDataMutation.mutate({
      projectId: projectId,
      notebookId: notebook.id,
      notebookSpec: {
        labels: newList,
      },
    });
  };

  const addLabelDataMutation = useMutation({
    mutationFn: (addLabelParam: LabelsProps) =>
      notebookApi.updateNotebook(addLabelParam),
    onSuccess: () => {
      toast.success(`Your label have been succesfuly added`);
      onLabelUpdate();
    },
    onError: (error: Error) => {
      toast.error(`A error occured while adding your label: ${error.message}`);
    },
  });

  return (
    <>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>General information</CardTitle>
          </CardHeader>
          <div className="border-slate-200 border-t mx-5 mb-3"></div>
          <CardContent>
            <p>
              <b>Live-code-editor</b>
            </p>
            <Button
              disabled={true}
              variant="linkBis"
              size="sm"
              asChild
            >
              <Link to={notebook.status.url || ''}>
                {notebook.spec.env.editorId}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
          <div className="border-slate-200 border-t mx-5 mb-3"></div>
          <CardContent>
            <p>
              <b>Attached container</b>
            </p>
            <p>{notebook.spec.volumes?.length || 0} container(s)</p>
            <Button
              variant="linkBis"
              size="sm"
              asChild
            >
              <Link to="./../attached-data">
                View attached data
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
          <div className="border-slate-200 border-t mx-5 mb-3"></div>
          <CardContent>
            <p>
              <b>Tags</b>
            </p>
            {notebook.spec.labels && (
              <NotebookTags
                notebookId={notebook.id}
                tags={notebook.spec.labels}
                onLabelUpdate={() => onLabelUpdate()}
              />
            )}
            <div className="mt-2">
              <Button
                onClick={() => setIsAddLabelModalOpen(true)}
                className="text-primary bg-white font-semibold hover:bg-primary-100 hover:text-primary"
                variant="ghost"
              >
                Add a label{isAddLabelModalOpen}
                <Pencil className="w-4 h-4 ml-3 mb-1" />
              </Button>
              <AddLabelModal
                open={isAddLabelModalOpen}
                onClose={() => setIsAddLabelModalOpen(false)}
                onSubmit={onSubmit}
              />
            </div>
          </CardContent>
          <div className="border-slate-200 border-t mx-5 mb-3"></div>
          <CardContent>
            <p>
              <b>Environment</b>
            </p>
            <p>
              {notebook.spec.env.frameworkId} -{' '}
              {notebook.spec.env.frameworkVersion}
            </p>
          </CardContent>
          <div className="border-slate-200 border-t mx-5 mb-3"></div>
          <CardContent>
            <p>
              <b>Privacy</b>
            </p>
            <p>{notebook.spec.unsecureHttp ? 'Public' : 'Private'}</p>
          </CardContent>
          <div className="border-slate-200 border-t mx-5 mb-3"></div>
          <CardContent>
            <p>
              <b>Region</b>
            </p>
            <p>{notebook.spec.region}</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default GeneralCard;
