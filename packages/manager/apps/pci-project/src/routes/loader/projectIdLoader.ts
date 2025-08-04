import { LoaderFunctionArgs } from 'react-router-dom';

export const projectIdLoader = ({ params }: LoaderFunctionArgs) => ({
  projectId: params.projectId,
});
