import { Navigate, useParams, useSearchParams } from 'react-router-dom';

export default function DeleteWorkflowRedirect() {
  const { projectId } = useParams();
  const [searchParams] = useSearchParams();
  return (
    <Navigate
      to={`/pci/projects/${projectId}/workflow/delete/${searchParams.get(
        'workflowId',
      )}`}
      replace
    />
  );
}
