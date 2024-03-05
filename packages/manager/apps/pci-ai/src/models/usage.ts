
export namespace usage {
    /** UsageCurrent */
    export interface UsageCurrent {
        hourlyUsage?: billingView.HourlyResources;
        lastUpdate: Date;
        monthlyUsage?: billingView.MonthlyResources;
        period: Period;
        resourcesUsage?: billingView.TypedResources[];
    }

    /** Period */
    export interface Period {
        from: Date;
        to: Date;
    }
}

export namespace billingView {
    /** Hourly usage */
    export interface HourlyResources {
        instance: HourlyInstance[];
        instanceBandwidth: HourlyInstanceBandwidth[];
        storage: HourlyStorage[];
        snapshot: HourlySnapshot[];
        volume: HourlyVolume[];
    }

    /** HourlyInstance */
    export interface HourlyInstance {
        details?: HourlyInstanceDetail[];
        quantity: Quantity;
        reference: string;
        region: string;
        totalPrice: number;
    }

    /** HourlyInstanceDetail */
    export interface HourlyInstanceDetail {
        instanceId: string;
        quantity: Quantity;
        totalPrice: number;
    }

    /** Quantity */
    export interface Quantity {
        unit: UnitQuantityEnum;
        value: number;
    }

    /** HourlyInstanceBandwidth */
    export interface HourlyInstanceBandwidth {
        incomingBandwidth?: BandwidthInstance;
        outgoingBandwidth?: BandwidthInstance;
        region: string;
        totalPrice: number;
    }

    /** BandwidthInstance */
    export interface BandwidthInstance {
        quantity: Quantity;
        totalPrice: number;
    }

    /** HourlyStorage */
    export interface HourlyStorage {
        bucketName?: string;
        incomingBandwidth?: BandwidthStorage;
        incomingInternalBandwidth?: BandwidthStorage;
        outgoingBandwidth?: BandwidthStorage;
        outgoingInternalBandwidth?: BandwidthStorage;
        region: string;
        stored?: StoredStorage;
        totalPrice: number;
        type: StorageTypeEnum;
    }

    /** BandwidthStorage */
    export interface BandwidthStorage {
        quantity: Quantity;
        totalPrice: number;
    }

    /** StoredStorage */
    export interface StoredStorage {
        quantity: Quantity;
        totalPrice: number;
    }

    /** StorageTypeEnum */
    export enum StorageTypeEnum {
        pca = "pca",
        pcs = "pcs",
        storageColdArchive = "storage-coldarchive",
        storageHighPerf = "storage-high-perf",
        storageStandard = "storage-standard",
    }

    /** HourlySnapshot */
    export interface HourlySnapshot {
        instance?: InstanceSnapshot;
        region: string;
        totalPrice: number;
        volume?: VolumeSnapshot;
    }

    /** InstanceSnapshot */
    export interface InstanceSnapshot {
        quantity: Quantity;
        totalPrice: number;
    }

    /** VolumeSnapshot */
    export interface VolumeSnapshot {
        quantity: Quantity;
        totalPrice: number;
    }

    /** HourlyVolume */
    export interface HourlyVolume {
        region: string;
        totalPrice: number;
    }

    /** MonthlyResources */
    export interface MonthlyResources {
        certification?: MonthlyCertification[];
        instance: MonthlyInstance[];
        instanceOption?: MonthlyInstanceOption[];
    }

    /** MonthlyCertification */
    export interface MonthlyCertification {
        details?: MonthlyCertificationDetail[];
        reference: string;
        totalPrice: number;
    }
    /**Details about certifications */
    export interface MonthlyCertificationDetail {
        activation: Date;
        totalPrice: number;
    }

    /** MonthlyInstance */
    export interface MonthlyInstance {
        details?: MonthlyInstanceDetail[];
        reference: string;
        region: string;
        totalPrice: number;
    }

    /** MonthlyInstanceDetail */
    export interface MonthlyInstanceDetail {
        activation: Date;
        instanceId: string;
        totalPrice: number;
    }

    /** MonthlyInstanceOption */
    export interface MonthlyInstanceOption {
        details?: MonthlyInstanceOptionDetail[];
        reference: string;
        region: string;
        totalPrice: number;
    }

    /** MonthlyInstanceOptionDetail */
    export interface MonthlyInstanceOptionDetail {
        instanceId: string;
        totalPrice: number;
    }

    /** TypedResources */
    export interface TypedResources {
        resources: RegionalizedResource[];
        totalPrice: number;
        type: string;
    }

    /** RegionalizedResource */
    export interface RegionalizedResource {
        components: Component[];
        region: string;
    }

    /** Component */
    export interface Component {
        name: string;
        quantity: Quantity;
        totalPrice: number;
    }

    /** UnitQuantityEnum */
    export enum UnitQuantityEnum {
        GiB = "GiB",
        GiBh = "GiBh",
        Hour = "Hour",
        Minute = "Minute",
        Second = "Second",
        Unit = "Unit",
    }
}
