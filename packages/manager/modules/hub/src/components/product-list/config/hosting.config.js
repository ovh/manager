export default {
  route: '/hosting/web/{serviceName}',
  formater: (hosting) => ({
    ...hosting,
    displayName: hosting.displayName || hosting.serviceName,
  }),
  columns: [
    {
      title: 'hub_product_listing_domain',
      property: 'displayName',
      sortable: 'asc',
      searchable: true,
    },
    {
      title: 'hub_product_listing_resource_state',
      property: 'state',
      template:
        "{{ 'hub_product_listing_resource_state_' + $row.state | translate }}",
    },
    {
      title: 'hub_product_listing_ip',
      property: 'hostingIp',
      searchable: true,
    },
    {
      title: 'hub_product_listing_ipv6',
      property: 'hostingIpv6',
      searchable: true,
    },
    {
      title: 'hub_product_listing_offer',
      property: 'offer',
    },
    {
      title: 'hub_product_listing_datacenter',
      property: 'datacenter',
      template:
        "{{ 'hub_product_listing_datacenter_' + $row.datacenter | translate }}",
    },
    {
      title: 'hub_product_listing_os',
      property: 'operatingSystem',
    },
    {
      title: 'hub_product_listing_resource_type',
      property: 'resourceType',
      template:
        "{{ 'hub_product_listing_resource_type_' + $row.resourceType | translate }}",
    },
    {
      title: 'hub_product_listing_resource_quota',
      property: 'quotaUsed.value',
      template: `
        {{ $row.quotaUsed.value.toFixed(2) + ' ' + $row.quotaUsed.unit + ' / ' + $row.quotaSize.value + ' ' + $row.quotaSize.unit }}
      `,
    },
    {
      title: 'hub_product_listing_expiration_date',
      property: 'expirationDate',
      template: '{{ $row.expirationDate | date }}',
    },
    {
      title: 'hub_product_listing_boost_offer',
      property: 'boostOffer',
    },
    {
      title: 'hub_product_listing_cluster',
      property: 'cluster',
    },
    {
      title: 'hub_product_listing_cluster_ip',
      property: 'clusterIp',
    },
    {
      title: 'hub_product_listing_cluster_ipv6',
      property: 'clusterIpv6',
    },
    {
      title: 'hub_product_listing_cdn',
      property: 'hasCdn',
      template: "{{ 'hub_product_listing_' + $row.hasCdn | translate }}",
    },
    {
      title: 'hub_product_listing_hostedSSL',
      property: 'hasHostedSsl',
      template: "{{ 'hub_product_listing_' + $row.hasHostedSsl | translate }}",
    },
  ],
};
