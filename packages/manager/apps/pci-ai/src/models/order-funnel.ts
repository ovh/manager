import { order } from './catalog';
import { ai } from './types';

export interface frameworkWithVersion {
    framework: string;
    version: string;
}

export interface Flavor {
    default: boolean;
    description: string;
    gpuInformation?: ai.capabilities.flavor.GpuInformation;
    id: string;
    max: number;
    resourcesPerUnit: ai.capabilities.flavor.ResourcesPerUnit;
    type: ai.capabilities.FlavorTypeEnum;
    region: string,
    pricing: order.publicOrder.Pricing,
}

export interface Flavors {
    flavor: string;
    number: number;
}