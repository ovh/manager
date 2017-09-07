angular.module('ua.extendedAccordion').directive('extendedAccordion', [
    '$timeout',
    '$rootScope',
    function ($timeout, $rootScope) {
        'use strict';
        return {
            restrict: 'A',
            link : function ($scope, $element) {
                var availableHeight,
                t,
                $searchForm   = $('#navigation-left-search-form'),
                $head         = $('#header-top-navigation'),
                ignoreAttr    = 'extended-accordion-ignore',
                toggleAttr    = 'extended-accordion-toggle',
                contentAttr   = 'extended-accordion-content',
                activeClass   = 'extended-accordion-toggle-in',
                closeClass    = 'extended-accordion-close';

                function attrSyntax(str) {
                    return '[' + str + '], [data-' + str + ']';
                }

                function close(elm, toggleElm, force) {
                    if(elm) {
                        elm.removeClass('extended-accordion-in')
                            .addClass(closeClass);
                    }

                    toggleElm.removeClass(activeClass);

                    if(force) {
                        toggleElm.siblings(attrSyntax(ignoreAttr)).hide();
                    }
                    $timeout(function () {
                        $rootScope.$broadcast("extendedAccordion.section.closed");
                    }, 350);
                }

                function open(elm, toggleElm) {
                    if(elm) {
                        elm.addClass('extended-accordion-in')
                            .removeClass(closeClass);
                    }

                    toggleElm.addClass(activeClass);

                    toggleElm.siblings(attrSyntax(ignoreAttr)).show();
                    $timeout(function () {
                        $rootScope.$broadcast("extendedAccordion.section.opened");
                    }, 350);
                }

                function adaptHeight() {
                    var opened, h;

                    opened = $element.find(attrSyntax(contentAttr).concat(':not(.extended-accordion-close)'));

                    h =  availableHeight;

                    opened.each(function (i, item) {
                        h -= ($(item).outerHeight() - $(item).height());
                    });

                    h =  h / (opened.length || 1);

                    opened.height(h);
                }

                function toggle(elm, toggleElm) {
                    if (elm.hasClass(closeClass) || elm.size() === 0 ) {
                        if ($element.attr('data-extended-accordion') !== "multi") {
                            $element.find(attrSyntax(toggleAttr)).each(function() {
                                close($(this).siblings(attrSyntax(contentAttr)), $(this), true);
                            });
                        }
                        open(elm, toggleElm);
                    } else{
                        close(elm, toggleElm, true);
                    }
                    getAvailableHeight();
                    adaptHeight();
                }

                function getAvailableHeight() {
                    var searchForm = $searchForm.height() || 0,
                    head = $head.height() || 0;

                    //Initiale element height
                    availableHeight  = $(window).height() - searchForm - head - 10;

                    //Remove togglers outerHeight
                    $element.find(attrSyntax(toggleAttr)).each(function() {
                        availableHeight -= $(this).outerHeight();
                    });

                    //Remove all tagged parasite outerHeight
                    $element.find(attrSyntax(ignoreAttr).concat(':visible')).each(function() {
                        availableHeight -= $(this).outerHeight();
                    });

                    //return compononent height
                    return availableHeight;
                }

                function initSize() {
                    var searchForm = $searchForm.height() || 0,
                    head = $head.height() || 0,
                    allElement = $element.find('[data-extended-accordion-toggle]');


                    $element.height($(window).height() - searchForm - head - 10);

                    $element.find(attrSyntax(toggleAttr)).each(function () {
                        var elem = $(this),
                            target = $(this).siblings(attrSyntax(contentAttr));

                        if (!elem.hasClass(activeClass)) {
                            close(target, elem);
                        } else {
                            open(target, elem);
                        }
                    });

                    if($element.find('.' + activeClass).size() === 0) {
                        // find active element
                        allElement.each(function() {
                            var elem = $(this),
                            target = $(this).siblings(attrSyntax(contentAttr));

                            if(target.find(".active").size() > 0) {
                                open(target, elem);
                            }
                        });
                    }

                    if($element.find('.' + activeClass).size() === 0) {
                        // No element selected, so open the first
                        allElement.first().each(function() {
                            var elem = $(this),
                            target = $(this).siblings(attrSyntax(contentAttr));

                            open(target, elem);
                        });
                    }

                    getAvailableHeight();
                    adaptHeight();
                }

                $timeout(function() {

                    $element.find(attrSyntax(toggleAttr)).each(function() {
                        $(this).on('click', function() {
                            var elmToToggle = $element.find($(this).siblings(attrSyntax(contentAttr)));
                            toggle(elmToToggle, $(this));
                        });
                    });

                    angular.element(window).bind('resize', initSize);

                    t = window.setTimeout(function () {
                        initSize();
                        window.clearTimeout(t);
                    }, 500);

                    $scope.$on('extendedAccordion.open.section', function (ev, selector) {
                        angular.noop(ev);
                        var elm = angular.element('*[data-type*="'+selector+'"]'),
                            elmToToggle = elm.siblings(attrSyntax(contentAttr));
                        open(elmToToggle, elm);
                        getAvailableHeight();
                        adaptHeight();
                    });

                    $scope.$on('extendedAccordion.close.section', function (ev, selector) {
                        angular.noop(ev);
                        var elm = angular.element('*[data-type*="'+selector+'"]'),
                            elmToToggle = elm.siblings(attrSyntax(contentAttr));
                        close(elmToToggle, elm, true);
                        getAvailableHeight();
                        adaptHeight();
                    });

                    $scope.$on('$destroy', function () {
                        angular.element(window).unbind('resize', initSize);
                    });

                });
            }
        };
    }
]);
