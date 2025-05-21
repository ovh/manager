import { PathParams } from 'msw';
import { Handler } from '@ovh-ux/manager-core-test-utils';
import { mockVrackSegmentList } from './vcd-datacentre-vrack-segment.mock';

export type GetVrackSegmentsMocksParams = {
  isVrackSegmentDeleteKo?: boolean;
  isVrackSegmentUpdateKo?: boolean;
  isVrackSegmentKO?: boolean;
  nbVrackSegment?: number;
};

export const getVrackSegmentsMocks = ({
  isVrackSegmentDeleteKo,
  isVrackSegmentUpdateKo,
  isVrackSegmentKO,
  nbVrackSegment = Number.POSITIVE_INFINITY,
}: GetVrackSegmentsMocksParams): Handler[] => [
  {
    url:
      '/vmwareCloudDirector/organization/:id/virtualDataCenter/:id/vrackSegment',
    response: isVrackSegmentKO
      ? { message: 'vrackSegment error' }
      : mockVrackSegmentList.slice(0, nbVrackSegment),
    api: 'v2',
    status: isVrackSegmentKO ? 500 : 200,
  },
  {
    url:
      '/vmwareCloudDirector/organization/:id/virtualDataCenter/:id/vrackSegment/:vrackSegmentId',
    response: (_: unknown, params: PathParams) =>
      isVrackSegmentKO
        ? { message: 'vrackSegment error' }
        : mockVrackSegmentList.find(
            (vrackSegment) => vrackSegment.id === params.vrackSegmentId,
          ),
    api: 'v2',
    status: isVrackSegmentKO ? 500 : 200,
  },
  {
    url:
      '/vmwareCloudDirector/organization/:id/virtualDataCenter/:id/vrackSegment/:vrackSegmentId',
    response: isVrackSegmentUpdateKo
      ? { message: 'vrackSegment update error' }
      : {},
    method: 'put',
    api: 'v2',
    status: isVrackSegmentUpdateKo ? 500 : 200,
  },
  {
    url:
      '/vmwareCloudDirector/organization/:id/virtualDataCenter/:id/vrackSegment/:vrackSegmentId',
    response: isVrackSegmentDeleteKo
      ? { message: 'vrackSegment delete error' }
      : {},
    method: 'delete',
    api: 'v2',
    status: isVrackSegmentDeleteKo ? 500 : 200,
  },
];
