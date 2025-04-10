import { redirect } from 'react-router-dom';

interface RootProps {
  params: {
    projectId: string;
  };
}
export const Loader = ({ params }: RootProps) => {
  const { projectId } = params;
  return redirect(`/pci/projects/${projectId}/ai-ml/dashboard`);
};
