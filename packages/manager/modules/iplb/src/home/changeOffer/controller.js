import { LB2_PLANCODE } from '../iplb-home.constants';
import { OFFERS_LABELS } from './constants';

export default class OctaviaLoadBalancerDeleteCtrl {
  /* @ngInject */
  constructor(
    $translate,
    $window,
    IpLoadBalancerChangeOfferService,
    coreConfig,
  ) {
    this.isLoading = false;
    this.$translate = $translate;
    this.$window = $window;
    this.user = coreConfig.getUser();
    this.IpLoadBalancerChangeOfferService = IpLoadBalancerChangeOfferService;
    this.OFFERS_LABELS = OFFERS_LABELS;
  }

  $onInit() {
    this.model = {
      selectedOffer: null,
      contractAgreement: false,
    };

    this.offerLoading = true;
    this.IpLoadBalancerChangeOfferService.getOffersDetails(
      this.serviceName,
      this.availableOffers,
    ).then((detailledOffers) => {
      this.offers = detailledOffers;
      this.model.selectedOffer = detailledOffers.find(
        (offer) => offer.planCode === LB2_PLANCODE,
      );
      this.offerLoading = false;
    });
  }

  onOfferChange(offer) {
    this.model.selectedOffer = offer;
  }

  validateOffer() {
    this.loadingOffer = true;
    this.IpLoadBalancerChangeOfferService.changeOffer(
      this.serviceName,
      this.model.selectedOffer.planCode,
    )
      .then(({ order: { url } }) => {
        this.$window.open(url, '_blank', 'noopener');
        this.goBack();
      })
      .catch((error) => {
        this.errorMessage = this.$translate.instant(
          'iplb_change_offer_contracts_error',
          {
            message: error.data?.message,
            requestId: error.headers('X-Ovh-Queryid'),
          },
        );
      })
      .finally(() => {
        this.loadingOffer = false;
      });
  }
}
