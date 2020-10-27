import forEach from 'lodash/forEach';
import reduce from 'lodash/reduce';
import set from 'lodash/set';

import svaTemplate from './sva-generator.html';

import { CONFIG } from './sva-generator.constant';

export default /* @ngInject */ ($q, $translate, $timeout) => {
  function normalizeNumber(number) {
    if (angular.isString(number)) {
      const n = number.replace(/\s/g, '');
      if (n.indexOf('+33') === 0 && n.length === 12) {
        return `0${n.slice(3)}`;
      }
      if (n.indexOf('0033') === 0 && n.length === 13) {
        return `0${n.slice(4)}`;
      }
      if (n.indexOf('08') === 0 && n.length === 10) {
        return n;
      }
    }
    return null;
  }

  function getNumberType(n) {
    const prefix = parseInt(normalizeNumber(n).slice(0, 4), 10);
    if (prefix >= 800 && prefix <= 805) {
      return 'free';
    }
    if (prefix >= 806 && prefix <= 809) {
      return 'common';
    }
    if (prefix >= 810 && prefix <= 899) {
      return 'pay';
    }
    return null;
  }

  function formatNumber(n, format) {
    switch (format) {
      case '0 8AB XXX XXX':
        return `${n[0]} ${n.slice(1, 4)} ${n.slice(4, 7)} ${n.slice(7, 10)}`;
      case '0 8AB XX XX XX':
        return `${n[0]} ${n.slice(1, 4)} ${n.slice(4, 6)} ${n.slice(
          6,
          8,
        )} ${n.slice(8, 10)}`;
      case '0 8AB XX XXXX':
        return `${n[0]} ${n.slice(1, 4)} ${n.slice(4, 6)} ${n.slice(6, 10)}`;
      case '0 8AB XXXX XX':
        return `${n[0]} ${n.slice(1, 4)} ${n.slice(4, 8)} ${n.slice(8, 10)}`;
      case '08 AB XX XX XX':
        return `${n.slice(0, 2)} ${n.slice(2, 4)} ${n.slice(4, 6)} ${n.slice(
          6,
          8,
        )} ${n.slice(8, 10)}`;
      default:
        return n;
    }
  }

  function loadImage(src) {
    return $q((resolve, reject) => {
      const result = new Image();
      result.onload = function onload() {
        resolve(result);
      };
      result.error = function error(err) {
        reject(err);
      };
      result.src = src;
    });
  }

  function drawCenteredAt(source, dest, center) {
    const ctx = dest.getContext('2d');
    const midx = Math.floor(source.width * 0.5);
    const midy = Math.floor(source.height * 0.5);
    ctx.drawImage(source, center[0] - midx, center[1] - midy);
  }

  function colorize(canvas, color) {
    const ctx = canvas.getContext('2d');
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let i = 0;
    /* eslint-disable prefer-destructuring, no-plusplus */
    while (i < data.data.length) {
      data.data[i++] = color[0];
      data.data[i++] = color[1];
      data.data[i++] = color[2];
      i++;
    }
    /* eslint-disable prefer-destructuring, no-plusplus */
    ctx.putImageData(data, 0, 0);
    return canvas;
  }

  return {
    restrict: 'E',
    scope: {
      number: '=',
      numberFormat: '=',
      width: '=',
      fill: '=',
      pricePerCall: '=',
      pricePerMinute: '=',
    },
    template: svaTemplate,
    link(scope, element) {
      set(scope, 'invalidNumber', false);

      function loadAssets() {
        const fill = scope.fill || 'gradient';
        const template = `${getNumberType(scope.number) +
          (fill ? `_${fill}` : '')}.png`;
        return $q.all({
          template: loadImage(scope.scale.assetsPath + template),
          font: loadImage(`${scope.scale.assetsPath}font.png`),
          fontSmall: loadImage(`${scope.scale.assetsPath}font_small.png`),
          perCall: loadImage(`${scope.scale.assetsPath}per_call.png`),
          perMinute: loadImage(`${scope.scale.assetsPath}per_min.png`),
          noop: $timeout(angular.noop, 500),
        });
      }

      /**
       * Render the number and return the resulting canvas.
       * We are using a bitmap font because specification requires Arial bold which is copyrighted.
       */
      function renderNumber(number, fontImage, fontAdvance) {
        const result = document.createElement('canvas');
        const ctx = result.getContext('2d');
        let pos = 0; // current character position

        // compute canvas width
        result.width = reduce(
          number,
          (sum, c) =>
            sum + (c === ' ' ? Math.floor(fontAdvance * 0.5) : fontAdvance),
          0,
        );
        result.height = fontImage.height;

        // draw each characters of the number
        forEach(number, (c) => {
          if (c < '0' || c > '9') {
            if (c === ',' || c === '.') {
              ctx.drawImage(
                fontImage,
                fontAdvance * 10,
                0,
                fontAdvance,
                fontImage.height,
                pos,
                0,
                fontAdvance,
                fontImage.height,
              );
            }
            pos += Math.floor(fontAdvance * 0.5);
          } else {
            const i = parseInt(c, 10);
            ctx.drawImage(
              fontImage,
              fontAdvance * i,
              0,
              fontAdvance,
              fontImage.height,
              pos,
              0,
              fontAdvance,
              fontImage.height,
            );
            pos += fontAdvance;
          }
        });

        return result;
      }

      function renderSva(number, assets) {
        const result = document.createElement('canvas');
        const ctx = result.getContext('2d');
        result.width = assets.template.width;
        result.height = assets.template.height;

        // draw template
        ctx.drawImage(assets.template, 0, 0);

        // draw number
        const formattedNumber = formatNumber(number, scope.numberFormat);
        let numberCanvas = renderNumber(
          formattedNumber,
          assets.font,
          scope.scale.fontAdvance,
        );
        if (scope.fill !== 'black') {
          numberCanvas = colorize(
            numberCanvas,
            CONFIG.colors.rgb[getNumberType(scope.number)],
          );
        }
        drawCenteredAt(
          numberCanvas,
          result,
          scope.scale.templateCenter[scope.fill],
        );

        let price = null;
        if (scope.pricePerCall > 0) {
          price = {
            value: parseFloat(
              Math.round(scope.pricePerCall * 100) / 100,
            ).toFixed(2),
            type: 'perCall',
          };
        } else if (scope.pricePerMinute > 0) {
          price = {
            value: parseFloat(
              Math.round(scope.pricePerMinute * 100) / 100,
            ).toFixed(2),
            type: 'perMinute',
          };
        }

        // draw price
        if (price) {
          let priceCanvas = renderNumber(
            `${price.value}`,
            assets.fontSmall,
            scope.scale.fontSmallAdvance,
          );
          const pricePos = scope.scale.templatePricePosition[scope.fill];
          priceCanvas = colorize(priceCanvas, [255, 255, 255]);
          ctx.drawImage(priceCanvas, pricePos[0], pricePos[1]);
          const priceSuffix = document.createElement('canvas');
          const priceSuffixCtx = priceSuffix.getContext('2d');
          priceSuffix.width = assets.perCall.width;
          priceSuffix.height = assets.perCall.height;
          priceSuffixCtx.drawImage(assets[price.type], 0, 0);
          ctx.drawImage(
            colorize(priceSuffix, [255, 255, 255]),
            priceCanvas.width -
              scope.scale.fontSmallAdvance / 2 +
              2 +
              pricePos[0],
            pricePos[1],
          );
        }

        return result;
      }

      function refresh() {
        set(scope, 'invalidNumber', normalizeNumber(scope.number) === null);
        // eslint-disable-next-line no-bitwise, no-param-reassign
        scope.invalidNumber |= getNumberType(scope.number) === null;
        if (!scope.invalidNumber) {
          set(scope, 'isLoading', true);
          element.find('.sva-container').empty();
          set(scope, 'imageHref', null);
          loadAssets()
            .then((assets) => {
              const number = normalizeNumber(scope.number);
              const image = renderSva(number, assets);
              if (image) {
                const elt = angular
                  .element('<img/>')
                  .attr('src', image.toDataURL('image/png'))
                  .attr('width', image.width)
                  .attr('height', image.height);
                element.find('.sva-container').append(elt);
                set(scope, 'imageHref', image.toDataURL('image/png'));
              }
            })
            .catch((err) => {
              set(scope, 'error', err);
            })
            .finally(() => {
              set(scope, 'isLoading', false);
            });
        }
      }

      $translate.refresh().then(() => {
        set(scope, 'scale', CONFIG.scale['14pt']);
        scope.$watchGroup(
          ['number', 'numberFormat', 'fill', 'pricePerCall', 'pricePerMinute'],
          refresh,
        );
      });
    },
  };
};
