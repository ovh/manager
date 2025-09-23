import React from 'react';

import { OdsText } from '@ovhcloud/ods-components/react';

import { Clipboard, LinkType, Links } from '@ovh-ux/manager-react-components';

import GeneralInformationTile from '@/components/dashboard/general-information/GeneralInformationTile.component';

export default function GeneralInformationPage() {
  const tiles = [
    {
      title: 'Service Information',
      help: 'Basic details about the service',
      items: [
        {
          id: 'description',
          label: 'Description',
          value: (
            <OdsText>Hosted Private Cloud – VMware vSphere service running in GRA region.</OdsText>
          ),
        },
        {
          id: 'api-url',
          label: 'API URL',
          value: <Clipboard value="https://api.ovh.com/1.0/hostedprivatecloud" />,
        },
        {
          id: 'service-id',
          label: 'Service ID',
          value: <Clipboard value="srv-12345-abcde" />,
        },
        {
          id: 'region',
          label: 'Region',
          value: <OdsText>GRA (Gravelines, France)</OdsText>,
        },
        {
          id: 'status',
          label: 'Status',
          value: <OdsText className="text-green-600">Active</OdsText>,
        },
      ],
    },
    {
      title: 'Documentation',
      help: 'Helpful external links',
      items: [
        {
          id: 'docs',
          label: 'Docs',
          value: (
            <Links
              href="https://help.ovhcloud.com/csm/en-hosted-private-cloud"
              label="Documentation"
              type={LinkType.external}
              target="_blank"
            />
          ),
        },
        {
          id: 'api-reference',
          label: 'API Reference',
          value: (
            <Links
              href="https://api.ovh.com/console/"
              label="API Explorer"
              type={LinkType.external}
              target="_blank"
            />
          ),
        },
        {
          id: 'guides',
          label: 'Guides',
          value: (
            <Links
              href="https://help.ovhcloud.com/csm/en-hosted-private-cloud-vmware-vsphere-getting-started"
              label="Getting Started Guide"
              type={LinkType.external}
              target="_blank"
            />
          ),
        },
      ],
    },
    {
      title: 'Network Information',
      help: 'Details about networking and connectivity',
      items: [
        {
          id: 'ip-block',
          label: 'Public IP Block',
          value: <Clipboard value="51.210.0.0/28" />,
        },
        {
          id: 'vrack',
          label: 'vRack',
          value: (
            <Links
              href="https://www.ovhcloud.com/en/network/vrack/"
              label="vrack-12345"
              type={LinkType.next}
            />
          ),
        },
        {
          id: 'bandwidth',
          label: 'Bandwidth',
          value: <OdsText>1 Gbps Guaranteed</OdsText>,
        },
      ],
    },
    {
      title: 'Support',
      help: 'Support and assistance',
      items: [
        {
          id: 'support-center',
          label: 'Support Center',
          value: (
            <Links
              href="https://help.ovhcloud.com/"
              label="Open Support Center"
              type={LinkType.external}
              target="_blank"
            />
          ),
        },
        {
          id: 'tickets',
          label: 'Support Tickets',
          value: (
            <Links
              href="https://www.ovh.com/manager/dedicated/#/ticket"
              label="View Tickets"
              type={LinkType.next}
            />
          ),
        },
      ],
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-12">
      <GeneralInformationTile tiles={tiles} />
    </div>
  );
}
