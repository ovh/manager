import { Skeleton } from '@/components/ui/skeleton';
import { useFlavors } from '@/hooks/useFlavors';
import { useNbCapabilities } from '@/hooks/useNbCapabilities';
import { useRequiredParams } from '@/hooks/useRequiredParams';
import { ai } from '@/models/types';
import { /*FormEvent,*/ useState } from 'react';
import FrameworkSelect from './framework/framework-select';
import EditorSelect from './editor/editor-select';
import RegionSelect from './region/region-select';
import RadioTile from '@/components/radio-tile';
import FlavorSelect from './flavor/flavor-select';
import { AlertTriangle } from 'lucide-react';
import FlavorSlider from './flavor/flavor-slider';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { OrderNbProps, notebookApi } from '@/data/aiapi';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

const OrderFunnel = ({
  regions,
  editors,
  frameworks,
}: {
  regions: ai.capabilities.Region[];
  editors: ai.notebook.Editor[];
  frameworks: ai.notebook.Framework[];
}) => {
  const { projectId } = useRequiredParams<{ projectId: string }>();
  const model = useNbCapabilities(regions, editors, frameworks);
  const [selectedCreds, setSelectedCreds] = useState<string>('Private');
  const flavor = useFlavors(projectId, model.region?.id || 'BHS');
  const navigate = useNavigate();
  const orderNbMut = useMutation({
    mutationFn: (mutationData: OrderNbProps) =>
      notebookApi.orderNotebook(mutationData),
    onSuccess: () => {
      navigate(`/projects/${projectId}/notebooks`);
    },
  });

  const handleSubmit = () => {
    if (
      model.framework &&
      model.editor &&
      model.region &&
      flavor.selectedFlavor
    ) {
      const randomName =
        model.framework?.name + '_' + new Date().toDateString();
      const orderNb: OrderNbProps = {
        projectId: projectId,
        notebookSpec: {
          env: {
            frameworkId: model.framework?.id,
            editorId: model.editor?.id,
            frameworkVersion: model.version,
          },
          name: randomName,
          region: model.region?.id,
          unsecureHttp: selectedCreds === 'Public' ? true : false,
          resources: {
            flavor: flavor.selectedFlavor.id,
          },
        },
      };
      {
        flavor.selectedFlavor.type === ai.capabilities.FlavorTypeEnum.cpu
          ? (orderNb.notebookSpec.resources = {
              flavor: flavor.selectedFlavor.id,
              cpu: flavor.selectedResourceNumber,
            })
          : (orderNb.notebookSpec.resources = {
              flavor: flavor.selectedFlavor.id,
              gpu: flavor.selectedResourceNumber,
            });
      }
      orderNbMut.mutate(orderNb);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
      <form onSubmit={handleSubmit} className="col-span-1 md:col-span-2">
        <div className="px-4">
          <h3 className="py-4 text-3xl text-[#00185e]">Available frameworks</h3>
          {model.framework && (
            <FrameworkSelect
              selectedFmk={model.framework}
              onChange={(value: {
                framework: ai.notebook.Framework;
                version: string;
              }) => {
                model.setFramework(value.framework);
                model.setVersion(value.version);
              }}
              listFrameworks={frameworks}
              selectedVersion={model.framework.versions[0]}
            />
          )}
          <h3 className="py-4 text-3xl text-[#00185e]">Code editors</h3>
          {model.editor && (
            <EditorSelect
              selectedEdt={model.editor}
              onChange={(value: { editor: ai.notebook.Editor }) => {
                model.setEditor(value.editor);
              }}
              listEditors={editors}
            />
          )}
          <h3 className="py-4 text-3xl text-[#00185e]">Datacenter location</h3>
          {model.region && (
            <RegionSelect
              selectedRegion={model.region}
              onChange={(newRegion) => model.setRegion(newRegion)}
              listRegions={regions}
            />
          )}
          <div>
            {flavor.flavorQuery.isLoading && (
              <div className="flex items-center mb-2">
                <label className="mr-2">Ressources</label>
                <Skeleton className="h-10 w-32" />
              </div>
            )}
            <h3 className="py-4 text-3xl text-[#00185e]">Resources</h3>
            <p className="text-[#00185e]">
              <strong>Use case</strong>
            </p>
            {flavor.flavorQuery.isSuccess && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
                <RadioTile
                  name="type-select"
                  onChange={() =>
                    flavor.setSelectedType(ai.capabilities.FlavorTypeEnum.cpu)
                  }
                  value={ai.capabilities.FlavorTypeEnum.cpu}
                  checked={
                    flavor.selectedType === ai.capabilities.FlavorTypeEnum.cpu
                  }
                >
                  <div className="flex justify-between items-center">
                    <h3>AI Notebooks Standard (CPU resources)</h3>
                  </div>
                  <RadioTile.Separator />
                  <p>
                    A lower price, offering standard performance. Suitable for
                    learning, testing or workloads that only require CPU.
                  </p>
                </RadioTile>
                <RadioTile
                  name="type-select"
                  onChange={() =>
                    flavor.setSelectedType(ai.capabilities.FlavorTypeEnum.gpu)
                  }
                  value={ai.capabilities.FlavorTypeEnum.gpu}
                  checked={
                    flavor.selectedType === ai.capabilities.FlavorTypeEnum.gpu
                  }
                >
                  <div className="flex justify-between items-center">
                    <h3>AI Notebooks Advanced (GPU resources)</h3>
                  </div>
                  <RadioTile.Separator />
                  <p>
                    Powered by up to four GPUs and dozens of CPUs. Delivers
                    higher performance for deep learning and intensive
                    workloads.
                  </p>
                </RadioTile>
              </div>
            )}
            <p className="py-2 text-[#00185e]">
              <strong>Available resources</strong>
            </p>
            {flavor.selectedFlavor && flavor.flavorList && (
              <div>
                <FlavorSelect
                  selectedFlavor={flavor.selectedFlavor}
                  selectedResource={flavor.selectedResourceNumber}
                  onChange={(value: { flavor: ai.capabilities.Flavor }) => {
                    flavor.setSelectedFlavor(value.flavor);
                  }}
                  listFlavors={flavor.flavorList}
                />
              </div>
            )}
          </div>
          <div className="pt-2">
            {flavor.selectedFlavor && (
              <FlavorSlider
                flavor={flavor.selectedFlavor}
                //nbResource={4}
                onChange={(value) => {
                  flavor.setSelectedResourceNumber(value);
                }}
              />
            )}
          </div>
          <div>
            <h3 className="py-4 text-3xl text-[#00185e]">Privacy settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
              <RadioTile
                name="credential-select"
                onChange={() => setSelectedCreds('Private')}
                value="Private"
                checked={selectedCreds === 'Private'}
              >
                <div className="flex justify-between items-center">
                  <h3>Restricted access</h3>
                </div>
                <RadioTile.Separator />
                <p>
                  Access to your notebook is reserved for OVHcloud Public Cloud
                  users created in your project.
                </p>
              </RadioTile>
              <RadioTile
                name="credential-select"
                onChange={() => setSelectedCreds('Public')}
                value="Public"
                checked={selectedCreds === 'Public'}
              >
                <div className="flex justify-between items-center">
                  <h3>Public access</h3>
                </div>
                <RadioTile.Separator />
                <p>
                  Your notebook is accessible to everyone through your URL.
                  Anyone can access your code and the data attached to it.
                </p>
                <RadioTile.Separator />
                <div className="flex justify-start">
                  <AlertTriangle className="w-4 h-4 mr-2 mt-1" />
                  <p className="text-red-600">
                    Please ensure that you take great care with sensitive data.
                  </p>
                </div>
              </RadioTile>
            </div>
          </div>
        </div>
      </form>

      <Card className="sticky top-8 h-fit shadow-lg">
        <CardHeader>
          <CardTitle className="text-[#00185e]">Votre commande</CardTitle>
          <CardDescription>Configuration de votre notebook</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="rounded-md bg-primary-800 text-primary-100 text-xs max-h-80 overflow-y-auto">
            <p>Framework : {JSON.stringify(model.framework?.name, null, 2)}</p>
            <p>Fmk Version : {JSON.stringify(model.version)}</p>
            <p>Editor : {JSON.stringify(model.editor?.id, null, 2)}</p>
            <p>Region : {JSON.stringify(model.region?.id, null, 2)}</p>
            <p>Access Settings : {JSON.stringify(selectedCreds)}</p>
            <p>Resources</p>
            <p>Type : {JSON.stringify(flavor.selectedType, null, 2)}</p>
            <p>Flavor : {JSON.stringify(flavor.selectedFlavor?.id, null, 2)}</p>
            <p>
              Number : {JSON.stringify(flavor.selectedResourceNumber, null, 2)}
            </p>
          </pre>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button className="w-full" onClick={handleSubmit}>
            Deploy
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default OrderFunnel;
