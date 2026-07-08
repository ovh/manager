export const VDC_RESOURCE_MIN_QUANTITY = 1;

export const FREESPARE_REGEX = /freespare/i;

export const VDC_RESOURCE_DELETION_TOOLTIPS = {
  default: 'managed_vcd_vdc_contact_support',
  compute: {
    minQuantity: 'managed_vcd_vdc_compute_delete_tooltip_min_quantity',
    freeFirst: 'managed_vcd_vdc_compute_delete_tooltip_free_compute',
  },
  storage: {
    minQuantity: 'managed_vcd_vdc_storage_delete_tooltip_min_quantity',
    freeFirst: 'managed_vcd_vdc_storage_delete_tooltip_free_storage',
  },
} as const;
