export default class {
  /* @ngInject */
  constructor($q, $translate, $http, OvhHttp, User) {
    this.$q = $q;
    this.$translate = $translate;
    this.$http = $http;
    this.OvhHttp = OvhHttp;
    this.User = User;
  }

  $onInit() {
    this.user = null;
    this.selectedOffer = null;
    this.quantity = 1;
    this.expressOrderUrl = null;

    return this.fetchInitialData();
  }

  fetchInitialData() {
    this.loading = true;

    return this.$q
      .all({
        url: this.User.getUrlOf('express_order'),
        user: this.User.getUser(),
      })
      .then(({ url, user }) => {
        this.expressOrderUrl = url;
        this.user = user;
      })
      .catch((err) => {
        this.goBack(
          `${this.$translate.instant(
            'dedicatedCloud_host_order_loading_error',
          )} ${err.message || err}`,
          'danger',
        );
      })
      .finally(() => {
        this.loading = false;
      });
  }

  fetchOffers() {
    return this.OvhHttp.get(
      '/order/cartServiceOption/privateCloud/{serviceName}',
      {
        rootPath: 'apiv6',
        urlParams: {
          serviceName: this.serviceName,
        },
      },
    )
      .then((offers) => offers.filter((offer) => offer.family === 'host'))
      .then((offers) =>
        this.OvhHttp.get(
          '/dedicatedCloud/{serviceName}/datacenter/{datacenterId}/orderableHostProfiles',
          {
            rootPath: 'apiv6',
            urlParams: {
              serviceName: this.serviceName,
              datacenterId: this.datacenterId,
            },
          },
        ).then((profiles) => {
          const promise =
            profiles.length > 0
              ? this.$http.get('/products/partners/plans', {
                  params: {
                    ovhSubsidiary: this.user.ovhSubsidiary,
                    publicPlanCode: profiles.map((profile) => profile.name),
                  },
                })
              : this.$q.resolve({ data: [] });
          return promise.then((response) => {
            const plans = response.data;

            const sortedResult = offers
              .filter((offer) =>
                profiles.find((profile) => profile.name === offer.planCode),
              )
              .map((offer) => {
                const privatePlan = plans.find(
                  (plan) => plan.publicPlanCode === offer.planCode,
                )?.partnerPlan;
                const { prices } = offer;
                // If available replace pricing text and value with partner ones
                if (privatePlan) {
                  prices[0].price.text = privatePlan.pricings[0].formattedPrice;
                  prices[0].price.value =
                    privatePlan.pricings[0].price / 100000000;
                }
                return {
                  ...offer,
                  planCode: privatePlan ? privatePlan.planCode : offer.planCode,
                  profile: profiles.find((p) => p.name === offer.planCode),
                  prices,
                };
              })
              .sort(
                (offerA, offerB) =>
                  offerA.prices[0].price.value - offerB.prices[0].price.value,
              );

            [this.selectedOffer] = sortedResult;
            return sortedResult;
          });
        }),
      );
  }

  fetchDatagridOffers() {
    return this.fetchOffers().then((offers) => ({
      data: offers,
      meta: {
        totalCount: offers?.length || 0,
      },
    }));
  }

  getOrderUrl() {
    const [price] = this.selectedOffer.prices;
    const normalizedQuantity = Math.floor(this.quantity);

    return `${this.expressOrderUrl}review?products=${JSURL.stringify([
      {
        productId: 'privateCloud',
        serviceName: this.serviceName,
        planCode: this.selectedOffer.planCode,
        duration: price.duration,
        pricingMode: price.pricingMode,
        quantity: normalizedQuantity,
        configuration: [
          {
            label: 'datacenter_id',
            values: [this.datacenterId],
          },
        ],
      },
    ])}`;
  }
}
