import { useMutation } from '@tanstack/react-query';
import { useRequiredParams } from '@/hooks/useRequiredParams';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

import { LabelsJobProps, jobsApi } from '@/data/aiapi';

interface TagsProps {
  jobId : string,
  tags: Record<string, string>,
  onLabelUpdate: () => void,
}

const JobTags = ({ jobId, tags, onLabelUpdate }: TagsProps) => {
  const { projectId } = useRequiredParams<{ projectId: string }>();
  
  const removeLabel = (key: string) => {
    const newList : Record<string,string> = {...tags};
    delete newList[key];
    updateJobMutation.mutate({
      projectId,
      jobId,
      labels: newList,
    });
  };

  const updateJobMutation = useMutation({
    mutationFn: (labelParam : LabelsJobProps) =>
      jobsApi.updateLabel(labelParam),
    onSuccess: () => {
      toast.success(`Selected label have been removed`);
      onLabelUpdate();
    },
    onError: (error: Error) => {
      toast.error(`A error occured while removing your labels: ${error.message}`);
    },
  });

  return (
    <>
      <div>
        {Object.entries(tags).map(([key, value], index) => (
          <Badge
            className="hover:shadow-sm hover:border-primary-600 hover:bg-primary-800 mx-1 my-1"
            variant="default"
            key={index}
            onClick={() => removeLabel(key)}
          >
            {key} = {value}
            <X className="w-3 h-3 ml-2"></X>
          </Badge>
        ))}
      </div>
    </>
  );
};

export default JobTags;
