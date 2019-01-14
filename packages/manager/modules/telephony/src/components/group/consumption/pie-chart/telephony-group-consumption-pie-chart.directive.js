import controller from './telephony-group-consumption-pie-chart.controller';
import template from './telephony-group-consumption-pie-chart.html';

export default /* @ngInject */ ($window) => {
  const { d3 } = $window;
  if (!d3) {
    throw new Error('D3 must be load');
  }

  return {
    scope: {
      dataset: '=',
    },
    controller,
    controllerAs: 'PieCtrl',
    template,
    link($scope, $element, $attr, $ctrl) {
      const sizeRatio = $element.parent('div')[0].offsetWidth;
      const animationRatio = 20;
      const viewBox = sizeRatio + (animationRatio * 2);
      const radius = sizeRatio / 2;
      const data = $scope.dataset || [];

      // Take angular element and do a d3 node
      const svg = d3.select($element[0])
        .append('div')
        .classed('pie__container', true)
        .append('svg')
        .attr('preserveAspectRatio', 'xMinYMin meet')
        .attr('viewBox', `-${animationRatio} -${animationRatio} ${viewBox} ${viewBox}`)
        .classed('pie__wrapper', true)
        .append('g')
        .attr('transform', `translate(${sizeRatio / 2},${sizeRatio / 2})`);

      // Create Arc specification
      const arc = d3.arc()
        .innerRadius(radius - 20)
        .outerRadius(radius);

      // Create Pie
      const pie = d3.pie()
        .value(d => d.count)
        .sort(null);

      // Create arcs
      const arcs = svg.selectAll('path')
        .data(pie(data))
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('class', d => d.data.label)
        .each(function eachArcs(d) {
          // eslint-disable-next-line no-underscore-dangle
          return this._current === d;
        });

      /* var pathAnim = function (arc, dir) {
                switch (dir) {
                    case 0:
                        arc.transition()
                            .duration(500)
                            .ease(d3.easeBounce).attr("d", d3.arc()
                            .innerRadius(radius - animationRatio)
                            .outerRadius(radius)
                        );
                        break;
                    case 1:
                        arc.transition()
                            .duration(500)
                            .ease(d3.easeBounce).attr("d", d3.arc()
                            .innerRadius(radius)
                            .outerRadius(radius + animationRatio)
                        );
                        break;
                }
            };

            Manage click on Arc
            arcs.on("click", function () {
                var currentArc = d3.select(this);
                var clicked = currentArc.classed("clicked");

                pathAnim(currentArc, ~~(!clicked));
                currentArc.classed("clicked", !clicked);
            }); */

      $scope.$watchCollection('dataset', (dataParam) => {
        const duration = 1200;
        let theData = dataParam;

        if (theData) {
          // Update data into controller
          $ctrl.setDataset(theData);

          if ($ctrl.getTotal() === 0) {
            theData = [{
              label: 'empty',
              count: 1,
            }];
          }

          // Update data in d3
          arcs.data(pie(theData));

          // Play awesome animation
          arcs.transition()
            .duration(duration)
            .ease(d3.easeBounce)
            .attr('class', d => d.data.label)
            .attrTween('d', function attrTweenCallback(a) {
              // eslint-disable-next-line no-underscore-dangle
              const i = d3.interpolate(this._current, a);
              // eslint-disable-next-line no-underscore-dangle
              this._current = i(0);
              return function transition(t) {
                return arc(i(t));
              };
            });
        }
      });
    },
  };
};
