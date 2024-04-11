import { nichandle, order } from "@/models/catalog";

export const mockedCatalogPlan: order.publicOrder.Plan = {
    addonFamilies: [{
        name: "name",
    }
    ],
    configurations: [{
        isCustom: true,
        isMandatory: true,
        name: "name",
    }
    ],
    invoiceName: "invoiceName",
    planCode: "planCode",
    pricingType: order.cart.GenericProductPricingTypeEnum.consumption,
    pricings: [{
        capacities: [order.cart.GenericProductPricingCapacitiesEnum.consumption],
        commitment: 1,
        description: "description",
        interval: 2,
        intervalUnit: order.cart.DurationUnitEnum.day,
        mode: "mode",
        mustBeCompleted: true,
        phase: 14,
        price: 1,
        quantity: {
            min: 1,
        },
        repeat: {
            min: 1,
        },
        strategy: order.cart.GenericProductPricingStrategyEnum.stairstep,
        tax: 1,
        type: order.cart.GenericProductPricingTypeEnum.consumption,
    }],
    product: "product",
}

export const mockedCatalog: order.publicOrder.Catalog = {
    addons: [mockedCatalogPlan],
    catalogId: 1,
    locale: {
        currencyCode: order.CurrencyCodeEnum.EUR,
        subsidiary: nichandle.OvhSubsidiaryEnum.EU,
        taxRate: 40,
    },
    planFamilies: [{
        name: "planFamiliesName",
    }],
    plans: [mockedCatalogPlan],
    products: [{
        description: "description",
        name: "name",
    }]
}