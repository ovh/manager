export default class VrackOrderCtrl {
  /* @ngInject */
  constructor(VrackOrderService, $window) {
    this.VrackOrderService = VrackOrderService;
    this.$window = $window;
  }

  navigate(url) {
    this.$window.open(url, '_blank', 'noopener');
    this.goBack();
  }

  orderVrack() {
    this.VrackOrderService.order(this.cart.cartId)
      .then((data) => {
        this.navigate(data.url);
      })
      .catch((error) => {
        if (error.status === 400) {
          this.VrackOrderService.order(this.cart.cartId, false)
            .then((data) => {
              this.navigate(data.url);
            })
            .catch((err) => {
              this.error = {
                message: err.data.message,
                queryId: err.headers('X-Ovh-Queryid'),
              };
            });
        } else {
          this.error = {
            message: error.data.message,
            queryId: error.headers('X-Ovh-Queryid'),
          };
        }
      });
  }
}
