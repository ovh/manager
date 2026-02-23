import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  useToast,
} from '@datatr-ux/uxlib';
import {
  Outlet,
  redirect,
  useLocation,
  useMatches,
  useParams,
} from 'react-router-dom';
import { useRouting, useShell } from '@ovh-ux/manager-react-shell-client';
import { useEffect } from 'react';
import { defineCurrentPage } from '@ovh-ux/request-tagger';
import queryClient from '@/query.client';
import { useTrackPageAuto } from '@/hooks/useTracking';
import { useLoadingIndicatorContext } from '@/contexts/LoadingIndicator.context';
import { getProject } from '@/data/api/project/project.api';
import { USER_INACTIVITY_TIMEOUT } from '@/configuration/polling.constants';
import PageLayout from '@/components/page-layout/PageLayout.component';
import { UserActivityProvider } from '@/contexts/UserActivityContext';
import Breadcrumb from '@/components/breadcrumb/Breadcrumb.component';

interface AILayoutProps {
  params: {
    projectId: string;
  };
  request: Request;
}
// try to get project details from project id, redirect if the projectId is invalid
export const Loader = async ({ params }: AILayoutProps) => {
  const { projectId } = params;
  // check if we have a correct projectId
  try {
    await queryClient.fetchQuery({
      queryKey: ['projectId', projectId],
      queryFn: () => getProject(projectId),
    });
  } catch (_error) {
    return redirect(`/pci/projects`);
  }
  return null;
};

const TOAST_VIEWPORT_CLASSNAME =
  'pointer-events-none fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]';

const TOAST_CLOSE_CLASSNAME =
  'bg-background/90 opacity-100 text-foreground/70 hover:text-foreground focus:opacity-100';

function InlineToaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, ...props }) => (
        <Toast key={id} {...props}>
          <div className="grid gap-1">
            {title && <ToastTitle>{title}</ToastTitle>}
            {description && <ToastDescription>{description}</ToastDescription>}
          </div>
          {action}
          <ToastClose className={TOAST_CLOSE_CLASSNAME} />
        </Toast>
      ))}
      <ToastViewport className={TOAST_VIEWPORT_CLASSNAME} />
    </ToastProvider>
  );
}

function RoutingSynchronisation() {
  const { setLoading } = useLoadingIndicatorContext();
  const location = useLocation();
  const routing = useRouting();
  const shell = useShell();
  const matches = useMatches();

  useEffect(() => {
    routing.stopListenForHashChange();
  }, []);
  useEffect(() => {
    shell.ux.hidePreloader();
    setLoading(false);
    routing.onHashChange();
  }, [location]);

  useEffect(() => {
    const match = matches.slice(-1);
    //  We cannot type properly useMatches cause it's not support type inference or passing specific type https://github.com/remix-run/react-router/discussions/10902
    defineCurrentPage(`app.pci-ai-tools.${match[0].id}`);
  }, [location]);

  useTrackPageAuto();

  return <></>;
}

export function useAIData() {
  const { projectId } = useParams();
  return { projectId };
}

export default function Layout() {
  return (
    <PageLayout>
      <Breadcrumb />
      <UserActivityProvider timeout={USER_INACTIVITY_TIMEOUT}>
        <RoutingSynchronisation />
        <Outlet />
        <InlineToaster />
      </UserActivityProvider>
    </PageLayout>
  );
}
