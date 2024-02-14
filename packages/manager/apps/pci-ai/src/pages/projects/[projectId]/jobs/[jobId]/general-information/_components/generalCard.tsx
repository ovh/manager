import { Link } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'sonner';
import { useRequiredParams } from '@/hooks/useRequiredParams';
import { useMutation } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, ArrowUpRightSquare, Files, Pencil } from 'lucide-react';

import { ai } from '@/models/types';
import { LabelsJobProps, jobsApi } from '@/data/aiapi';

import JobTags from './jobTags';
import AddLabelModal, {
  AddLabelSubmitData,
} from './../../../../_components/addLabelModal';

interface GeneralProps {
  job: ai.job.Job;
  onLabelUpdate: () => void;
}

const GeneralCard = ({ job, onLabelUpdate }: GeneralProps) => {
  const { projectId } = useRequiredParams<{ projectId: string }>();
  const [isAddLabelModalOpen, setIsAddLabelModalOpen] = useState(false);

  const onSubmit = (data: AddLabelSubmitData) => {
    setIsAddLabelModalOpen(false);
    const newList: Record<string, string> = { ...job.spec.labels };
    const nouvelElement = { key: data.key, value: data.value };
    newList[nouvelElement.key] = nouvelElement.value;

    addLabelDataMutation.mutate({
      projectId: projectId,
      jobId: job.id,
      labels: newList,
    });
  };

  const addLabelDataMutation = useMutation({
    mutationFn: (addLabelParam: LabelsJobProps) =>
      jobsApi.updateLabel(addLabelParam),
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
              <b>Docker Image</b>
            </p>
            <p className="mt-2 py-1 bg-slate-100 border-primary border-b">
              {job.spec.image}
            </p>
          </CardContent>
          <div className="border-slate-200 border-t mx-5 mb-3"></div>
          <CardContent>
            <p className="mb-2">
              <b>HTTP access (METTRE LA BULLE)</b>
            </p>
            <div className="flex items-center mt-2 py-1 max-w-[450px] text-primary font-semibold  border-primary-100 border hover:bg-primary-100 hover:text-primary-700 hover:border-b-primary">
              <p className=" flex-1 truncate">{job.status.url}</p>
              <Files
                className="w-4 h-4 ml-3 mb-1"
                onClick={() => {
                  navigator.clipboard.writeText(job.status.url || '');
                  toast.success('Access URL saved in clipboard', {
                    dismissible: true,
                  });
                }}
              />
            </div>
          </CardContent>
          <div className="border-slate-200 border-t mx-5 mb-3"></div>
          {job.status.sshUrl && (
            <div>
              <CardContent>
                <p>
                  <b>SSH Access (Bulle)</b>
                </p>
                <Button variant="outline">
                  <div className="flex justify-between items-center">
                    <Link to={job.status.sshUrl || ''}>Secure access</Link>
                    <ArrowUpRightSquare className="w-4 h-4 mr-2" />{' '}
                  </div>
                </Button>
              </CardContent>
              <div className="border-slate-200 border-t mx-5 mb-3"></div>
            </div>
          )}
          <CardContent>
            <p>
              <b>Attached container</b>
            </p>
            <p>{job.spec.volumes?.length || 0} container(s)</p>
            <Button
              className="font-semibold hover:bg-primary-100 hover:text-primary"
              variant="link"
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
            {job.spec.labels && (
              <JobTags
                jobId={job.id}
                tags={job.spec.labels}
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
              <b>Privacy</b>
            </p>
            <p>{job.spec.unsecureHttp ? 'Public' : 'Private'}</p>
          </CardContent>
          <div className="border-slate-200 border-t mx-5 mb-3"></div>
          <CardContent>
            <p>
              <b>Region</b>
            </p>
            <p>{job.spec.region}</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default GeneralCard;
