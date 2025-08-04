import { LoaderFunctionArgs } from 'react-router-dom';

export const projectIdLoader = async (args: LoaderFunctionArgs) => {
  const { projectId } = args.params;

  if (!projectId) {
    throw new Error('No project id found');
  }

  // Return the validated projectId to be used in route data
  return { projectId };
};
