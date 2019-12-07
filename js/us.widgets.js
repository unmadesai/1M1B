// US g-alert
(function ($) {
	"use strict";

	$.fn.gAlert = function () {

		return this.each(function () {
			var alert = $(this),
				alertClose = alert.find('.g-alert-close');

			if (alertClose) {
				alertClose.click(function(){
					alert.animate({ height: '0', margin: 0}, 400, function(){
						alert.css('display', 'none');
						$(window).resize();
					});
				});
			}
		});
	};
})(jQuery);

jQuery(document).ready(function() {
	"use strict";

	jQuery('.g-alert').gAlert();
});

// US w-tabs
(function ($) {
	"use strict";

	$.fn.wTabs = function () {


		return this.each(function () {
			var tabs = $(this),
				itemsList = tabs.find('.w-tabs-list'),
				items = tabs.find('.w-tabs-item'),
				sections = tabs.find('.w-tabs-section'),
				resizeTimer = null,
				itemsWidth = 0,
				running = false,
				firstActiveItem = tabs.find('.w-tabs-item.active').first(),
				firstActiveSection = tabs.find('.w-tabs-section.active').first(),
				activeIndex = null;

			if (itemsList.length) {
				var itemsCount = itemsList.find('.w-tabs-item').length;
				if (itemsCount) {
					itemsList.addClass('items_'+itemsCount);
				}
			}

			if ( ! tabs.hasClass('layout_accordion')) {
				if ( ! firstActiveSection.length) {
					firstActiveItem = tabs.find('.w-tabs-item').first();
					firstActiveSection = tabs.find('.w-tabs-section').first();
				}

				tabs.find('.w-tabs-item.active').removeClass('active');
				tabs.find('.w-tabs-section.active').removeClass('active');

				firstActiveItem.addClass('active');
				firstActiveSection.addClass('active');

			} else {
				$(sections).each(function(sectionIndex, section) {
					if ($(section).hasClass('active')) {
						activeIndex = sectionIndex;
					}
				});
			}


			items.each(function(){
				itemsWidth += $(this).outerWidth(true);
			});

			function tabs_resize(){
				if ( ! (tabs.hasClass('layout_accordion') && ! tabs.data('accordionLayoutDynamic'))) {
					if (jQuery(window).width() < 768) {
						tabs.data('accordionLayoutDynamic', true);
						if ( ! tabs.hasClass('layout_accordion')) {
							tabs.addClass('layout_accordion');
						}
					} else {
						if (tabs.hasClass('layout_accordion')) {
							tabs.removeClass('layout_accordion');
						}
					}
				}
			}

			tabs_resize();

			$(window).resize(function(){
				window.clearTimeout(resizeTimer);
				resizeTimer = window.setTimeout(function(){
					tabs_resize();
				}, 50);

			});

			sections.each(function(index){
				var item = $(items[index]),
					section = $(sections[index]),
					section_title = section.find('.w-tabs-section-header'),
					section_content = section.find('.w-tabs-section-content');

				if (section.hasClass('active')) {
					section_content.slideDown();
				}

				section_title.click(function(){
					var currentHeight = 0;

					if (tabs.hasClass('type_toggle')) {
						if ( ! running) {
							if (section.hasClass('active')) {
								running = true;
								if (item) {
									item.removeClass('active');
								}
								section_content.slideUp(null, function(){
									section.removeClass('active');
									running = false;
									$(window).resize();
								});
							} else {
								running = true;
								if (item) {
									item.addClass('active');
								}
								section_content.slideDown(null, function(){
									section.addClass('active');
									running = false;
									section.find('.w-map').each(function(map){
										var mapObj = jQuery(this).data('gMap.reference'),
											center = mapObj.getCenter();

										google.maps.event.trigger(jQuery(this)[0], 'resize');
										if (jQuery(this).data('gMap.infoWindows').length) {
											jQuery(this).data('gMap.infoWindows')[0].open(mapObj, jQuery(this).data('gMap.overlays')[0]);
										}
										mapObj.setCenter(center);
									});
									$(window).resize();
								});
							}
						}


					} else if (( ! section.hasClass('active')) && ( ! running)) {
						running = true;
						items.each(function(){
							if ($(this).hasClass('active')) {
								$(this).removeClass('active');
							}
						});
						if (item) {
							item.addClass('active');
						}

						sections.each(function(){
							if ($(this).hasClass('active')) {
								currentHeight = $(this).find('.w-tabs-section-content').height();
								if ( ! tabs.hasClass('layout_accordion')) {
									tabs.css({'height': tabs.height(), 'overflow': 'hidden'});
									setTimeout(function(){ tabs.css({'height': '', 'overflow': ''}); }, 300);
								}
								$(this).find('.w-tabs-section-content').slideUp();
							}
						});



						section_content.slideDown(null, function(){
							sections.each(function(){
								if ($(this).hasClass('active')) {
									$(this).removeClass('active');
								}
							});
							section.addClass('active');
							activeIndex = index;

							if (tabs.hasClass('layout_accordion')){
								var hederHeight = jQuery('.l-header').outerHeight();
								jQuery("html, body").animate({
									scrollTop: section.offset().top-(hederHeight-1)+"px"
								}, {
									duration: 1200,
									easing: "easeInOutQuint"
								});
							}

							running = false;
							section.find('.w-map').each(function(map){
								var mapObj = jQuery(this).data('gMap.reference'),
									center = mapObj.getCenter();

								google.maps.event.trigger(jQuery(this)[0], 'resize');
								if (jQuery(this).data('gMap.infoWindows').length) {
									jQuery(this).data('gMap.infoWindows')[0].open(mapObj, jQuery(this).data('gMap.overlays')[0]);
								}
								mapObj.setCenter(center);
							});

							$(window).resize();
						});
					}

					if (section.parents('.w-portfolio-item').length){
						var portfolioItem = section.parents('.w-portfolio-item'),
							portfolioDetails = portfolioItem.find('.w-portfolio-item-details');

						window.setTimeout(function() {
							section.parents('.w-portfolio-item').css({'margin-bottom': portfolioDetails.height()+'px'});
						}, 300);
					}

				});

				if (item)
				{
					item.click(function(){
						section_title.click();
					});
				}


			});

		});
	};
})(jQuery);

jQuery(document).ready(function() {
	"use strict";

	jQuery('.w-tabs').wTabs();
});

// US w-portfolio
(function ($) {
	"use strict";

	$.fn.wPortfolio = function () {

		return this.each(function () {
			var portfolio = jQuery(this),
				items = portfolio.find('.w-portfolio-item'),
				running = false,
				activeIndex;

			items.each(function(itemIndex, item){
				var $item = jQuery(item),
					$anchor = $item.find('.w-portfolio-item-anchor'),
					$details = $item.find('.w-portfolio-item-details'),
					$detailsContent = $item.find('.w-portfolio-item-details-content'),
					$detailsHiddenContent = $item.find('.w-portfolio-hidden-content'),
					$detailsClose = $details.find('.w-portfolio-item-details-close'),
					$detailsNext = $details.find('.w-portfolio-item-details-arrow.to_next'),
					$detailsPrev = $details.find('.w-portfolio-item-details-arrow.to_prev'),
					$nextItem = $item.next(),
					$prevItem = $item.prev(),
					$window = jQuery(window),
					itemResize = function(){
						if ($item.hasClass('active')) {
							$item.css('margin-bottom', $details.height()+'px');
						}
					};

				$anchor.click(function(){
					if (( ! $item.hasClass('active')) && ( ! $anchor.hasClass('external-link')) && ( ! running)){
						running = true;

						var activeItem = portfolio.find('.w-portfolio-item.active');

						activeItem.find('.w-portfolio-item-details').hide();
						activeItem.find('.w-portfolio-item-details-content').empty();
						activeItem.removeClass('active').css('margin-bottom', '');

						$detailsContent.html($detailsHiddenContent.val().replace(/us_not_textarea/gi, 'textarea'));
						$details.css({opacity: 0, display: 'block'});

						if (jQuery.magnificPopup){
							$details.find('a[ref=magnificPopup][class!=direct-link]').magnificPopup({
								type: 'image'
							});
						}

						$detailsContent.find('.w-tabs').wTabs();
						$detailsContent.find('.g-alert').gAlert();

						$detailsContent.find('.w-map').each(function(map){
							var mapObj = jQuery(this).data('gMap.reference'),
								center = mapObj.getCenter();

							google.maps.event.trigger(jQuery(this)[0], 'resize');
							if (jQuery(this).data('gMap.infoWindows').length) {
								jQuery(this).data('gMap.infoWindows')[0].open(mapObj, jQuery(this).data('gMap.overlays')[0]);
							}
							mapObj.setCenter(center);
						});

						if (jQuery().wpcf7InitForm !== undefined){
							$detailsContent.find('div.wpcf7 > form').find('img.ajax-loader').remove();
							$detailsContent.find('div.wpcf7 > form').wpcf7InitForm();
						}

						if (jQuery().fotorama){
							$detailsContent.find('.fotorama').each(function(){
								var $this = jQuery(this);
								$this.fotorama({
									spinner: {
										lines: 13,
										color: 'rgba(0, 0, 0, .75)'
									}
								});
								$this.on('fotorama:ready', function(){
									setTimeout(itemResize, 50);
								});
							});
						}

						$details.stop().animate({opacity: 1}, 300, function(){
							$details.css({opacity: ''});
							$window.resize();
						});

						$item.css('margin-bottom', $details.height()+'px');
						$details.imagesLoaded().always(function(){
							setTimeout(itemResize, 50);
						});

						$window.on('resize', itemResize);

						var hederHeight = jQuery('.l-header').outerHeight();
						jQuery("html, body").animate({
							scrollTop: $item.offset().top+0.7*$anchor.height()+1-hederHeight+"px"
						}, {
							duration: 1000,
							easing: "easeInOutQuad"
						});

						$item.addClass('active');
						activeIndex = itemIndex;
						running = false;

					}
				});

				$detailsClose.off('click').click(function(){
					$details.slideUp(300, function(){
						$details.find('.w-portfolio-item-details-content').empty();
					});
					$item.removeClass('active').animate({'margin-bottom': 0}, 300);
					$window.on('resize', itemResize);
				});

				if ($nextItem.length){
					$detailsNext.off('click').click(function(){
						$nextItem.find('.w-portfolio-item-anchor').click();
					});
				} else {
					$detailsNext.hide();
				}

				if ($prevItem.length){
					$detailsPrev.off('click').click(function(){
						$prevItem.find('.w-portfolio-item-anchor').click();
					});
				} else {
					$detailsPrev.hide();
				}

			});
		});
	};
})(jQuery);

jQuery(document).ready(function() {
	"use strict";

	jQuery('.w-portfolio').wPortfolio();
});