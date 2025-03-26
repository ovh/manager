import {
  TGetDatacentreParams,
  TGetClusterParams,
} from '@/data/api/vmwareServices';

export const VMWARE_SERVICES_ROUTE =
  '/service?type=/dedicatedCloud&subType=EPCC&external=false';

export const getVMwareDatacentreRoute = (serviceName: string) =>
  `/sws/dedicatedCloud/${serviceName}/datacenters-summary`;

export const getVMwareSAPInstallationsRoute = (serviceName: string) =>
  `/dedicatedCloud/${serviceName}/sap`;

export const getVMwareStoragePolicyRoute = (serviceName: string) =>
  `/dedicatedCloud/${serviceName}/storagePolicy`;

export const getClusterIdsRoute = ({
  serviceName,
  datacenterId,
}: TGetDatacentreParams) =>
  `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/cluster`;

export const getClusterRoute = ({
  serviceName,
  datacenterId,
  clusterId,
}: TGetClusterParams) =>
  `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/cluster/${clusterId}`;

export const getVsanDatastoresRoute = ({
  serviceName,
  datacenterId,
  clusterId,
}: TGetClusterParams) =>
  `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/cluster/${clusterId}/filerVsan`;

export const getDatastoresRoute = ({
  serviceName,
  datacenterId,
}: TGetDatacentreParams) =>
  `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/datastore`;

export const getDatacentrePortGroupRoute = ({
  serviceName,
  datacenterId,
}: TGetDatacentreParams) =>
  `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/portgroup`;

export const getSapCapabilitiesRoute = (serviceName: string) =>
  `/dedicatedCloud/${serviceName}/sap/capabilities`;
