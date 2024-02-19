import { Link } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'sonner';
import { useRequiredParams } from '@/hooks/useRequiredParams';
import { useMutation } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Files, Pencil } from 'lucide-react';

import { ai } from '@/models/types';
import {
  DockerImageProps,
  HttpPortProps,
  LabelsAppProps,
  appsApi,
} from '@/data/aiapi';

import AppTags from './appTags';
import AddLabelModal, {
  AddLabelSubmitData,
} from './../../../../_components/addLabelModal';
import UpdateDockerImageModal, {
  UpdateDockerImageSubmitData,
} from './updateDockerImageModal';
import UpdateHttpPortModal, {
  UpdateHttpPortSubmitData,
} from './udpateHttpPortModal';

interface GeneralProps {
  app: ai.app.App;
  onAppUpdate: () => void;
}

const GeneralCard = ({ app, onAppUpdate }: GeneralProps) => {
  const { projectId } = useRequiredParams<{ projectId: string }>();
  const [isAddLabelModalOpen, setIsAddLabelModalOpen] = useState(false);
  const [isUpdateImageModalOpen, setIsUpdateImageModalOpen] = useState(false);
  const [isUpdateHttpPortModalOpen, setIsUpdateHttpPortModalOpen] = useState(
    false,
  );

  const onLabelUpdateSubmit = (data: AddLabelSubmitData) => {
    setIsAddLabelModalOpen(false);
    const newList: Record<string, string> = { ...app.spec.labels };
    const nouvelElement = { key: data.key, value: data.value };
    newList[nouvelElement.key] = nouvelElement.value;

    addLabelDataMutation.mutate({
      projectId: projectId,
      appId: app.id,
      labels: newList,
    });
  };

  const addLabelDataMutation = useMutation({
    mutationFn: (addLabelParam: LabelsAppProps) =>
      appsApi.updateLabel(addLabelParam),
    onSuccess: () => {
      toast.success(`Your label have been succesfuly added`);
      onAppUpdate();
    },
    onError: (error: Error) => {
      toast.error(`A error occured while adding your label: ${error.message}`);
    },
  });

  const onImageDockerUpdateSubmit = (data: UpdateDockerImageSubmitData) => {
    setIsUpdateImageModalOpen(false);
    updateDockerImageDataMutation.mutate({
      projectId: projectId,
      appId: app.id,
      imageSpec: {
        url: data.dockerImage,
      },
    });
  };

  const updateDockerImageDataMutation = useMutation({
    mutationFn: (udpateDockerImageParam: DockerImageProps) =>
      appsApi.updateDockerImage(udpateDockerImageParam),
    onSuccess: () => {
      toast.success(`Your App Docker Image have been succesfuly udpated`);
      onAppUpdate();
    },
    onError: (error: Error) => {
      toast.error(
        `A error occured while updating your App Docker Image: ${error.message}`,
      );
    },
  });

  const onHttpPortUpdateSubmit = (data: UpdateHttpPortSubmitData) => {
    setIsUpdateHttpPortModalOpen(false);
    updateHttpPortDataMutation.mutate({
      projectId: projectId,
      appId: app.id,
      httpPortSpec: {
        defaultHttpPort: data.httpPort,
      },
    });
  };

  const updateHttpPortDataMutation = useMutation({
    mutationFn: (udpateHttpPortParam: HttpPortProps) =>
      appsApi.updateHttpPortApp(udpateHttpPortParam),
    onSuccess: () => {
      toast.success(`Your App Http port have been succesfuly udpated`);
      onAppUpdate();
    },
    onError: (error: Error) => {
      toast.error(
        `A error occured while updating your App Http port: ${error.message}`,
      );
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
              {app.spec.image}
            </p>
            <Button
              onClick={() => setIsUpdateImageModalOpen(true)}
              className="mt-2 text-primary bg-white font-semibold hover:bg-primary-100 hover:text-primary"
              variant="ghost"
            >
              Update Image{isUpdateImageModalOpen}
              <Pencil className="w-4 h-4 ml-3 mb-1" />
            </Button>
            <UpdateDockerImageModal
              currentDockerImage={app.spec.image}
              open={isUpdateImageModalOpen}
              onClose={() => setIsUpdateImageModalOpen(false)}
              onSubmit={onImageDockerUpdateSubmit}
            />
          </CardContent>
          <div className="border-slate-200 border-t mx-5 mb-3"></div>
          <CardContent>
            <p className="mb-2">
              <b>Access URL (HTTP endpoint)</b>
            </p>
            <div className="flex items-center mt-2 py-1 max-w-[450px] text-primary font-semibold  border-primary-100 border hover:bg-primary-100 hover:text-primary-700 hover:border-b-primary">
              <p className=" flex-1 truncate">{app.status.url}</p>
              <Files
                className="w-4 h-4 ml-3 mb-1"
                onClick={() => {
                  navigator.clipboard.writeText(app.status.url || '');
                  toast.success('Access URL saved in clipboard', {
                    dismissible: true,
                  });
                }}
              />
            </div>
          </CardContent>
          <div className="border-slate-200 border-t mx-5 mb-3"></div>
          <CardContent>
            <p className="mb-2">
              <b>Port</b>
            </p>
            <div className="mb-2">
              <Badge variant="error">{app.spec.defaultHttpPort}</Badge>
            </div>
            <div>
              <Button
                onClick={() => setIsUpdateHttpPortModalOpen(true)}
                className="text-primary bg-white font-semibold hover:bg-primary-100 hover:text-primary"
                variant="ghost"
              >
                Update Http Port {isUpdateHttpPortModalOpen}
                <Pencil className="w-4 h-4 ml-3 mb-1" />
              </Button>
              <UpdateHttpPortModal
                currentHttpPort={app.spec.defaultHttpPort || 8080}
                open={isUpdateHttpPortModalOpen}
                onClose={() => setIsUpdateHttpPortModalOpen(false)}
                onSubmit={onHttpPortUpdateSubmit}
              />
            </div>
          </CardContent>
          <div className="border-slate-200 border-t mx-5 mb-3"></div>
          <CardContent>
            <p>
              <b>Attached container</b>
            </p>
            <p>{app.spec.volumes?.length || 0} container(s)</p>
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
            {app.spec.labels && (
              <AppTags
                appId={app.id}
                tags={app.spec.labels}
                onLabelUpdate={() => onAppUpdate()}
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
                onSubmit={onLabelUpdateSubmit}
              />
            </div>
          </CardContent>
          <div className="border-slate-200 border-t mx-5 mb-3"></div>
          <CardContent>
            <p>
              <b>Privacy</b>
            </p>
            <p>{app.spec.unsecureHttp ? 'Public' : 'Private'}</p>
          </CardContent>
          <div className="border-slate-200 border-t mx-5 mb-3"></div>
          <CardContent>
            <p>
              <b>Region</b>
            </p>
            <p>{app.spec.region}</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default GeneralCard;
