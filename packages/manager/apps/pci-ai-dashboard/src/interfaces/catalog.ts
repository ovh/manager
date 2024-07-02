/* eslint-disable @typescript-eslint/no-namespace */
export namespace order {
    /** Currency code */
    export enum CurrencyCodeEnum {
      'AUD' = 'AUD',
      'CAD' = 'CAD',
      'CZK' = 'CZK',
      'EUR' = 'EUR',
      'GBP' = 'GBP',
      'INR' = 'INR',
      'LTL' = 'LTL',
      'MAD' = 'MAD',
      'N/A' = 'N/A',
      'PLN' = 'PLN',
      'SGD' = 'SGD',
      'TND' = 'TND',
      'USD' = 'USD',
      'XOF' = 'XOF',
      'points' = 'points',
    }
    export namespace cart {
      /** Type of a pricing */
      export enum GenericProductPricingTypeEnum {
        'consumption' = 'consumption',
        'purchase' = 'purchase',
        'rental' = 'rental',
      }
      /** Capacity of a pricing (type) */
      export enum GenericProductPricingCapacitiesEnum {
        'consumption' = 'consumption',
        'detach' = 'detach',
        'downgrade' = 'downgrade',
        'dynamic' = 'dynamic',
        'installation' = 'installation',
        'renew' = 'renew',
        'upgrade' = 'upgrade',
      }
      /** Unit corresponding to a duration range */
      export enum DurationUnitEnum {
        'day' = 'day',
        'hour' = 'hour',
        'month' = 'month',
        'none' = 'none',
      }
      /** Strategy of a Pricing */
      export enum GenericProductPricingStrategyEnum {
        'stairstep' = 'stairstep',
        'tiered' = 'tiered',
        'volume' = 'volume',
      }
    }
    export namespace publicOrder {
      export namespace EngagementConfiguration {
        /** Strategy applicable at the end of the Engagement */
        export enum EndStrategyEnum {
          'CANCEL_SERVICE' = 'CANCEL_SERVICE',
          'REACTIVATE_ENGAGEMENT' = 'REACTIVATE_ENGAGEMENT',
          'STOP_ENGAGEMENT_FALLBACK_DEFAULT_PRICE' = 'STOP_ENGAGEMENT_FALLBACK_DEFAULT_PRICE',
          'STOP_ENGAGEMENT_KEEP_PRICE' = 'STOP_ENGAGEMENT_KEEP_PRICE',
        }
        /** Engagement's type, either fully pre-paid (upfront) or periodically paid up to engagement duration (periodic) */
        export enum TypeEnum {
          'periodic' = 'periodic',
          'upfront' = 'upfront',
        }
      }
      /** Describes a Catalog inside a Subsidiary */
      export interface Catalog {
        /** List of addons of the catalog */
        addons: order.publicOrder.Plan[];
        /** Identifier of the catalog */
        catalogId: number;
        /** Subsidiary specific information */
        locale: order.publicOrder.Locale;
        /** List of plan families of the catalog */
        planFamilies: order.publicOrder.PlanFamily[];
        /** List of main plans of the catalog */
        plans: order.publicOrder.Plan[];
        /** List of products of the catalog */
        products: order.publicOrder.Product[];
      }
  
      /** Describes a PlanFamily for a Catalog */
      export interface PlanFamily {
        /** Family name */
        name: string;
      }
      /** Describes specifics for a given Subsidiary */
      export interface Locale {
        /** Currency used by the Subsidiary */
        currencyCode: order.CurrencyCodeEnum;
        /** Current Subsidiary */
        subsidiary: nichandle.OvhSubsidiaryEnum;
        /** Default VAT rate used by the Subsidiary */
        taxRate: number;
      }
      /** Describes a Product attached to a Commercial offer */
      export interface Product {
        /** Product blobs */
        blobs?: order.publicOrder.ProductBlob;
        /** List of possible Configurations for this Commercial offer */
        configurations?: order.publicOrder.Configuration[];
        /** Description of the Product */
        description: string;
        /** Identifier of the Product */
        name: string;
      }
      /** Describes a Commercial offer inside a Catalog */
      export interface Plan {
        /** Addon families for this offer */
        addonFamilies: order.publicOrder.AddonFamily[];
        /** Blobs */
        blobs?: order.publicOrder.ProductBlob;
        /** List of possible Configurations for this Commercial offer */
        configurations: order.publicOrder.Configuration[];
        /** Configuration when pricing type is consumption */
        consumptionConfiguration?: order.publicOrder.ConsumptionConfiguration;
        /** Name of the family this Commercial offer belongs to */
        family?: string;
        /** Commercial offer description */
        invoiceName: string;
        /** Commercial offer identifier */
        planCode: string;
        /** Type of Pricing used by this Commercial offer */
        pricingType: order.cart.GenericProductPricingTypeEnum;
        /** List of possible Pricings for this Commercial offer */
        pricings: order.publicOrder.Pricing[];
        /** Identifier of the Product linked to this Commercial offer */
        product: string;
      }
      /** Describes an Addon family for a Commercial offer */
      export interface AddonFamily {
        /** List of Commercial offers that can be ordered as an Addon of the current Commerical offer for the current Family */
        addons?: string[];
        /** Default Commercial offer that can be ordered as an Addon of the current Commercial offer for the current Family */
        default?: string;
        /** Whether this Addon family is exclusive and can be ordered only once for the main Commercial offer */
        exclusive?: boolean;
        /** Whether this Addon family is mandatory */
        mandatory?: boolean;
        /** Family name */
        name: string;
      }
      /** Describes a Blob */
      export interface ProductBlob {
        /** Commercial information for Dedicated Server Product */
        commercial?: order.publicOrder.ProductBlobCommercial;
        /** Marketing information for VPS Product */
        marketing?: order.publicOrder.ProductBlobMarketing;
        /** Meta blobs for VPS Product */
        meta?: order.publicOrder.ProductBlobMeta;
        /** Tags */
        tags?: string[];
        /** Technical information for Dedicated Server Product */
        technical?: order.publicOrder.ProductBlobTechnical;
        /** Value for meta blobs */
        value?: string;
      }
      /** Describes a Commercial blob */
      export interface ProductBlobCommercial {
        /** Brick */
        brick?: string;
        /** Brick subtype */
        brickSubtype?: string;
        /** Connection */
        connection?: order.publicOrder.ProductBlobConnection;
        /** Features */
        features?: order.publicOrder.ProductBlobCommercialFeatures[];
        /** Line */
        line?: string;
        /** Name */
        name?: string;
        /** Price */
        price?: order.publicOrder.ProductBlobCommercialPrice;
        /** Range */
        range?: string;
      }
      /** Describes Features for a commercial blob */
      export interface ProductBlobCommercialFeatures {
        /** Name */
        name?: string;
        /** Value */
        value?: string;
      }
      /** Describes a Price for a commercial blob */
      export interface ProductBlobCommercialPrice {
        /** Display */
        display?: order.publicOrder.ProductBlobCommercialPriceDisplay;
        /** Interval */
        interval?: string;
        /** Precision */
        precision?: number;
        /** Unit */
        unit?: string;
      }
      /** Describes a Display a price */
      export interface ProductBlobCommercialPriceDisplay {
        /** Value */
        value: string;
      }
      /** Describes a Connection for a blob for a Dedicated Server */
      export interface ProductBlobConnection {
        /** Clients */
        clients: order.publicOrder.ProductBlobConnectionClients;
        /** Total */
        total: number;
      }
      /** Describes Clients for a Connection for a blob for a Dedicated Server */
      export interface ProductBlobConnectionClients {
        /** Concurrency */
        concurrency: number;
        /** Number */
        number: number;
      }
      /** Describes a Marketing blob */
      export interface ProductBlobMarketing {
        /** Marketing content information for VPS Product */
        content: order.publicOrder.ProductBlobMarketingContent[];
      }
      /** Describes a Content for a Marketing blob */
      export interface ProductBlobMarketingContent {
        /** Key */
        key: string;
        /** Value */
        value: string;
      }
      /** Describes a Meta blob */
      export interface ProductBlobMeta {
        /** Configurations */
        configurations: order.publicOrder.ProductBlobMetaConfigurations[];
      }
      /** Describes a Configuration for a meta blob */
      export interface ProductBlobMetaConfigurations {
        /** Name */
        name: string;
        /** Values */
        values: order.publicOrder.ProductBlobMetaConfigurationsValues[];
      }
      /** Describes a Values configuration for a meta blob */
      export interface ProductBlobMetaConfigurationsValues {
        /** Blobs */
        blobs: order.publicOrder.ProductBlob;
        /** Value */
        value: string;
      }
      /** Describes a Technical Blob */
      export interface ProductBlobTechnical {
        /** Network informations */
        bandwidth?: order.publicOrder.ProductBlobTechnicalNetwork;
        /** Connection */
        connection?: order.publicOrder.ProductBlobConnection;
        /** Connection per seconds */
        connectionPerSeconds?: order.publicOrder.ProductBlobTechnicalPerSeconds;
        /** CPU informations */
        cpu?: order.publicOrder.ProductBlobTechnicalCPU;
        /** Datacenter */
        datacenter?: order.publicOrder.ProductBlobTechnicalDatacenter;
        /** Ephemeral local storage */
        ephemeralLocalStorage?: order.publicOrder.ProductBlobTechnicalEphemeralStorage;
        /** GPU informations */
        gpu?: order.publicOrder.ProductBlobTechnicalGPU;
        /** License informations */
        license?: order.publicOrder.ProductBlobTechnicalLicense;
        /** Memory informations */
        memory?: order.publicOrder.ProductBlobTechnicalMemory;
        /** Name */
        name?: string;
        /** Nodes */
        nodes?: order.publicOrder.ProductBlobTechnicalNodes;
        /** NVME */
        nvme?: order.publicOrder.ProductBlobTechnicalNvme;
        /** OS */
        os?: order.publicOrder.ProductBlobTechnicalOS;
        /** Connection per seconds */
        requestPerSeconds?: order.publicOrder.ProductBlobTechnicalPerSeconds;
        /** Hardware informations */
        server?: order.publicOrder.ProductBlobTechnicalServer;
        /** Disks informations */
        storage?: order.publicOrder.ProductBlobTechnicalStorage;
        /** Throughput */
        throughput?: order.publicOrder.ProductBlobTechnicalThroughput;
        /** Virtualization */
        virtualization?: order.publicOrder.ProductBlobTechnicalVirtualization;
        /** Volume */
        volume?: order.publicOrder.ProductBlobTechnicalVolume;
        /** vRack informations */
        vrack?: order.publicOrder.ProductBlobTechnicalNetwork;
      }
      /** Describes a CPU for a technical blob */
      export interface ProductBlobTechnicalCPU {
        /** CPU Boost */
        boost?: number;
        /** CPU Brand */
        brand?: string;
        /** Number of cores */
        cores?: number;
        /** Customizable */
        customizable?: boolean;
        /** Frequency of CPU in GHz */
        frequency?: number;
        /** Displayable name */
        model?: string;
        /** Number of CPU */
        number?: number;
        /** CPU score */
        score?: number;
        /** Number of threads */
        threads?: number;
      }
      /** Describes a Datacenter for a technical Blob */
      export interface ProductBlobTechnicalDatacenter {
        /** City */
        city?: string;
        /** Country */
        country?: string;
        /** Country code */
        countryCode?: nichandle.OvhSubsidiaryEnum;
        /** Name */
        name?: string;
        /** Region */
        region?: string;
      }
      /** Describes a Disk for a technical blob */
      export interface ProductBlobTechnicalDisk {
        /** Disk capacity in Gb */
        capacity: number;
        /** Disk interface */
        interface?: string;
        /** Iops */
        iops?: number;
        /** Number of disks */
        number?: number;
        /** Size unit */
        sizeUnit?: string;
        /** Disk specs */
        specs?: string;
        /** Disk technology */
        technology?: string;
        /** Usage informations */
        usage?: string;
      }
      /** Describes an Ephemeral Storage for technical blob */
      export interface ProductBlobTechnicalEphemeralStorage {
        /** Disk properties */
        disks?: order.publicOrder.ProductBlobTechnicalDisk[];
      }
      /** Describes a Frame for a technical blob */
      export interface ProductBlobTechnicalFrame {
        /** Dual power supply */
        dualPowerSupply: boolean;
        /** Frame model */
        model: string;
        /** Frame size */
        size: string;
      }
      /** Describes a GPU for a technical blob */
      export interface ProductBlobTechnicalGPU {
        /** GPU brand */
        brand?: string;
        /** GPU memory size */
        memory: order.publicOrder.ProductBlobTechnicalMemory;
        /** GPU model */
        model?: string;
        /** GPU number */
        number?: number;
        /** GPU performance */
        performance?: number;
      }
      /** Describes a License for a technical Blob */
      export interface ProductBlobTechnicalLicense {
        /** Application */
        application?: string;
        /** Cores informations */
        cores?: order.publicOrder.ProductBlobTechnicalLicenseCores;
        /** CPU */
        cpu?: order.publicOrder.ProductBlobTechnicalCPU;
        /** Network informations */
        distribution?: string;
        /** Edition informations */
        edition?: string;
        /** Family */
        family?: string;
        /** Feature */
        feature?: string;
        /** Flavor informations */
        flavor?: string;
        /** Images informations */
        images?: string[];
        /** Number of account */
        nbOfAccount?: number;
        /** Package */
        package?: string;
        /** Version informations */
        version?: string;
      }
      /** Describes license cores for a technical blob */
      export interface ProductBlobTechnicalLicenseCores {
        /** Number of cores */
        number: number;
        /** Total of cores */
        total?: number;
      }
      /** Describes a Memory technical Blob */
      export interface ProductBlobTechnicalMemory {
        /** Customizable */
        customizable?: boolean;
        /** ECC */
        ecc?: boolean;
        /** RAM Frequency */
        frequency?: number;
        /** Interface */
        interface?: string;
        /** RAM Type (DDRx...) */
        ramType?: string;
        /** Size of the RAM in Gb */
        size: number;
        /** Size unit */
        sizeUnit?: string;
      }
      /** Describes a Network technical Blob */
      export interface ProductBlobTechnicalNetwork {
        /** Network burst */
        burst?: number;
        /** Network capacity */
        capacity?: number;
        /** Guaranteed Network */
        guaranteed?: boolean;
        /** Network interfaces */
        interfaces?: number;
        /** Is max? */
        isMax?: boolean;
        /** Network level */
        level?: number;
        /** Network limit */
        limit?: number;
        /** Shared */
        shared?: boolean;
        /** Traffic */
        traffic?: number;
        /** Unlimited */
        unlimited?: boolean;
      }
      /** Describes a Node for technical blob */
      export interface ProductBlobTechnicalNodes {
        /** Number of nodes */
        number: number;
      }
      /** Describes a NVME for technical blob */
      export interface ProductBlobTechnicalNvme {
        /** Disk properties */
        disks?: order.publicOrder.ProductBlobTechnicalDisk[];
      }
      /** Describes an OS for a technical blob */
      export interface ProductBlobTechnicalOS {
        /** Distribution */
        distribution?: string;
        /** Edition */
        edition?: string;
        /** Family */
        family?: string;
        /** Version */
        version?: string;
      }
      /** Describes a connection or request per seconds for a technical blob */
      export interface ProductBlobTechnicalPerSeconds {
        /** Total */
        total: number;
        /** Unit */
        unit?: string;
      }
      /** Describes a Raid for a technical blob */
      export interface ProductBlobTechnicalRaid {
        /** Card size */
        cardModel?: string;
        /** Card size */
        cardSize?: string;
        /** Type */
        type: string;
      }
      /** Describes some technicals informations for a technical blob */
      export interface ProductBlobTechnicalServer {
        /** CPU properties */
        cpu: order.publicOrder.ProductBlobTechnicalCPU;
        /** Frame properties */
        frame: order.publicOrder.ProductBlobTechnicalFrame;
        /** Network */
        network?: order.publicOrder.ProductBlobTechnicalNetwork;
        /** Dedicated server series */
        range: string;
        /** Services properties */
        services: order.publicOrder.ProductBlobTechnicalServices;
      }
      /** Describes some technicals informations */
      export interface ProductBlobTechnicalServices {
        /** Anti DDOS */
        antiddos: string;
        /** Included backup */
        includedBackup: number;
        /** SLA */
        sla: number;
      }
      /** Describes a Storage technical Blob */
      export interface ProductBlobTechnicalStorage {
        /** Disk properties */
        disks?: order.publicOrder.ProductBlobTechnicalDisk[];
        /** Hot Swap */
        hotSwap?: boolean;
        /** Raid */
        raid?: string;
        /** Raid details */
        raidDetails?: order.publicOrder.ProductBlobTechnicalRaid;
      }
      /** Describes a Throughput for a technical blob */
      export interface ProductBlobTechnicalThroughput {
        /** Level */
        level: number;
      }
      /** Describes a Virtualization for a Technical Blob */
      export interface ProductBlobTechnicalVirtualization {
        /** Hypervisor */
        hypervisor?: string;
      }
      /** Describes a Volume for a technichal blob */
      export interface ProductBlobTechnicalVolume {
        /** Capacity */
        capacity: order.publicOrder.ProductBlobTechnicalVolumeCapacity;
        /** CPU informations */
        iops: order.publicOrder.ProductBlobTechnicalVolumeIops;
      }
      /** Describes a Capacity for a Volume for a technichal blob */
      export interface ProductBlobTechnicalVolumeCapacity {
        /** Max */
        max: number;
      }
      /** Describes a Iops for a Volume for a technichal blob */
      export interface ProductBlobTechnicalVolumeIops {
        /** Guaranteed */
        guaranteed: boolean;
        /** Level */
        level: number;
      }
      /** Describes the Configuration for a Commercial offer */
      export interface Configuration {
        /** Whether the value of this Configuration is custom */
        isCustom: boolean;
        /** Whether this Configuration is mandatory */
        isMandatory: boolean;
        /** Identifier of the Configuration */
        name: string;
        /** Possible values for this Configuration, if not custom */
        values?: string[];
      }
      /** Describes consumption configuration for a Plan */
      export interface ConsumptionConfiguration {
        /** Consumption billing strategy */
        billingStrategy: order.publicOrder.BillingStrategyEnum;
        /** Consumption ping end policy used at end of usage */
        pingEndPolicy?: order.publicOrder.PingEndPolicyEnum;
        /** Consumption prorata unit */
        prorataUnit: order.publicOrder.ProrataUnitEnum;
      }
      /** Enum values for Billing Strategy */
      export enum BillingStrategyEnum {
        'custom' = 'custom',
        'diff' = 'diff',
        'max' = 'max',
        'max_retain' = 'max_retain',
        'ping' = 'ping',
        'sum' = 'sum',
      }
      /** Enum values for Ping End Policy */
      export enum PingEndPolicyEnum {
        'full' = 'full',
        'prorata' = 'prorata',
      }
      /** Enum values for Prorata Unit */
      export enum ProrataUnitEnum {
        'day' = 'day',
        'hour' = 'hour',
        'month' = 'month',
      }
      /** Describes a Pricing for a Commercial offer */
      export interface Pricing {
        /** Capacities of the Pricing, describes what the Pricing can be used for */
        capacities: order.cart.GenericProductPricingCapacitiesEnum[];
        /** Engagement period */
        commitment: number;
        /** Pricing description */
        description: string;
        /** Engagement Configuration */
        engagementConfiguration?: order.publicOrder.EngagementConfiguration;
        /** Length of the interval */
        interval: number;
        /** Unit of the interval */
        intervalUnit: order.cart.DurationUnitEnum;
        /** Pricing mode */
        mode: string;
        /** Pricing must be completed */
        mustBeCompleted: boolean;
        /** Phase for the Pricing */
        phase: number;
        /** Price, in micro-cents */
        price: number;
        /** Promotions */
        promotions?: order.publicOrder.Promotion[];
        /** Describes how many times the Commercial offer can be added to the Cart */
        quantity: order.publicOrder.PricingMinMax;
        /** Describes how many times the interval can be repeated */
        repeat: order.publicOrder.PricingMinMax;
        /** Pricing strategy */
        strategy: order.cart.GenericProductPricingStrategyEnum;
        /** Tax that can be applied, in micro-cents */
        tax: number;
        /** Pricing type */
        type: order.cart.GenericProductPricingTypeEnum;
      }
      /** Describes minimal and maximal values for a Pricing */
      export interface PricingMinMax {
        /** Maximal value */
        max?: number;
        /** Minimal value */
        min: number;
      }
      /** Configuration of an engagement triggered by a given pricing */
      export interface EngagementConfiguration {
        /** Default action executed once the engagement is fully consumed */
        defaultEndAction: order.publicOrder.EngagementConfiguration.EndStrategyEnum;
        /** Engagement's duration */
        duration: string;
        /** Engagement type, either fully pre-paid (upfront) or periodically paid up to engagement duration (periodic) */
        type: order.publicOrder.EngagementConfiguration.TypeEnum;
      }
      /** Describes a Promotion inside a Catalog */
      export interface Promotion {
        /** Promotion description */
        description: string;
        /** Promotion discount */
        discount: order.publicOrder.PromotionDiscountTotal;
        /** Promotion duration */
        duration?: number;
        /** Promotion end date using rfc3339 */
        endDate?: string;
        /** Is the global quantity of the promotion limited? */
        isGlobalQuantityLimited: boolean;
        /** Promotion name */
        name: string;
        /** Promotion quantity */
        quantity?: number;
        /** Promotion start date using rfc3339 */
        startDate: string;
        /** Promotion total */
        total: order.publicOrder.PromotionDiscountTotal;
        /** Promotion type */
        type: order.ReductionTypeEnum;
        /** Promotion value */
        value: number;
      }
      /** Describes a Promotion discount or total inside a Catalog */
      export interface PromotionDiscountTotal {
        /** Tax */
        tax: number;
        /** Value */
        value: number;
      }
    }
    /** Type of reduction */
    export enum ReductionTypeEnum {
      'fixed_amount' = 'fixed_amount',
      'forced_amount' = 'forced_amount',
      'percentage' = 'percentage',
    }
  }
  export namespace nichandle {
    /** OVH subsidiaries */
    export enum OvhSubsidiaryEnum {
      'CZ' = 'CZ',
      'DE' = 'DE',
      'ES' = 'ES',
      'EU' = 'EU',
      'FI' = 'FI',
      'FR' = 'FR',
      'GB' = 'GB',
      'IE' = 'IE',
      'IT' = 'IT',
      'LT' = 'LT',
      'MA' = 'MA',
      'NL' = 'NL',
      'PL' = 'PL',
      'PT' = 'PT',
      'SN' = 'SN',
      'TN' = 'TN',
    }
  }
  