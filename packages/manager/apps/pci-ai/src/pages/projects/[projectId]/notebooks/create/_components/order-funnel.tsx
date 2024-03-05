import { H3, P } from '@/components/typography';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/components/use-toast';
import { OrderNbProps } from '@/data/aiapi';
import { FlavorWithRegion } from '@/hooks/api/ai/useGetFlavors';
import { useOrderNotebook } from '@/hooks/api/notebooks/notebooks.api.hooks';
import { useNotebookOrderFunnel } from '@/hooks/useNotebookOrderFunnel';
import { order } from '@/models/catalog';
import { ai } from '@/models/types';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import FrameworkSelect from './framework/framework-select';
import EditorSelect from './editor/editor-select';
import RegionsSelect from './region/region.select';
import FlavorSelect from './flavor/flavor-select';
import { Flavors } from '@/models/order-funnel';
import PrivacySelect from './privacy/privacy-select';
import OrderSummary from './order-summary';
import OrderPrice from './order-price';
import OrderCommandCli from './order-equivalent-cli';

interface OrderFunnelProps {
  frameworks: ai.notebook.Framework[];
  editors: ai.notebook.Editor[];
  regions: ai.capabilities.Region[];
  flavorsWithRegion: FlavorWithRegion[];
  //sshKeys: user.SSHKey[],
  //volumes
  catalog: order.publicOrder.Catalog;
}

const OrderFunnel = ({
  frameworks,
  editors,
  regions,
  flavorsWithRegion,
  //sshKeys: user.SSHKey[],
  //volumes
  catalog,
}: OrderFunnelProps) => {
  const model = useNotebookOrderFunnel(
    frameworks,
    editors,
    regions,
    flavorsWithRegion,
    //sshKeys: user.SSHKey[],
    //volumes
    catalog,
  );
  const { t } = useTranslation('pci-ai/notebooks/new');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { orderNotebook, isPending: isPendingNoNotebook } = useOrderNotebook({
    onError: (err) => {
      toast({
        title: t('errorCreatingNotebook'),
        variant: 'destructive',
        description: err.message,
      });
    },
    onSuccess: (service) => {
      toast({
        title: t('successCreatingNotebook'),
      });
      navigate(`../${service.id}`);
    },
  });

  const onSubmit = model.form.handleSubmit(
    (data) => {
      console.log('in onSubmit');
      console.log(data);
      const notebookInfos: OrderNbProps = {
        env: {
          editorId: data.editor,
          frameworkId: data.frameworkWithVersion.framework,
          frameworkVersion: data.frameworkWithVersion.version,
        },
        name: data.name || 'test',
        region: data.region,
        unsecureHttp: data.unsecureHttp,
        resources: {
          flavor: data.flavors.flavor,
          cpu: data.flavors.number,
          //gpu?: number,
        },
      };
      orderNotebook(notebookInfos);
    },
    (error) => {
      console.log(error);
    },
  );

  const scrollToDiv = (target: string) => {
    const div = document.getElementById(target);
    if (div) {
      div.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const classNameLabel = 'scroll-m-20 text-xl font-semibold';
  return (
    <>
      <H3 className="font-bold text-3xl mb-5">Créer un notebook</H3>
      <P className="mb-2">
        Démarrez vos notebooks Jupyter ou VS Code dans le cloud, rapidement et
        simplement.
      </P>
      <Form {...model.form}>
        <form
          className="grid grid-cols-1 lg:grid-cols-4 gap-4"
          onSubmit={onSubmit}
        >
          <div className="col-span-1 md:col-span-3 divide-y-[1rem] divide-transparent">
            <section id="framework">
              <FormField
                control={model.form.control}
                name="frameworkWithVersion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={classNameLabel}>
                      Frameworks proposés
                    </FormLabel>
                    <P>
                      Vous avez besoin d’un environnement ? Nous vous proposons
                      les meilleurs frameworks d’intelligence artificielle sur
                      le marché. Si un framework manque, dites-le-nous.
                      Rejoindre la communauté
                    </P>
                    <FormControl>
                      <FrameworkSelect
                        {...field}
                        frameworks={model.lists.frameworks}
                        value={field.value}
                        onChange={(newFrameworkWithVersion) =>
                          model.form.setValue(
                            'frameworkWithVersion',
                            newFrameworkWithVersion,
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>
            <section id="editor">
              <FormField
                control={model.form.control}
                name="editor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={classNameLabel}>
                      Editeurs de code
                    </FormLabel>
                    <P>Choix du live-code editor</P>
                    <FormControl>
                      <EditorSelect
                        {...field}
                        editors={model.lists.editors}
                        value={field.value}
                        onChange={(newEditor) =>
                          model.form.setValue('editor', newEditor)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>
            <section id="region">
              <FormField
                control={model.form.control}
                name="region"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={classNameLabel}>
                      Sélectionnez une localisation
                    </FormLabel>
                    <FormControl>
                      <RegionsSelect
                        {...field}
                        regions={model.lists.regions}
                        value={field.value}
                        onChange={(newRegion: string) =>
                          model.form.setValue('region', newRegion)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>
            <section id="flavor">
              <FormField
                control={model.form.control}
                name="flavors"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={classNameLabel}>
                      Sélectionnez les ressources de votre Notebook
                    </FormLabel>
                    <FormControl>
                      <FlavorSelect
                        {...field}
                        flavors={model.lists.flavors}
                        value={field.value}
                        onChange={(newFlavor: Flavors) =>
                          //console.log(newFlavor)

                          {
                            model.form.setValue('flavors', newFlavor);
                            model.form.setValue('flavors.flavor', newFlavor.flavor);
                            model.form.setValue('flavors.number', newFlavor.number);
                            console.log(model.form.getValues("flavors"));
                          }
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>
            <section id="privacy">
              <FormField
                control={model.form.control}
                name="unsecureHttp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={classNameLabel}>
                      Paramètres de confidentialité
                    </FormLabel>
                    <FormControl>
                      <PrivacySelect
                        {...field}
                        onChange={(newAccessType: boolean) =>
                          model.form.setValue('unsecureHttp', newAccessType)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>
          </div>
          <Card className="sticky top-4 h-fit shadow-lg">
            <CardHeader>
              <CardTitle>Votre commande</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-2">
              <OrderSummary
                order={model.result}
                onSectionClicked={(section) => scrollToDiv(section)}
              />
              <div className="mt-2">
                <OrderPrice price={model.result.price} tax={model.result.tax} />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-1">
              <Button className="w-full" disabled={isPendingNoNotebook}>
                Order
              </Button>
              <OrderCommandCli order={model.result} />
            </CardFooter>
          </Card>
        </form>
      </Form>
    </>
  );
};

export default OrderFunnel;
