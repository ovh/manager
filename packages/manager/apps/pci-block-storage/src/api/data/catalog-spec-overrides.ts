// SPDX-License-Identifier: BSD-3-Clause
// Copyright (c) OVH SAS

// TEMPORARY — hard-coded overrides for gen2 / gen2-luks volume specs.
// /cloud/project/{id}/catalog/volume will eventually return a `min` value on
// iops and bandwidth specs for these models. Until then, we inject the values
// client-side here so the rest of the app can consume the catalog as if `min`
// were always provided.
//
// The override never replaces a positive `min` already returned by the API:
// once the catalog ships its own value the patch becomes inert, and removal
// becomes purely cosmetic.
//
// To remove: delete this file and the call in catalog.ts:getVolumeCatalog.

import { TVolumeCatalog } from './catalog';

const HARDCODED_IOPS_MIN = 3000;
const HARDCODED_BANDWIDTH_MIN = 50; // MiB/s
const OVERRIDDEN_MODEL_NAMES = ['high-speed-gen2', 'high-speed-gen2-luks'];

const hasPositiveMin = (value: number | null | undefined): boolean =>
  typeof value === 'number' && value > 0;

export const applyHardcodedSpecOverrides = (
  catalog: TVolumeCatalog,
): TVolumeCatalog => {
  catalog.models
    .filter((model) => OVERRIDDEN_MODEL_NAMES.includes(model.name))
    .forEach((model) => {
      model.pricings.forEach((pricing) => {
        const iops = pricing.specs.volume.iops;
        if (iops && !iops.guaranteed && !hasPositiveMin(iops.min)) {
          iops.min = HARDCODED_IOPS_MIN;
        }
        const bandwidth = pricing.specs.bandwidth;
        if (
          bandwidth &&
          !bandwidth.guaranteed &&
          !hasPositiveMin(bandwidth.min)
        ) {
          bandwidth.min = HARDCODED_BANDWIDTH_MIN;
        }
      });
    });
  return catalog;
};
