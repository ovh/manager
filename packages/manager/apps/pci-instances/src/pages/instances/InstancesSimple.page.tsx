import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Outlet,
  useLocation,
  useParams,
  useRouteLoaderData,
} from 'react-router-dom';
import { getFlavors, getInstancesByRegion, TFlavor, TImage, TInstance, TProject } from '@ovh-ux/manager-pci-common';
import {
  Datagrid,
  DatagridColumn,
  getProjectRegions,
  Notifications,
  PageLayout,
  PciGuidesHeader,
  Title,
  TRegion,
  useNotifications,
  useProjectUrl,
} from '@ovh-ux/manager-react-components';
import {
  OsdsDivider,
  OsdsSearchBar,
} from '@ovhcloud/ods-components/react';
import { Trans, useTranslation } from 'react-i18next';
import { Spinner } from '@/components/spinner/Spinner.component';
// import { useInstancesSimple } from '@/data/hooks/instance/useInstances';
import { Breadcrumb } from '@/components/breadcrumb/Breadcrumb.component';
import { NameIdCell } from './datagrid/cell/NameIdCell.component';
import { TextCell } from '@/components/datagrid/cell/TextCell.component';
import { AddressesCell } from './datagrid/cell/AddressesCell.component';
import NotFoundPage from '../404/NotFound.page';
import { useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiResponse, v6 } from '@ovh-ux/manager-core-api';
import _, { isError } from 'lodash';

const Instances: FC = () => {
  const { t } = useTranslation(['list', 'common']);
  const { projectId } = useParams() as { projectId: string }; // safe because projectId has already been handled by async route loader
  const project = useRouteLoaderData('root') as TProject;
  const {
    addWarning,
    clearNotifications,
    notifications,
    addError,
  } = useNotifications();
  const location = useLocation();
  const notFoundAction: boolean = location.state?.notFoundAction;
  const [searchField, setSearchField] = useState('');

  const {
    data: instanceData,
    isLoading: instancesQueryLoading,
    isError,
  } = useInstancesSimple(projectId)

  const {
    data: flavorData,
    isLoading: flavorQueryLoading,
    isFlavorError,
  } = useFlavors(projectId, instanceData)

  const {
    data: imageData,
    isLoading: imageQueryLoading,
    isImageError,
  } = useImages(projectId, instanceData)

  const projectUrl = useProjectUrl('public-cloud');

  const datagridColumns: DatagridColumn<TInstance>[] = useMemo(
    () => [
      {
        id: 'name',
        cell: (instance) => (
          <NameIdCell isLoading={instancesQueryLoading} instance={instance} />
        ),
        label: t('pci_instances_list_column_nameId'),
        isSortable: true,
      },
      {
        id: 'region',
        cell: (instance) => (
          <TextCell
            isLoading={instancesQueryLoading}
            label={instance.region}
          />
        ),
        label: t('pci_instances_list_column_region'),
        isSortable: false,
      },
      {
        id: 'flavor',
        cell: (instance) => {
          let flavorLabel = instance.flavorId;
          if (!flavorQueryLoading){
            const flavor = flavorData?.find(flavor => flavor.id === instance.flavorId);
            flavorLabel = flavor?.name ?? instance.flavorId;
          }
          return <TextCell isLoading={flavorQueryLoading} label={flavorLabel} />
        },
        label: t('pci_instances_list_column_flavor'),
        isSortable: true,
      },
      {
        id: 'image',
        cell: (instance) => {
          let imageLabel= instance.imageId;
          if (!imageQueryLoading){
          const image = imageData?.find(image => image.id === instance.imageId);
          imageLabel = image?.name ?? instance.imageId;
          }
          return <TextCell isLoading={imageQueryLoading} label={imageLabel} />
        },
        label: t('pci_instances_list_column_image'),
        isSortable: true,
      },
    ],
    [instancesQueryLoading, t, (t: string) => t],
  );


  const errorMessage = useMemo(
    () => (
      <>
        <Trans
          t={t}
          i18nKey="pci_instances_list_unknown_error_message1"
          tOptions={{ interpolation: { escapeValue: true } }}
          shouldUnescape
        />
        <br />
        <Trans t={t} i18nKey="pci_instances_list_unknown_error_message2" />
      </>
    ),
    [t],
  );


  useEffect(() => {
    if (isError||isFlavorError||isImageError) addError(errorMessage, true);
  }, [isError, isFlavorError, isImageError, addError, t, errorMessage]);

  if (instancesQueryLoading) return <Spinner />;


  if (notFoundAction) {
    return <NotFoundPage />;
  }
  return (
    <><div>Test</div>
      <PageLayout>
        {project && <Breadcrumb projectLabel={project.description ?? ''} />}
        <div className="header mb-6 mt-8">
          <div className="flex items-center justify-between">
            <Title>{t('common:pci_instances_common_instances_title')}</Title>
            <PciGuidesHeader category="instances"></PciGuidesHeader>
          </div>
        </div>
        <div>
          <OsdsDivider />
          <Notifications />
          <OsdsDivider />
          <div className={'sm:flex items-center justify-between mt-4'}>
            <div className="justify-between flex gap-5">
              <OsdsSearchBar
                className={'w-auto'}
                value={searchField}
              />
            </div>
          </div>
          {instanceData && (
            <div className="mt-10">
              <Datagrid
                columns={datagridColumns}
                items={instanceData}
                totalItems={instanceData.length}
                className={'!overflow-x-visible'}
              />
            </div>
          )}
        </div>
      </PageLayout>
      <Outlet />
    </>
  );
};

export default Instances;

const useInstancesSimple = (
  projectId: string,
) => {
  const queryClient = useQueryClient();

  const { data:regions , isFetched: isRegionFetched } = useQuery<TRegion[]>({
    queryKey: ['regions', 'projectId', projectId],
    queryFn: () => getProjectRegions(projectId),
  });

  const regionsCompute = isRegionFetched && regions ? regions.filter(region => region.services.find(s => s.name == 'instance')) : []
  const queries = useQueries({
    queries: isRegionFetched && regionsCompute.length > 0 ?
    regionsCompute.map(region  => ({
      queryKey: ["project", projectId, "instances", "region", region.name],
      queryFn: () => getInstancesByRegion(projectId,region.name),
    }))
    : [],
    combine: (result) => {
      return {
        data: result ? result.map(({ data }) => data).flat().filter(d => d) : [],
        isPending: result.some(({ isPending }) => isPending),
        isLoading: result.some(({ isLoading }) => isLoading),
        isError: result.some(({ isError }) => isError),
        // isLoading
      }
    },
  });

  return {
    data: queries.data.filter(d => d) as TInstance[],
    isPending: queries.isPending,
    isLoading: queries.isLoading,
    isError: queries.isError,
  };
};

function useFlavors(projectId: string, instanceData: TInstance[]): { data: TFlavor[]; isLoading: boolean; isFlavorError: boolean; } {
  const regions = instanceData.map(instance => instance.region) || [];

  const queries = useQueries({
    queries: regions.map(region => ({
      queryKey: ['regions', 'projectId', projectId, 'region', region, 'flavors'],
      queryFn: () =>
           getFlavors(projectId, region)
      ,
    })),
    combine: (result) => {
      return {
        data: result ? result.map(({ data }) => data).flat().filter(d => d) : [],
        isPending: result.some(({ isPending }) => isPending),
        isLoading: result.some(({ isLoading }) => isLoading),
        isError: result.some(({ isError }) => isError),
        // isLoading
      }
    },
  });

  return {
    data: queries.data.filter(d => d) as TFlavor[],
    isLoading: queries.isLoading,
    isFlavorError: queries.isError,
  }
}


function useImages(projectId: string, instanceData: TInstance[]): { data: TImage[]; isLoading: boolean; isImageError: boolean; } {
  const images = _.uniqBy(instanceData.map(instance => ({imageId: instance.imageId, region: instance.region})) || [], image => image.imageId);

  const queries = useQueries({
    queries: images.map(image => ({
      queryKey: ['regions', 'projectId', projectId, 'region', image.region, 'images','imageId', image.imageId],
      queryFn: () => getImage(projectId, image.region, image.imageId).catch(error => {
        if (error.response?.status === 404) {
          return null;
           }
           throw error;
           }
      ),
    })),
    combine: (result) => {
      return {
        data: result ? result.map(({ data }) => data).flat().filter(d => d) : [],
        isPending: result.some(({ isPending }) => isPending),
        isLoading: result.some(({ isLoading }) => isLoading),
        isError: result.some(({ isError,  }) => isError),
        // isLoading
      }
    },
  });

  return {
    data: queries.data.filter(d => d) as TImage[],
    isLoading: queries.isLoading,
    isImageError: queries.isError,
  }
}

export const getImage = async (projectId: string, region: string, imageID: string): Promise<TImage> => {
  const { data } = await v6.get<TImage>(`/cloud/project/${projectId}/region/${region}/image/${imageID}`);
  return data;
};
