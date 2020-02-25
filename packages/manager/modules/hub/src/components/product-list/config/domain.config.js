export default {
  route: '/domain/{domain}',
  columns: [
    {
      title: 'hub_product_listing_domain',
      property: 'domain',
      template: `
        <a data-ng-href="{{ ('domain' | redirection: { domain: $row.domain }) }}"
           data-ng-bind="$row.domain">
        </a>
      `,
      sortable: 'asc',
      searchable: true,
    },
    {
      title: 'hub_product_listing_offer',
      property: 'offer',
      template: "{{ 'hub_product_listing_offer_' + $row.offer | translate }}",
    },
    {
      title: 'hub_product_listing_dns_type',
      property: 'nameServerType',
      template:
        "{{ 'hub_product_listing_dns_type_' + $row.nameServerType | translate }}",
    },
    {
      title: 'hub_product_listing_owo',
      property: 'owoSupported',
      template:
        "{{ 'hub_product_listing_' + (!$row.owoSupported) | translate }}",
    },
    {
      title: 'hub_product_listing_dnssec',
      property: 'dnssecSupported',
      template:
        "{{ 'hub_product_listing_' + (!$row.dnssecSupported) | translate }}",
    },
    {
      title: 'hub_product_listing_transfer_lock',
      property: 'transferLockStatus',
      template:
        "{{ 'hub_product_listing_transfer_' + $row.transferLockStatus | translate }}",
    },
    {
      title: 'hub_product_listing_expiration_date',
      property: 'expirationDate',
      template: '{{ $row.expirationDate | date }}',
    },
  ],
};
