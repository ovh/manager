import { Outlet, redirect } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface QpuProps {
  params: {
    projectId: string;
  };
  request: Request;
}

export const Loader = async ({ params }: QpuProps) => {
  const { projectId } = params;
  return redirect(`/pci/projects/${projectId}/ai-ml/quantum/qpu/onboarding`);
};

const Qpu = () => {
  const { t } = useTranslation('ai-tools/notebooks');

  return (
    <>
      <div
        data-testid="notebooks-guides-container"
        className="flex justify-between w-full items-center"
      >
        <h2>{t('title')}</h2>
        <div className="flex flex-wrap justify-end gap-1"></div>
      </div>

      <Outlet />
    </>
  );
};

export default Qpu;
