"use strict";
(function () {
	// Global variables
	let
			userAgent = navigator.userAgent.toLowerCase(),
			isIE = userAgent.indexOf("msie") !== -1 ? parseInt(userAgent.split("msie")[1], 10) : userAgent.indexOf("trident") !== -1 ? 11 : userAgent.indexOf("edge") !== -1 ? 12 : false;

	// Unsupported browsers
	if (isIE !== false && isIE < 12) {
		console.warn("[Core] detected IE" + isIE + ", load alert");
		var script = document.createElement("script");
		script.src = "./js/support.js";
		document.querySelector("head").appendChild(script);
	}

	let
			initialDate = new Date(),

			$document = $(document),
			$window = $(window),
			$html = $("html"),
			$body = $("body"),

			isDesktop = $html.hasClass("desktop"),
			isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
			windowReady = false,
			isNoviBuilder = false,
			livedemo = true,

			plugins = {
				bootstrapTooltip:        $('[data-bs-toggle="tooltip"]'),
				bootstrapModal:          $('.modal'),
				bootstrapTabs:           $('.tabs-custom'),
				bootstrapCards:          $(".card-group-custom"),
				customToggle:            $('[data-custom-toggle]'),
				captcha:                 $('.recaptcha'),
				campaignMonitor:         $('.campaign-mailform'),
				copyrightYear:           $('.copyright-year'),
				checkbox:                $('input[type="checkbox"]'),
				isotope:                 $('.isotope-wrap'),
				lightGallery:            $('[data-lightgallery="group"]'),
				lightGalleryItem:        $('[data-lightgallery="item"]'),
				lightDynamicGalleryItem: $('[data-lightgallery="dynamic"]'),
				materialParallax:        $('.parallax-container'),
				mailchimp:               $('.mailchimp-mailform'),
				owl:                     document.querySelectorAll('.owl-carousel'),
				popover:                 $('[data-bs-toggle="popover"]'),
				preloader:               $('.preloader'),
				rdNavbar:                document.querySelectorAll('.rd-navbar'),
				rdMailForm:              $('.rd-mailform'),
				rdInputLabel:            $('.form-label'),
				regula:                  $('[data-constraints]'),
				radio:                   $('input[type="radio"]'),
				swiper:                  document.querySelectorAll('.swiper-container'),
				search:                  $('.rd-search'),
				searchResults:           $('.rd-search-results'),
				statefulButton:          $('.btn-stateful'),
				viewAnimate:             $('.view-animate'),
				wow:                     $('.wow'),
				maps:                    $('.google-map-container'),
				counter:                 document.querySelectorAll('[data-counter]'),
				progressLinear:          document.querySelectorAll('.progress-linear'),
				progressCircle:          document.querySelectorAll('.progress-circle'),
				countdown:               document.querySelectorAll('.countdown'),
				accordion:               document.querySelectorAll('.accordion'),
				multiswitch:             document.querySelectorAll('[data-multi-switch]'),
				imageHover:              document.querySelectorAll('.image-hover'),
				modal:                   document.querySelectorAll('.modal'),
				modalBtn:                document.querySelectorAll('[data-modal-trigger]'),
				slick:                   document.querySelectorAll('.slick-slider'),
			};

	/**
	 * @desc Check the element has been scrolled into the view
	 * @param {object} elem - jQuery object
	 * @return {boolean}
	 */
	function isScrolledIntoView(elem) {
		if (isNoviBuilder) return true;
		return elem.offset().top + elem.outerHeight() >= $window.scrollTop() && elem.offset().top <= $window.scrollTop() + $window.height();
	}

	/**
	 * @desc Calls a function when element has been scrolled into the view
	 * @param {object} element - jQuery object
	 * @param {function} func - init function
	 */
	function lazyInit(element, func) {
		let scrollHandler = function () {
			if ((!element.hasClass('lazy-loaded') && (isScrolledIntoView(element)))) {
				func.call(element);
				element.addClass('lazy-loaded');
			}
		};

		scrollHandler();
		$window.on('scroll', scrollHandler);
	}

	/**
	 * Wrapper to eliminate json errors
	 * @param {string} str - JSON string
	 * @returns {object} - parsed or empty object
	 */
	function parseJSON(str) {
		try {
			if (str) return JSON.parse(str);
			else return {};
		} catch (error) {
			console.warn(error);
			return {};
		}
	}

	// Initialize scripts that require a loaded window
	$window.on('load', function () {
		// Page loader & Page transition
		if (plugins.preloader.length && !isNoviBuilder) {
			pageTransition({
				target:            document.querySelector('.page'),
				delay:             0,
				duration:          500,
				classIn:           'fadeIn',
				classOut:          'fadeOut',
				classActive:       'animated',
				conditions:        function (event, link) {
					return link &&
							!/(\#|javascript:void\(0\)|callto:|tel:|mailto:|:\/\/)/.test(link) &&
							!event.currentTarget.hasAttribute('data-lightgallery') &&
							!event.currentTarget.matches('[target="_blank"]');
				},
				onTransitionStart: function (options) {
					setTimeout(function () {
						plugins.preloader.removeClass('loaded');
					}, options.duration * .75);
				},
				onReady:           function () {
					plugins.preloader.addClass('loaded');
					windowReady = true;
				}
			});
		}

		// Counter
		if (plugins.counter) {
			let observer = new IntersectionObserver( function ( entries, observer ) {
				entries.forEach( function ( entry ) {
					let node = entry.target;

					if ( entry.isIntersecting ) {
						node.counter.run();
						observer.unobserve( node );
					}
				});
			}, {
				rootMargin: '0px',
				threshold: 1.0
			});

			plugins.counter.forEach( function ( node ) {
				let counter = new bCounter( Object.assign( {
					node: node,
					duration: 1000,
					autorun: false
				}, parseJSON( node.getAttribute( 'data-counter' ) ) ) );

				if ( window.xMode ) {
					counter.run();
				} else {
					observer.observe( node );
				}
			})
		}

		// Progress Bar
		if (plugins.progressLinear) {
			for (let i = 0; i < plugins.progressLinear.length; i++) {
				let
						container = plugins.progressLinear[i],
						bar = container.querySelector('.progress-linear-bar'),
						duration = container.getAttribute('data-duration') || 1000,
						counter = aCounter({
							node:     container.querySelector('.progress-linear-counter'),
							duration: duration,
							onStart:  function () {
								this.custom.bar.style.width = this.params.to + '%';
							}
						});

				bar.style.transitionDuration = duration / 1000 + 's';
				counter.custom = {
					container: container,
					bar:       bar,
					observer: new IntersectionObserver( function ( entries, observer ) {
						entries.forEach( function ( entry ) {
							if ( entry.isIntersecting ) {
								counter.custom.container.classList.add('animated');
								counter.run();
								observer.unobserve( entry.target )
							}
						});
					}, {
						rootMargin: '0px',
						threshold: 1.0
					})
				};

				if (isNoviBuilder) {
					counter.run();
				} else {
					counter.custom.observer.observe( container )
				}
			}
		}

		// Progress Circle
		if (plugins.progressCircle) {
			for (let i = 0; i < plugins.progressCircle.length; i++) {
				let
						container = plugins.progressCircle[i],
						counter = aCounter({
							node:     container.querySelector('.progress-circle-counter'),
							duration: 1000,
							onUpdate: function (value) {
								this.custom.bar.render(value * 3.6);
							}
						});

				counter.params.onComplete = counter.params.onUpdate;

				counter.custom = {
					container: container,
					bar:       aProgressCircle({node: container.querySelector('.progress-circle-bar')}),
					observer: new IntersectionObserver( function ( entries, observer ) {
						entries.forEach( function ( entry ) {
							if ( entry.isIntersecting ) {
								counter.custom.container.classList.add('animated');
								counter.run();
								observer.unobserve( entry.target )
							}
						});
					}, {
						rootMargin: '0px',
						threshold: 1.0
					})
				};

				if (isNoviBuilder) {
					counter.run();
				} else {
					counter.custom.observer.observe( container )
				}
			}
		}

		// Isotope
		if (plugins.isotope.length) {
			for (let i = 0; i < plugins.isotope.length; i++) {
				let
						wrap = plugins.isotope[i],
						filterHandler = function (event) {
							event.preventDefault();
							for (let n = 0; n < this.isoGroup.filters.length; n++) this.isoGroup.filters[n].classList.remove('active');
							this.classList.add('active');
							this.isoGroup.isotope.arrange({filter: this.getAttribute("data-isotope-filter") !== '*' ? '[data-filter*="' + this.getAttribute("data-isotope-filter") + '"]' : '*'});
						},
						resizeHandler = function () {
							this.isoGroup.isotope.layout();
						};

				wrap.isoGroup = {};
				wrap.isoGroup.filters = wrap.querySelectorAll('[data-isotope-filter]');
				wrap.isoGroup.node = wrap.querySelector('.isotope');
				wrap.isoGroup.layout = wrap.isoGroup.node.getAttribute('data-isotope-layout') ? wrap.isoGroup.node.getAttribute('data-isotope-layout') : 'masonry';
				wrap.isoGroup.isotope = new Isotope(wrap.isoGroup.node, {
					itemSelector: '.isotope-item',
					layoutMode:   wrap.isoGroup.layout,
					filter:       '*',
					columnWidth:  (function () {
						if (wrap.isoGroup.node.hasAttribute('data-column-class')) return wrap.isoGroup.node.getAttribute('data-column-class');
						if (wrap.isoGroup.node.hasAttribute('data-column-width')) return parseFloat(wrap.isoGroup.node.getAttribute('data-column-width'));
					}())
				});

				for (let n = 0; n < wrap.isoGroup.filters.length; n++) {
					let filter = wrap.isoGroup.filters[n];
					filter.isoGroup = wrap.isoGroup;
					filter.addEventListener('click', filterHandler);
				}

				window.addEventListener('resize', resizeHandler.bind(wrap));

				if (!isIE) {
					let imgs = document.querySelectorAll('img[loading="lazy"]')
					for (let i = 0; i < imgs.length; i++) {
						let img = imgs[i]
						img.addEventListener('load', function (e) {
							window.dispatchEvent(new Event('resize'));
						})
					}
				}
			}
		}

		// Material Parallax
		if (plugins.materialParallax.length) {
			if (!isNoviBuilder && !isIE && !isMobile) {
				plugins.materialParallax.parallax();
			} else {
				for (let i = 0; i < plugins.materialParallax.length; i++) {
					let $parallax = $(plugins.materialParallax[i]);

					$parallax.addClass('parallax-disabled');
					$parallax.css({"background-image": 'url(' + $parallax.data("parallax-img") + ')'});
				}
			}
		}
	});

	// Initialize scripts that require a finished document
	$(function () {
		isNoviBuilder = window.xMode;

		/**
		 * Get tag of passed data
		 * @param {*} data
		 * @return {string}
		 */
		function objectTag(data) {
			return Object.prototype.toString.call(data).slice(8, -1);
		}

		/**
		 * Merging of two objects
		 * @param {Object} source
		 * @param {Object} merged
		 * @return {Object}
		 */
		function merge(source, merged) {
			for (let key in merged) {
				let tag = objectTag(merged[key]);

				if (tag === 'Object') {
					if (typeof (source[key]) !== 'object') source[key] = {};
					source[key] = merge(source[key], merged[key]);
				} else if (tag !== 'Null') {
					source[key] = merged[key];
				}
			}

			return source;
		}

		/**
		 * Strict merging of two objects. Merged only parameters from the original object and with the same data type. Merge only simple data types, arrays and objects.
		 * @param source
		 * @param merged
		 * @return {object}
		 */
		function strictMerge(source, merged) {
			for (let key in source) {
				let
						sTag = objectTag(source[key]),
						mTag = objectTag(merged[key]);

				if (['Object', 'Array', 'Number', 'String', 'Boolean', 'Null', 'Undefined'].indexOf(sTag) > -1) {
					if (sTag === 'Object' && sTag === mTag) {
						source[key] = strictMerge(source[key], merged[key]);
					} else if (mTag !== 'Undefined' && (sTag === 'Undefined' || sTag === 'Null' || sTag === mTag)) {
						source[key] = merged[key];
					}
				}
			}

			return source;
		}

		/**
		 * @desc Sets the actual previous index based on the position of the slide in the markup. Should be the most recent action.
		 * @param {object} swiper - swiper instance
		 */
		function setRealPrevious(swiper) {
			let element = swiper.$wrapperEl[0].children[swiper.activeIndex];
			swiper.realPrevious = Array.prototype.indexOf.call(element.parentNode.children, element);
		}

		/**
		 * @desc Sets slides background images from attribute 'data-slide-bg'
		 * @param {object} swiper - swiper instance
		 */
		function setBackgrounds(swiper) {
			let swipersBg = swiper.el.querySelectorAll('[data-slide-bg]');

			for (let i = 0; i < swipersBg.length; i++) {
				let swiperBg = swipersBg[i];
				swiperBg.style.backgroundImage = 'url(' + swiperBg.getAttribute('data-slide-bg') + ')';
			}
		}

		/**
		 * @desc Animate captions on active slides
		 * @param {object} swiper - swiper instance
		 */
		function initCaptionAnimate(swiper) {
			let
					animate = function (caption) {
						return function () {
							let duration;
							if (duration = caption.getAttribute('data-caption-duration')) caption.style.animationDuration = duration + 'ms';
							caption.classList.remove('not-animated');
							caption.classList.add(caption.getAttribute('data-caption-animate'));
							caption.classList.add('animated');
						};
					},
					initializeAnimation = function (captions) {
						for (let i = 0; i < captions.length; i++) {
							let caption = captions[i];
							caption.classList.remove('animated');
							caption.classList.remove(caption.getAttribute('data-caption-animate'));
							caption.classList.add('not-animated');
						}
					},
					finalizeAnimation = function (captions) {
						for (let i = 0; i < captions.length; i++) {
							let caption = captions[i];
							if (caption.getAttribute('data-caption-delay')) {
								setTimeout(animate(caption), Number(caption.getAttribute('data-caption-delay')));
							} else {
								animate(caption)();
							}
						}
					};

			// Caption parameters
			swiper.params.caption = {
				animationEvent: 'slideChangeTransitionEnd'
			};

			initializeAnimation(swiper.$wrapperEl[0].querySelectorAll('[data-caption-animate]'));
			finalizeAnimation(swiper.$wrapperEl[0].children[swiper.activeIndex].querySelectorAll('[data-caption-animate]'));

			if (swiper.params.caption.animationEvent === 'slideChangeTransitionEnd') {
				swiper.on(swiper.params.caption.animationEvent, function () {
					initializeAnimation(swiper.$wrapperEl[0].children[swiper.previousIndex].querySelectorAll('[data-caption-animate]'));
					finalizeAnimation(swiper.$wrapperEl[0].children[swiper.activeIndex].querySelectorAll('[data-caption-animate]'));
				});
			} else {
				swiper.on('slideChangeTransitionEnd', function () {
					initializeAnimation(swiper.$wrapperEl[0].children[swiper.previousIndex].querySelectorAll('[data-caption-animate]'));
				});

				swiper.on(swiper.params.caption.animationEvent, function () {
					finalizeAnimation(swiper.$wrapperEl[0].children[swiper.activeIndex].querySelectorAll('[data-caption-animate]'));
				});
			}
		}

		/**
		 * @desc Create live search results
		 * @param {object} options
		 */
		function liveSearch(options, handler) {
			$('#' + options.live).removeClass('cleared').html();
			options.current++;
			options.spin.addClass('loading');
			$.get(handler, {
				s:          decodeURI(options.term),
				liveSearch: options.live,
				dataType:   "html",
				liveCount:  options.liveCount,
				filter:     options.filter,
				template:   options.template
			}, function (data) {
				options.processed++;
				let live = $('#' + options.live);
				if ((options.processed === options.current) && !live.hasClass('cleared')) {
					live.find('> #search-results').removeClass('active');
					live.html(data);
					setTimeout(function () {
						live.find('> #search-results').addClass('active');
					}, 50);
				}
				options.spin.parents('.rd-search').find('.input-group-addon').removeClass('loading');
			})
		}

		/**
		 * @desc Attach form validation to elements
		 * @param {object} elements - jQuery object
		 */
		function attachFormValidator(elements) {
			// Custom validator - phone number
			regula.custom({
				name:           'PhoneNumber',
				defaultMessage: 'Invalid phone number format',
				validator:      function () {
					if (this.value === '') return true;
					else return /^(\+\d)?[0-9\-\(\) ]{5,}$/i.test(this.value);
				}
			});

			for (let i = 0; i < elements.length; i++) {
				let o = $(elements[i]), v;
				o.addClass("form-control-has-validation").after("<span class='form-validation'></span>");
				v = o.parent().find(".form-validation");
				if (v.is(":last-child")) o.addClass("form-control-last-child");
			}

			elements.on('input change propertychange blur', function (e) {
				let $this = $(this), results;

				if (e.type !== "blur") if (!$this.parent().hasClass("has-error")) return;
				if ($this.parents('.rd-mailform').hasClass('success')) return;

				if ((results = $this.regula('validate')).length) {
					for (let i = 0; i < results.length; i++) {
						$this.siblings(".form-validation").text(results[i].message).parent().addClass("has-error");
					}
				} else {
					$this.siblings(".form-validation").text("").parent().removeClass("has-error")
				}
			}).regula('bind');

			let regularConstraintsMessages = [
				{
					type:       regula.Constraint.Required,
					newMessage: "The text field is required."
				},
				{
					type:       regula.Constraint.Email,
					newMessage: "The email is not a valid email."
				},
				{
					type:       regula.Constraint.Numeric,
					newMessage: "Only numbers are required"
				},
				{
					type:       regula.Constraint.Selected,
					newMessage: "Please choose an option."
				}
			];


			for (let i = 0; i < regularConstraintsMessages.length; i++) {
				let regularConstraint = regularConstraintsMessages[i];

				regula.override({
					constraintType: regularConstraint.type,
					defaultMessage: regularConstraint.newMessage
				});
			}
		}

		/**
		 * @desc Check if all elements pass validation
		 * @param {object} elements - object of items for validation
		 * @param {object} captcha - captcha object for validation
		 * @return {boolean}
		 */
		function isValidated(elements, captcha) {
			let results, errors = 0;

			if (elements.length) {
				for (let j = 0; j < elements.length; j++) {

					let $input = $(elements[j]);
					if ((results = $input.regula('validate')).length) {
						for (let k = 0; k < results.length; k++) {
							errors++;
							$input.siblings(".form-validation").text(results[k].message).parent().addClass("has-error");
						}
					} else {
						$input.siblings(".form-validation").text("").parent().removeClass("has-error")
					}
				}

				if (captcha) {
					if (captcha.length) {
						return validateReCaptcha(captcha) && errors === 0
					}
				}

				return errors === 0;
			}
			return true;
		}

		/**
		 * @desc Validate google reCaptcha
		 * @param {object} captcha - captcha object for validation
		 * @return {boolean}
		 */
		function validateReCaptcha(captcha) {
			let captchaToken = captcha.find('.g-recaptcha-response').val();

			if (captchaToken.length === 0) {
				captcha
					.siblings('.form-validation')
					.html('Please, prove that you are not robot.')
					.addClass('active');
				captcha
					.closest('.form-wrap')
					.addClass('has-error');

				captcha.on('propertychange', function () {
					let $this = $(this),
						captchaToken = $this.find('.g-recaptcha-response').val();

					if (captchaToken.length > 0) {
						$this
							.closest('.form-wrap')
							.removeClass('has-error');
						$this
							.siblings('.form-validation')
							.removeClass('active')
							.html('');
						$this.off('propertychange');
					}
				});

				return false;
			}

			return true;
		}

		/**
		 * @desc Initialize Google reCaptcha
		 */
		window.onloadCaptchaCallback = function () {
			for (let i = 0; i < plugins.captcha.length; i++) {
				let
					$captcha = $(plugins.captcha[i]),
					resizeHandler = (function () {
						let
							frame = this.querySelector('iframe'),
							inner = this.firstElementChild,
							inner2 = inner.firstElementChild,
							containerRect = null,
							frameRect = null,
							scale = null;

						inner2.style.transform = '';
						inner.style.height = 'auto';
						inner.style.width = 'auto';

						containerRect = this.getBoundingClientRect();
						frameRect = frame.getBoundingClientRect();
						scale = containerRect.width / frameRect.width;

						if (scale < 1) {
							inner2.style.transform = 'scale(' + scale + ')';
							inner.style.height = (frameRect.height * scale) + 'px';
							inner.style.width = (frameRect.width * scale) + 'px';
						}
					}).bind(plugins.captcha[i]);

				grecaptcha.render(
					$captcha.attr('id'),
					{
						sitekey:  $captcha.attr('data-sitekey'),
						size:     $captcha.attr('data-size') ? $captcha.attr('data-size') : 'normal',
						theme:    $captcha.attr('data-theme') ? $captcha.attr('data-theme') : 'light',
						callback: function () {
							$('.recaptcha').trigger('propertychange');
						}
					}
				);

				$captcha.after("<span class='form-validation'></span>");

				if (plugins.captcha[i].hasAttribute('data-auto-size')) {
					resizeHandler();
					window.addEventListener('resize', resizeHandler);
				}
			}
		};

		/**
		 * @desc Initialize Bootstrap tooltip with required placement
		 * @param {string} tooltipPlacement
		 */
		function initBootstrapTooltip(tooltipPlacement) {
			plugins.bootstrapTooltip.tooltip('dispose');

			if (window.innerWidth < 576) {
				plugins.bootstrapTooltip.tooltip({placement: 'bottom'});
			} else {
				plugins.bootstrapTooltip.tooltip({placement: tooltipPlacement});
			}
		}

		/**
		 * @desc Initialize the gallery with set of images
		 * @param {object} itemsToInit - jQuery object
		 * @param {string} [addClass] - additional gallery class
		 */
		function initLightGallery(itemsToInit, addClass) {
			if (!isNoviBuilder) {
				$(itemsToInit).lightGallery({
					thumbnail: $(itemsToInit).attr("data-lg-thumbnail") !== "false",
					selector:  "[data-lightgallery='item']",
					autoplay:  $(itemsToInit).attr("data-lg-autoplay") === "true",
					pause:     parseInt($(itemsToInit).attr("data-lg-autoplay-delay")) || 5000,
					addClass:  addClass,
					mode:      $(itemsToInit).attr("data-lg-animation") || "lg-slide",
					loop:      $(itemsToInit).attr("data-lg-loop") !== "false"
				});
			}
		}

		/**
		 * @desc Initialize the gallery with dynamic addition of images
		 * @param {object} itemsToInit - jQuery object
		 * @param {string} [addClass] - additional gallery class
		 */
		function initDynamicLightGallery(itemsToInit, addClass) {
			if (!isNoviBuilder) {
				$(itemsToInit).on("click", function () {
					$(itemsToInit).lightGallery({
						thumbnail: $(itemsToInit).attr("data-lg-thumbnail") !== "false",
						selector:  "[data-lightgallery='item']",
						autoplay:  $(itemsToInit).attr("data-lg-autoplay") === "true",
						pause:     parseInt($(itemsToInit).attr("data-lg-autoplay-delay")) || 5000,
						addClass:  addClass,
						mode:      $(itemsToInit).attr("data-lg-animation") || "lg-slide",
						loop:      $(itemsToInit).attr("data-lg-loop") !== "false",
						dynamic:   true,
						dynamicEl: JSON.parse($(itemsToInit).attr("data-lg-dynamic-elements")) || []
					});
				});
			}
		}

		/**
		 * @desc Initialize the gallery with one image
		 * @param {object} itemToInit - jQuery object
		 * @param {string} [addClass] - additional gallery class
		 */
		function initLightGalleryItem(itemToInit, addClass) {
			if (!isNoviBuilder) {
				$(itemToInit).lightGallery({
					selector:            "this",
					addClass:            addClass,
					counter:             false,
					youtubePlayerParams: {
						modestbranding: 1,
						showinfo:       0,
						rel:            0,
						controls:       0
					},
					vimeoPlayerParams:   {
						byline:   0,
						portrait: 0
					}
				});
			}
		}

		/**
		 * @desc Google map function for getting latitude and longitude
		 */
		function getLatLngObject(str, marker, map, callback) {
			let coordinates = {};
			try {
				coordinates = JSON.parse(str);
				callback(new google.maps.LatLng(
						coordinates.lat,
						coordinates.lng
				), marker, map)
			} catch (e) {
				map.geocoder.geocode({'address': str}, function (results, status) {
					if (status === google.maps.GeocoderStatus.OK) {
						let latitude = results[0].geometry.location.lat();
						let longitude = results[0].geometry.location.lng();

						callback(new google.maps.LatLng(
								parseFloat(latitude),
								parseFloat(longitude)
						), marker, map)
					}
				})
			}
		}

		/**
		 * @desc Initialize Google maps
		 */
		function initMaps() {
			let key;

			for (let i = 0; i < plugins.maps.length; i++) {
				if (plugins.maps[i].hasAttribute("data-key")) {
					key = plugins.maps[i].getAttribute("data-key");
					break;
				}
			}
			key = 'AIzaSyBHij4b1Vyck1QAuGQmmyryBYVutjcuoRA';

			$.getScript('//maps.google.com/maps/api/js?' + (key ? 'key=' + key + '&' : '') + 'libraries=geometry,places&v=quarterly', function () {
				let geocoder = new google.maps.Geocoder;
				for (let i = 0; i < plugins.maps.length; i++) {
					let zoom = parseInt(plugins.maps[i].getAttribute("data-zoom"), 10) || 11;
					let styles = plugins.maps[i].hasAttribute('data-styles') ? JSON.parse(plugins.maps[i].getAttribute("data-styles")) : [];
					let center = plugins.maps[i].getAttribute("data-center") || "New York";

					// Initialize map
					let map = new google.maps.Map(plugins.maps[i].querySelectorAll(".google-map")[0], {
						zoom:        zoom,
						styles:      styles,
						scrollwheel: false,
						center:      {
							lat: 0,
							lng: 0
						}
					});

					// Add map object to map node
					plugins.maps[i].map = map;
					plugins.maps[i].geocoder = geocoder;
					plugins.maps[i].keySupported = true;
					plugins.maps[i].google = google;

					// Get Center coordinates from attribute
					getLatLngObject(center, null, plugins.maps[i], function (location, markerElement, mapElement) {
						mapElement.map.setCenter(location);
					});

					// Add markers from google-map-markers array
					let markerItems = plugins.maps[i].querySelectorAll(".google-map-markers li");

					if (markerItems.length) {
						let markers = [];
						for (let j = 0; j < markerItems.length; j++) {
							let markerElement = markerItems[j];
							getLatLngObject(markerElement.getAttribute("data-location"), markerElement, plugins.maps[i], function (location, markerElement, mapElement) {
								let icon = markerElement.getAttribute("data-icon") || mapElement.getAttribute("data-icon");
								let activeIcon = markerElement.getAttribute("data-icon-active") || mapElement.getAttribute("data-icon-active");
								let info = markerElement.getAttribute("data-description") || "";
								let infoWindow = new google.maps.InfoWindow({
									content: info
								});
								markerElement.infoWindow = infoWindow;
								let markerData = {
									position: location,
									map:      mapElement.map
								}
								if (icon) {
									markerData.icon = icon;
								}
								let marker = new google.maps.Marker(markerData);
								markerElement.gmarker = marker;
								markers.push({
									markerElement: markerElement,
									infoWindow:    infoWindow
								});
								marker.isActive = false;
								// Handle infoWindow close click
								google.maps.event.addListener(infoWindow, 'closeclick', (function (markerElement, mapElement) {
									let markerIcon = null;
									markerElement.gmarker.isActive = false;
									markerIcon = markerElement.getAttribute("data-icon") || mapElement.getAttribute("data-icon");
									markerElement.gmarker.setIcon(markerIcon);
								}).bind(this, markerElement, mapElement));


								// Set marker active on Click and open infoWindow
								google.maps.event.addListener(marker, 'click', (function (markerElement, mapElement) {
									let markerIcon;
									if (markerElement.infoWindow.getContent().length === 0) return;
									let gMarker, currentMarker = markerElement.gmarker, currentInfoWindow;
									for (let k = 0; k < markers.length; k++) {
										if (markers[k].markerElement === markerElement) {
											currentInfoWindow = markers[k].infoWindow;
										}
										gMarker = markers[k].markerElement.gmarker;
										if (gMarker.isActive && markers[k].markerElement !== markerElement) {
											gMarker.isActive = false;
											markerIcon = markers[k].markerElement.getAttribute("data-icon") || mapElement.getAttribute("data-icon")
											gMarker.setIcon(markerIcon);
											markers[k].infoWindow.close();
										}
									}

									currentMarker.isActive = !currentMarker.isActive;
									if (currentMarker.isActive) {
										if (markerIcon = markerElement.getAttribute("data-icon-active") || mapElement.getAttribute("data-icon-active")) {
											currentMarker.setIcon(markerIcon);
										}

										currentInfoWindow.open(map, marker);
									} else {
										if (markerIcon = markerElement.getAttribute("data-icon") || mapElement.getAttribute("data-icon")) {
											currentMarker.setIcon(markerIcon);
										}
										currentInfoWindow.close();
									}
								}).bind(this, markerElement, mapElement))
							})
						}
					}
				}
			});
		}

		// Google ReCaptcha
		if (plugins.captcha.length) {
			$.getScript("//www.google.com/recaptcha/api.js?onload=onloadCaptchaCallback&render=explicit&hl=en");
		}

		// Additional class on html if mac os.
		if (navigator.platform.match(/(Mac)/i)) {
			$html.addClass("mac-os");
		}

		// Adds some loosing functionality to IE browsers (IE Polyfills)
		if (isIE) {
			if (isIE === 12) $html.addClass("ie-edge");
			if (isIE === 11) $html.addClass("ie-11");
			if (isIE < 10) $html.addClass("lt-ie-10");
			if (isIE < 11) $html.addClass("ie-10");
		}

		// Bootstrap Tooltips
		if (plugins.bootstrapTooltip.length) {
			let tooltipPlacement = plugins.bootstrapTooltip.attr('data-bs-placement');
			initBootstrapTooltip(tooltipPlacement);

			$window.on('resize orientationchange', function () {
				initBootstrapTooltip(tooltipPlacement);
			})
		}

		// Bootstrap Modal
		if (plugins.bootstrapModal.length) {
			for (let i = 0; i < plugins.bootstrapModal.length; i++) {
				let modalItem = $(plugins.bootstrapModal[i]);

				modalItem.on('hidden.bs.modal', $.proxy(function () {
					let activeModal = $(this),
							rdVideoInside = activeModal.find('video'),
							youTubeVideoInside = activeModal.find('iframe');

					if (rdVideoInside.length) {
						rdVideoInside[0].pause();
					}

					if (youTubeVideoInside.length) {
						let videoUrl = youTubeVideoInside.attr('src');

						youTubeVideoInside
						.attr('src', '')
						.attr('src', videoUrl);
					}
				}, modalItem))
			}
		}

		// Popovers
		if (plugins.popover.length) {
			if (window.innerWidth < 767) {
				plugins.popover.attr('data-bs-placement', 'bottom');
				plugins.popover.popover();
			} else {
				plugins.popover.popover();
			}
		}

		// Bootstrap Buttons
		if (plugins.statefulButton.length) {
			$(plugins.statefulButton).on('click', function () {
				let statefulButtonLoading = $(this).button('loading');

				setTimeout(function () {
					statefulButtonLoading.button('reset')
				}, 2000);
			})
		}

		// Bootstrap Tabs
		if (plugins.bootstrapTabs.length) {
			for (let i = 0; i < plugins.bootstrapTabs.length; i++) {
				let bootstrapTab = $(plugins.bootstrapTabs[i]);

				//If have slick carousel inside tab - resize slick carousel on click
				if (bootstrapTab.find('.slick-slider').length) {
					bootstrapTab.find('.tabs-custom-list > li > a').on('click', $.proxy(function () {
						let $this = $(this);
						let setTimeOutTime = isNoviBuilder ? 1500 : 300;

						setTimeout(function () {
							$this.find('.tab-content .tab-pane.active .slick-slider').slick('setPosition');
						}, setTimeOutTime);
					}, bootstrapTab));
				}

				let tabs = plugins.bootstrapTabs[i].querySelectorAll('.nav li a');

				for (var t = 0; t < tabs.length; t++) {
					var tab = tabs[t],
							target = document.querySelector(tabs[t].getAttribute('href'));

					tab.classList.remove('active', 'show');
					target.classList.remove('active', 'show');

					if (t === 0) {
						tab.classList.add('active', 'show');
						target.classList.add('active', 'show');
					}
				}
			}
		}

		// Bootstrap Card
		if (plugins.bootstrapCards.length) {
			for (let i = 0; i < plugins.bootstrapCards.length; i++) {
				let bootstrapCard = plugins.bootstrapCards[i];

				let cardHeads = bootstrapCard.querySelectorAll('.card-header a');

				for (let t = 0; t < cardHeads.length; t++) {
					let cardHead = cardHeads[t];

					cardHead.classList.add('collapsed');
					cardHead.setAttribute('aria-expanded', 'false')

					if (t === 0) {
						cardHead.classList.remove('collapsed');
						cardHead.setAttribute('aria-expanded', 'true')
					}
				}
			}
		}

		// Copyright Year (Evaluates correct copyright year)
		if (plugins.copyrightYear.length) {
			plugins.copyrightYear.text(initialDate.getFullYear());
		}

		// Google maps
		if (plugins.maps.length) {
			lazyInit(plugins.maps, initMaps);
		}

		// Add custom styling options for input[type="radio"]
		if (plugins.radio.length) {
			for (let i = 0; i < plugins.radio.length; i++) {
				$(plugins.radio[i]).addClass("radio-custom").after("<span class='radio-custom-dummy'></span>")
			}
		}

		// Add custom styling options for input[type="checkbox"]
		if (plugins.checkbox.length) {
			for (let i = 0; i < plugins.checkbox.length; i++) {
				$(plugins.checkbox[i]).addClass("checkbox-custom").after("<span class='checkbox-custom-dummy'></span>")
			}
		}

		// UI To Top
		if (isDesktop && !isNoviBuilder) {
			$().UItoTop({
				easingType:     'easeOutQuad',
				containerClass: 'ui-to-top mdi-chevron-up'
			});
		}

		// RD Navbar
		if (plugins.rdNavbar.length) {
			plugins.rdNavbar.forEach(function (node) {
				let
						backButtons = node.querySelectorAll('.navbar-navigation-back-btn'),
						params = parseJSON(node.getAttribute('data-rd-navbar')),
						defaults = {
							stickUpClone:  false,
							anchorNav:     true,
							autoHeight:    false,
							stickUpOffset: '1px',
							responsive:    {
								0:    {
									layout:       'rd-navbar-fixed',
									deviceLayout: 'rd-navbar-fixed',
									focusOnHover: 'ontouchstart' in window,
									stickUp:      false
								},
								992:  {
									layout:       'rd-navbar-fixed',
									deviceLayout: 'rd-navbar-fixed',
									focusOnHover: 'ontouchstart' in window,
									stickUp:      false
								},
								1200: {
									layout:        'rd-navbar-fullwidth',
									deviceLayout:  'rd-navbar-fullwidth',
									stickUp:       true,
									stickUpOffset: '1px'
								}
							},
							callbacks:     {
								onStuck:          function () {
									document.documentElement.classList.add('rd-navbar-stuck');
								},
								onUnstuck:        function () {
									document.documentElement.classList.remove('rd-navbar-stuck');
								},
								onDropdownToggle: function () {
									if (this.classList.contains('opened')) {
										this.parentElement.classList.add('overlaid');
									} else {
										this.parentElement.classList.remove('overlaid');
									}
								},
								onDropdownClose:  function () {
									this.parentElement.classList.remove('overlaid');
								}
							}
						},
						xMode = {
							stickUpClone: false,
							anchorNav:    false,
							responsive:   {
								0:    {
									stickUp:      false,
									stickUpClone: false
								},
								992:  {
									stickUp:      false,
									stickUpClone: false
								},
								1200: {
									stickUp:      false,
									stickUpClone: false
								}
							},
							callbacks:    {
								onDropdownOver: function () {
									return false;
								}
							}
						},
						navbar = node.RDNavbar = new RDNavbar(node, Util.merge(window.xMode ? [defaults, params, xMode] : [defaults, params]));

				if (backButtons.length) {
					backButtons.forEach(function (btn) {
						btn.addEventListener('click', function () {
							let
									submenu = this.closest('.rd-navbar-submenu'),
									parentmenu = submenu.parentElement;

							navbar.dropdownToggle.call(submenu, navbar);
						});
					});
				}
			})
		}

		// RD Search
		if (plugins.search.length || plugins.searchResults) {
			let handler = "bat/rd-search.php";
			let defaultTemplate = '<h5 class="search-title"><a target="_top" href="#{href}" class="search-link">#{title}</a></h5>' +
					'<p>...#{token}...</p>' +
					'<p class="match"><em>Terms matched: #{count} - URL: #{href}</em></p>';
			let defaultFilter = '*.html';

			if (plugins.search.length) {
				for (let i = 0; i < plugins.search.length; i++) {
					let searchItem = $(plugins.search[i]),
							options = {
								element:   searchItem,
								filter:    (searchItem.attr('data-search-filter')) ? searchItem.attr('data-search-filter') : defaultFilter,
								template:  (searchItem.attr('data-search-template')) ? searchItem.attr('data-search-template') : defaultTemplate,
								live:      (searchItem.attr('data-search-live')) ? searchItem.attr('data-search-live') : false,
								liveCount: (searchItem.attr('data-search-live-count')) ? parseInt(searchItem.attr('data-search-live'), 10) : 4,
								current:   0,
								processed: 0,
								timer:     {}
							};

					let $toggle = $('.rd-navbar-search-toggle');
					if ($toggle.length) {
						$toggle.on('click', (function (searchItem) {
							return function () {
								if (!($(this).hasClass('active'))) {
									searchItem.find('input').val('').trigger('propertychange');
								}
							}
						})(searchItem));
					}

					if (options.live) {
						let clearHandler = false;

						searchItem.find('input').on("input propertychange", $.proxy(function () {
							this.term = this.element.find('input').val().trim();
							this.spin = this.element.find('.input-group-addon');

							clearTimeout(this.timer);

							if (this.term.length > 2) {
								this.timer = setTimeout(liveSearch(this, handler), 200);

								if (clearHandler === false) {
									clearHandler = true;

									$body.on("click", function (e) {
										if ($(e.toElement).parents('.rd-search').length === 0) {
											$('#rd-search-results-live').addClass('cleared').html('');
										}
									})
								}

							} else if (this.term.length === 0) {
								$('#' + this.live).addClass('cleared').html('');
							}
						}, options, this));
					}

					searchItem.submit($.proxy(function () {
						$('<input />').attr('type', 'hidden')
						.attr('name', "filter")
						.attr('value', this.filter)
						.appendTo(this.element);
						return true;
					}, options, this))
				}
			}

			if (plugins.searchResults.length) {
				let regExp = /\?.*s=([^&]+)\&filter=([^&]+)/g;
				let match = regExp.exec(location.search);

				if (match !== null) {
					$.get(handler, {
						s:        decodeURI(match[1]),
						dataType: "html",
						filter:   match[2],
						template: defaultTemplate,
						live:     ''
					}, function (data) {
						plugins.searchResults.html(data);
					})
				}
			}
		}

		// Add class in viewport
		if (plugins.viewAnimate.length) {
			for (let i = 0; i < plugins.viewAnimate.length; i++) {
				let $view = $(plugins.viewAnimate[i]).not('.active');
				$document.on("scroll", $.proxy(function () {
					if (isScrolledIntoView(this)) {
						this.addClass("active");
					}
				}, $view))
				.trigger("scroll");
			}
		}

		/**
		 * @desc Calculate the height of swiper slider basing on data attr
		 * @param {object} object - slider jQuery object
		 * @param {string} attr - attribute name
		 * @return {number} slider height
		 */
		function getSwiperHeight(object, attr) {
			var val = object.attr("data-" + attr),
				dim;

			if (!val) {
				return undefined;
			}

			dim = val.match(/(px)|(%)|(vh)|(vw)$/i);

			if (dim.length) {
				switch (dim[0]) {
					case "px":
						return parseFloat(val);
					case "vh":
						return $window.height() * (parseFloat(val) / 100);
					case "vw":
						return $window.width() * (parseFloat(val) / 100);
					case "%":
						return object.width() * (parseFloat(val) / 100);
				}
			} else {
				return undefined;
			}
		}

		// Swiper
		if (plugins.swiper.length) {
			plugins.swiper.forEach(function (node) {

				// Pagination decimal leading zero
				function pad(number, length) {
					let str = '' + number;
					while (str.length < length) {
						str = '0' + str;
					}

					return str;
				}

				/**
				 * Update of secondary numeric pagination
				 * @this {object}  - swiper instance
				 */
				function updSwiperNumericPagination() {
					if (this.el.querySelector('.swiper-counter')) {
						this.el.querySelector('.swiper-counter')
								.innerHTML = '<span class="swiper-counter-count">' + formatIndex((this.realIndex + 1)) + '</span><span class="swiper-counter-divider"></span><span class="swiper-counter-total">' + formatIndex((this.slides.length)) + '</span>';
					}
				}

				function formatIndex(index) {
					return index < 10 ? '0' + index : index;
				}

				let
						slides = node.querySelectorAll('.swiper-slide[data-slide-bg]'),
						animate = node.querySelectorAll('.swiper-wrapper [data-caption-animate]'),
						videos = node.querySelectorAll('.swiper-wrapper video'),
						pagOrdered = node.querySelector('.swiper-pagination[data-pagination-ordered]'),
						pagProgress = node.querySelector('.swiper-pagination[data-pagination-progress]'),
						progress,
						timer,
						params = merge({
							speed:      500,
							loop:       true,
							autoHeight: false,
							pagination: {
								el:           '.swiper-pagination',
								clickable:    true,
								renderBullet: function (index, className) {
									return (
											'<span class="' + className + '">' +
											(pagOrdered ? pad((index + 1), 2) : '') +
											(pagProgress ?
													'<svg class="swiper-progress" x="0px" y="0px" width="100" height="100" viewbox="0 0 100 100">' +
													'<circle class="swiper-progress-bg" cx="50" cy="50" r="50"></circle>' +
													'<circle class="swiper-progress-dot" cx="50" cy="50" r="14"></circle>' +
													'<circle class="clipped" cx="50" cy="50" r="48"></circle>' +
													'</svg>' : '') +
											'</span>'
									)
								}
							},
							navigation: {
								nextEl: '.swiper-button-next',
								prevEl: '.swiper-button-prev'
							},
							scrollbar:  {
								el: '.swiper-scrollbar'
							},
							autoplay:   {
								delay:                5000,
								disableOnInteraction: false
							},
							on:         {

								init:             updSwiperNumericPagination,
								slideChange:      updSwiperNumericPagination,
								paginationUpdate: function () {
									if (pagProgress) {
										let
												bullets = pagProgress.querySelectorAll('.swiper-pagination-bullet'),
												bulletActive = pagProgress.querySelector('.swiper-pagination-bullet-active .swiper-progress');

										progress = new aProgressCircle({node: bulletActive});
										timer = new VirtualTimer({
											onTick: function () {
												progress.render(this.progress / this.duration * 360);
											}
										});

										timer.reset();
										timer.duration = this.originalParams.autoplay.delay - 100;
										timer.start();

										bullets.forEach(function (bullet) {
											bullet.addEventListener('click', function () {
												timer.stop();
											})
										});
									}
								},
								sliderMove:       function () {
									timer.stop();
									timer.reset();
								}
							}
						}, parseJSON(node.getAttribute('data-swiper')));

				// Specific params for Novi builder
				if (window.xMode) {
					params = merge(params, {
						autoplay:      false,
						loop:          false,
						simulateTouch: false
					});
				}

				// Set background image for slides with `data-slide-bg` attribute
				slides.forEach(function (slide) {
					slide.style.backgroundImage = 'url(' + slide.getAttribute('data-slide-bg') + ')';
				});

				// Animate captions with `data-caption-animate` attribute
				if (animate.length) {
					if (!params.on) params.on = {};
					params.on.transitionEnd = function () {
						let
								active = this.wrapperEl.children[this.activeIndex],
								prev = this.wrapperEl.children[this.previousIndex];

						active.querySelectorAll('[data-caption-animate]').forEach(function (node) {
							node.classList.add(node.getAttribute('data-caption-animate'));
							node.classList.add('animated');
						});

						prev.querySelectorAll('[data-caption-animate]').forEach(function (node) {
							node.classList.remove(node.getAttribute('data-caption-animate'));
							node.classList.remove('animated');
						})
					}
				}

				// Stop video on inactive slides
				if (videos.length) {
					if (!params.on) params.on = {};
					params.on.transitionStart = function () {
						let
								active = this.wrapperEl.children[this.activeIndex],
								prev = this.wrapperEl.children[this.previousIndex];

						active.querySelectorAll('video').forEach(function (video) {
							if (video.paused) video.play();
						});
						prev.querySelectorAll('video').forEach(function (video) {
							if (!video.paused) video.pause();
						})
					}
				}

				// Initialization if there are related swipers
				if (params.thumbs && params.thumbs.swiper) {
					let target = document.querySelector(params.thumbs.swiper);

					if (!target.swiper) {
						target.addEventListener('swiper:ready', function () {
							params.thumbs.swiper = target.swiper;
							new Swiper(node, params);
							node.dispatchEvent(new CustomEvent('swiper:ready'));
						});
					} else {
						params.thumbs.swiper = target.swiper;
						new Swiper(node, params);
						node.dispatchEvent(new CustomEvent('swiper:ready'));
					}
				} else {
					new Swiper(node, params);

					$window.on("resize", () => {
						let $node = $(node);
						let mh = getSwiperHeight($node, "min-height");
						let	h = getSwiperHeight($node, "height");
						if (h) $node.css("height", mh ? mh > h ? mh : h : h);
					}).trigger("resize");

					node.dispatchEvent(new CustomEvent('swiper:ready'));
				}
			});
		}

		// Owl carousel
		if (plugins.owl.length) {
			plugins.owl.forEach( function ( node ) {
				let
						params = parseJSON( node.getAttribute( 'data-owl' ) ),
						defaults = {
							items: 1,
							margin: 30,
							loop: true,
							mouseDrag: true,
							stagePadding: 0,
							nav: false,
							navText: [],
							dots: false,
							autoplay: true,
							autoplayHoverPause: true
						},
						xMode = {
							autoplay: false,
							loop: false,
							mouseDrag: false
						};

				node.owl = $( node );

				let tmp = Util.merge( window.xMode ? [ defaults, params, xMode ] : [ defaults, params ] );

				$( node ).owlCarousel( tmp );
			});
		}

		// WOW
		if ($html.hasClass("wow-animation") && plugins.wow.length && !isNoviBuilder && isDesktop) {
			new WOW().init();
		}

		// RD Input Label
		if (plugins.rdInputLabel.length) {
			plugins.rdInputLabel.RDInputLabel();
		}

		// Regula
		if (plugins.regula.length) {
			attachFormValidator(plugins.regula);
		}

		// MailChimp Ajax subscription
		if (plugins.mailchimp.length) {
			for (let i = 0; i < plugins.mailchimp.length; i++) {
				let $mailchimpItem = $(plugins.mailchimp[i]),
					$email = $mailchimpItem.find('input[type="email"]');

				// Required by MailChimp
				$mailchimpItem.attr('novalidate', 'true');
				$email.attr('name', 'EMAIL');

				$mailchimpItem.on('submit', $.proxy(function ($email, event) {
					event.preventDefault();

					let $this = this;

					let data = {},
						url = $this.attr('action').replace('/post?', '/post-json?').concat('&c=?'),
						dataArray = $this.serializeArray(),
						$output = $("#" + $this.attr("data-form-output"));

					for (i = 0; i < dataArray.length; i++) {
						data[dataArray[i].name] = dataArray[i].value;
					}

					$.ajax({
						data:       data,
						url:        url,
						dataType:   'jsonp',
						error:      function (resp, text) {
							$output.html('Server error: ' + text);

							setTimeout(function () {
								$output.removeClass("active");
							}, 4000);
						},
						success:    function (resp) {
							$output.html(resp.msg).addClass('active');
							$email[0].value = '';
							let $label = $('[for="' + $email.attr('id') + '"]');
							if ($label.length) $label.removeClass('focus not-empty');

							setTimeout(function () {
								$output.removeClass("active");
							}, 6000);
						},
						beforeSend: function (data) {
							let isNoviBuilder = window.xMode;

							let isValidated = (function () {
								let results, errors = 0;
								let elements = $this.find('[data-constraints]');
								let captcha = null;
								if (elements.length) {
									for (let j = 0; j < elements.length; j++) {

										let $input = $(elements[j]);
										if ((results = $input.regula('validate')).length) {
											for (let k = 0; k < results.length; k++) {
												errors++;
												$input.siblings(".form-validation").text(results[k].message).parent().addClass("has-error");
											}
										} else {
											$input.siblings(".form-validation").text("").parent().removeClass("has-error")
										}
									}

									if (captcha) {
										if (captcha.length) {
											return validateReCaptcha(captcha) && errors === 0
										}
									}

									return errors === 0;
								}
								return true;
							})();

							// Stop request if builder or inputs are invalide
							if (isNoviBuilder || !isValidated)
								return false;

							$output.html('Submitting...').addClass('active');
						}
					});

					return false;
				}, $mailchimpItem, $email));
			}
		}

		// Campaign Monitor ajax subscription
		if (plugins.campaignMonitor.length) {
			for (let i = 0; i < plugins.campaignMonitor.length; i++) {
				let $campaignItem = $(plugins.campaignMonitor[i]);

				$campaignItem.on('submit', $.proxy(function (e) {
					let data = {},
							url = this.attr('action'),
							dataArray = this.serializeArray(),
							$output = $("#" + plugins.campaignMonitor.attr("data-form-output")),
							$this = $(this);

					for (i = 0; i < dataArray.length; i++) {
						data[dataArray[i].name] = dataArray[i].value;
					}

					$.ajax({
						data:       data,
						url:        url,
						dataType:   'jsonp',
						error:      function (resp, text) {
							$output.html('Server error: ' + text);

							setTimeout(function () {
								$output.removeClass("active");
							}, 4000);
						},
						success:    function (resp) {
							$output.html(resp.Message).addClass('active');

							setTimeout(function () {
								$output.removeClass("active");
							}, 6000);
						},
						beforeSend: function (data) {
							// Stop request if builder or inputs are invalide
							if (isNoviBuilder || !isValidated($this.find('[data-constraints]')))
								return false;

							$output.html('Submitting...').addClass('active');
						}
					});

					// Clear inputs after submit
					let inputs = $this[0].getElementsByTagName('input');
					for (let i = 0; i < inputs.length; i++) {
						inputs[i].value = '';
						let label = document.querySelector('[for="' + inputs[i].getAttribute('id') + '"]');
						if (label) label.classList.remove('focus', 'not-empty');
					}

					return false;
				}, $campaignItem));
			}
		}

		// RD Mailform
		if (plugins.rdMailForm.length) {
			let i, j, k,
				msg = {
					'MF000': 'Successfully sent!',
					'MF001': 'Recipients are not set!',
					'MF002': 'Form will not work locally!',
					'MF003': 'Please, define email field in your form!',
					'MF004': 'Please, define type of your form!',
					'MF254': 'Something went wrong with PHPMailer!',
					'MF255': 'Aw, snap! Something went wrong.'
				};

			for (i = 0; i < plugins.rdMailForm.length; i++) {
				let $form = $(plugins.rdMailForm[i]),
					formHasCaptcha = false;

				$form.attr('novalidate', 'novalidate').ajaxForm({
					data:         {
						"form-type": $form.attr("data-form-type") || "contact",
						"counter":   i
					},
					beforeSubmit: function (arr, $form, options) {
						if (isNoviBuilder)
							return;

						let form = $(plugins.rdMailForm[this.extraData.counter]),
							inputs = form.find("[data-constraints]"),
							output = $("#" + form.attr("data-form-output")),
							captcha = form.find('.recaptcha'),
							captchaFlag = true;

						output.removeClass("active error success");

						if (isValidated(inputs, captcha)) {

							// veify reCaptcha
							if (captcha.length) {
								let captchaToken = captcha.find('.g-recaptcha-response').val(),
									captchaMsg = {
										'CPT001': 'Please, setup you "site key" and "secret key" of reCaptcha',
										'CPT002': 'Something wrong with google reCaptcha'
									};

								formHasCaptcha = true;

								$.ajax({
									method: "POST",
									url:    "bat/reCaptcha.php",
									data:   {'g-recaptcha-response': captchaToken},
									async:  false
								})
									.done(function (responceCode) {
										if (responceCode !== 'CPT000') {
											if (output.hasClass("snackbars")) {
												output.html('<p><span class="icon text-middle mdi mdi-check icon-xxs"></span><span>' + captchaMsg[responceCode] + '</span></p>')

												setTimeout(function () {
													output.removeClass("active");
												}, 3500);

												captchaFlag = false;
											} else {
												output.html(captchaMsg[responceCode]);
											}

											output.addClass("active");
										}
									});
							}

							if (!captchaFlag) {
								return false;
							}

							form.addClass('form-in-process');

							if (output.hasClass("snackbars")) {
								output.html('<p><span class="icon text-middle fa fa-circle-o-notch fa-spin icon-xxs"></span><span>Sending</span></p>');
								output.addClass("active");
							}
						} else {
							return false;
						}
					},
					error:        function (result) {
						if (isNoviBuilder)
							return;

						let output = $("#" + $(plugins.rdMailForm[this.extraData.counter]).attr("data-form-output")),
							form = $(plugins.rdMailForm[this.extraData.counter]);

						output.text(msg[result]);
						form.removeClass('form-in-process');

						if (formHasCaptcha) {
							grecaptcha.reset();
							window.dispatchEvent(new Event('resize'));
						}
					},
					success:      function (result) {
						if (isNoviBuilder)
							return;

						let form = $(plugins.rdMailForm[this.extraData.counter]),
							output = $("#" + form.attr("data-form-output")),
							select = form.find('select');

						form
							.addClass('success')
							.removeClass('form-in-process');

						if (formHasCaptcha) {
							grecaptcha.reset();
							window.dispatchEvent(new Event('resize'));
						}

						result = result.length === 5 ? result : 'MF255';
						output.text(msg[result]);

						if (result === "MF000") {
							if (output.hasClass("snackbars")) {
								output.html('<p><span class="icon text-middle mdi mdi-check icon-xxs"></span><span>' + msg[result] + '</span></p>');
							} else {
								output.addClass("active success");
							}
						} else {
							if (output.hasClass("snackbars")) {
								output.html(' <p class="snackbars-left"><span class="icon icon-xxs mdi mdi-alert-outline text-middle"></span><span>' + msg[result] + '</span></p>');
							} else {
								output.addClass("active error");
							}
						}

						form.clearForm();

						if (select.length) {
							select.val(null).trigger('change');
						}

						form.find('input, textarea').trigger('blur');

						setTimeout(function () {
							output.removeClass("active error success");
							form.removeClass('success');
						}, 3500);
					}
				});
			}
		}

		// lightGallery
		if (plugins.lightGallery.length) {
			for (let i = 0; i < plugins.lightGallery.length; i++) {
				initLightGallery(plugins.lightGallery[i]);
			}
		}

		// lightGallery item
		if (plugins.lightGalleryItem.length) {
			// Filter carousel items
			let notCarouselItems = [];

			for (let z = 0; z < plugins.lightGalleryItem.length; z++) {
				if (!$(plugins.lightGalleryItem[z]).parents('.owl-carousel').length &&
						!$(plugins.lightGalleryItem[z]).parents('.swiper-slider').length &&
						!$(plugins.lightGalleryItem[z]).parents('.slick-slider').length) {
					notCarouselItems.push(plugins.lightGalleryItem[z]);
				}
			}

			plugins.lightGalleryItem = notCarouselItems;

			for (let i = 0; i < plugins.lightGalleryItem.length; i++) {
				initLightGalleryItem(plugins.lightGalleryItem[i]);
			}
		}

		// Dynamic lightGallery
		if (plugins.lightDynamicGalleryItem.length) {
			for (let i = 0; i < plugins.lightDynamicGalleryItem.length; i++) {
				initDynamicLightGallery(plugins.lightDynamicGalleryItem[i]);
			}
		}

		// Custom Toggles
		if (plugins.customToggle.length) {
			for (let i = 0; i < plugins.customToggle.length; i++) {
				let $this = $(plugins.customToggle[i]);

				$this.on('click', $.proxy(function (event) {
					event.preventDefault();

					let $ctx = $(this);
					$($ctx.attr('data-custom-toggle')).add(this).toggleClass('active');
				}, $this));

				if ($this.attr("data-custom-toggle-hide-on-blur") === "true") {
					$body.on("click", $this, function (e) {
						if (e.target !== e.data[0]
								&& $(e.data.attr('data-custom-toggle')).find($(e.target)).length
								&& e.data.find($(e.target)).length === 0) {
							$(e.data.attr('data-custom-toggle')).add(e.data[0]).removeClass('active');
						}
					})
				}

				if ($this.attr("data-custom-toggle-disable-on-blur") === "true") {
					$body.on("click", $this, function (e) {
						if (e.target !== e.data[0] && $(e.data.attr('data-custom-toggle')).find($(e.target)).length === 0 && e.data.find($(e.target)).length === 0) {
							$(e.data.attr('data-custom-toggle')).add(e.data[0]).removeClass('active');
						}
					})
				}
			}
		}

		// Countdown
		if (plugins.countdown.length) {
			for (let i = 0; i < plugins.countdown.length; i++) {
				let
					node = plugins.countdown[i],
					countdown = aCountdown({
						node:  node,
						from:  node.getAttribute('data-from'),
						to:    node.getAttribute('data-to'),
						count: node.getAttribute('data-count'),
						tick:  100,
					});
			}
		}

		// Accordion
		if (plugins.accordion.length) {
			plugins.accordion.forEach( function ( node ) {
				let
						items = node.querySelectorAll( '.accordion-item' ),
						click = device.ios() ? 'touchstart' : 'click';

				items.forEach( function ( item ) {
					let
							head = item.querySelector( '.accordion-head' ),
							body = item.querySelector( '.accordion-body' );

					MultiSwitch({
						node: head,
						targets: [ item, body ],
						isolate: node.querySelectorAll( '.accordion-head' ),
						state: item.classList.contains( 'active' ),
						event: click,
					});

					if ( !body.multiSwitchTarget.groups.active.state ) body.style.display = 'none';

					body.addEventListener( 'switch:active', function () {
						let $this = $( this );

						if ( this.multiSwitchTarget.groups.active.state ) {
							$this.stop().slideDown( 300 );
						} else {
							$this.stop().slideUp( 300 );
						}
					});
				});
			});
		}

		// Multiswitch
		if (plugins.multiswitch.length) {
			let click = device.ios() ? 'touchstart' : 'click';

			plugins.multiswitch.forEach( function ( node ) {
				if ( node.tagName === 'A' ) {
					node.addEventListener( click, function ( event ) {
						event.preventDefault();
					});
				}

				MultiSwitch( Object.assign( {
					node: node,
					event: click,
				}, parseJSON( node.getAttribute( 'data-multi-switch' ) ) ) );
			});
		}

		// Image Hover
		if (plugins.imageHover.length) {
			let hoverEffect = function(opts) {
				var vertex = `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
    `;

				var fragment = `
        varying vec2 vUv;

        uniform sampler2D texture;
        uniform sampler2D texture2;
        uniform sampler2D disp;

        // uniform float time;
        // uniform float _rot;
        uniform float dispFactor;
        uniform float effectFactor;

        // vec2 rotate(vec2 v, float a) {
        //  float s = sin(a);
        //  float c = cos(a);
        //  mat2 m = mat2(c, -s, s, c);
        //  return m * v;
        // }

        void main() {

            vec2 uv = vUv;

            // uv -= 0.5;
            // vec2 rotUV = rotate(uv, _rot);
            // uv += 0.5;

            vec4 disp = texture2D(disp, uv);

            vec2 distortedPosition = vec2(uv.x + dispFactor * (disp.r*effectFactor), uv.y);
            vec2 distortedPosition2 = vec2(uv.x - (1.0 - dispFactor) * (disp.r*effectFactor), uv.y);

            vec4 _texture = texture2D(texture, distortedPosition);
            vec4 _texture2 = texture2D(texture2, distortedPosition2);

            vec4 finalTexture = mix(_texture, _texture2, dispFactor);

            gl_FragColor = finalTexture;
            // gl_FragColor = disp;
        }
    `;

				var parent = opts.parent || console.warn("no parent");
				var dispImage = opts.displacementImage || console.warn("displacement image missing");
				var image1 = opts.image1 || console.warn("first image missing");
				var image2 = opts.image2 || console.warn("second image missing");
				var intensity = opts.intensity || 1;
				var speedIn = opts.speedIn || 1.6;
				var speedOut = opts.speedOut || 1.2;
				var userHover = (opts.hover === undefined) ? true : opts.hover;
				var easing = opts.easing || Expo.easeOut;

				var mobileAndTabletcheck = function() {
					var check = false;
					(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
					return check;
				};

				var scene = new THREE.Scene();
				var camera = new THREE.OrthographicCamera(
						parent.offsetWidth / -2,
						parent.offsetWidth / 2,
						parent.offsetHeight / 2,
						parent.offsetHeight / -2,
						1,
						1000
				);

				camera.position.z = 1;

				var renderer = new THREE.WebGLRenderer({
					antialias: false,
					// alpha: true
				});

				renderer.setPixelRatio(window.devicePixelRatio);
				renderer.setClearColor(0xffffff, 0.0);
				renderer.setSize(parent.offsetWidth, parent.offsetHeight);
				parent.appendChild(renderer.domElement);

				// var addToGPU = function(t) {
				//     renderer.setTexture2D(t, 0);
				// };

				var loader = new THREE.TextureLoader();
				loader.crossOrigin = "";
				var texture1 = loader.load(image1);
				var texture2 = loader.load(image2);

				var disp = loader.load(dispImage);
				disp.wrapS = disp.wrapT = THREE.RepeatWrapping;

				texture1.magFilter = texture2.magFilter = THREE.LinearFilter;
				texture1.minFilter = texture2.minFilter = THREE.LinearFilter;

				texture1.anisotropy = renderer.getMaxAnisotropy();
				texture2.anisotropy = renderer.getMaxAnisotropy();

				var mat = new THREE.ShaderMaterial({
					uniforms: {
						effectFactor: { type: "f", value: intensity },
						dispFactor: { type: "f", value: 0.0 },
						texture: { type: "t", value: texture1 },
						texture2: { type: "t", value: texture2 },
						disp: { type: "t", value: disp }
					},

					vertexShader: vertex,
					fragmentShader: fragment,
					transparent: true,
					opacity: 1.0
				});

				var geometry = new THREE.PlaneBufferGeometry(
						parent.offsetWidth,
						parent.offsetHeight,
						1
				);
				var object = new THREE.Mesh(geometry, mat);
				scene.add(object);

				var addEvents = function(){
					var evtIn = "mouseenter";
					var evtOut = "mouseleave";
					if (mobileAndTabletcheck()) {
						evtIn = "touchstart";
						evtOut = "touchend";
					}
					parent.addEventListener(evtIn, function(e) {
						TweenMax.to(mat.uniforms.dispFactor, speedIn, {
							value: 1,
							ease: easing
						});
					});

					parent.addEventListener(evtOut, function(e) {
						TweenMax.to(mat.uniforms.dispFactor, speedOut, {
							value: 0,
							ease: easing
						});
					});
				};

				if (userHover) {
					addEvents();
				}

				window.addEventListener("resize", function(e) {
					renderer.setSize(parent.offsetWidth, parent.offsetHeight);
				});


				this.next = function(){
					TweenMax.to(mat.uniforms.dispFactor, speedIn, {
						value: 1,
						ease: easing
					});
				}

				this.previous = function(){
					TweenMax.to(mat.uniforms.dispFactor, speedOut, {
						value: 0,
						ease: easing
					});
				};

				var animate = function() {
					requestAnimationFrame(animate);

					renderer.render(scene, camera);
				};
				animate();
			};

			plugins.imageHover.forEach( function ( node ) {
				let
						img = node.querySelector( 'img' ),
						imgSrcFrom = img.getAttribute( 'src' ),
						imgSrcTo = img.getAttribute( 'data-image-to' );

				new hoverEffect({
					parent: node,
					intensity: -0.2,
					speedIn: 1.2,
					image1: imgSrcFrom,
					image2: imgSrcTo ? imgSrcTo : imgSrcFrom,
					displacementImage: 'images/4.png'
				});
			});
		}

		// Modal
		if (plugins.modal.length) {
			plugins.modal.forEach( function ( node ) {
				$( node ).modal({
					show: false,
					focus: false
				});
			});
		}

		// Modal Button
		if (plugins.modalBtn.length) {
			plugins.modalBtn.forEach( function ( node ) {
				let params = parseJSON( node.getAttribute( 'data-modal-trigger' ) );

				node.addEventListener( 'click', function () {
					let modal = document.querySelector( params.target );
					if ( modal.classList.contains( 'show' ) ) {
						$( modal ).modal( 'hide' );
					} else {
						$( modal ).modal( 'show' );
					}
				});
			});
		}

		// Slick
		if (plugins.slick.length) {
			plugins.slick.forEach( function ( node ) {
				let
						defaults = {
							autoplay:  true,
							prevArrow: '<button type="button" class="slick-prev"></button>',
							nextArrow: '<button type="button" class="slick-next"></button>'
						},
						breakpoint = { xs: 480, sm: 576, md: 768, lg: 992, xl: 1200, xxl: 1600 }, // slick slider uses desktop first principle
						responsive = [],
						params;

				// Making responsive parameters
				for ( let key in breakpoint ) {
					if ( node.hasAttribute( 'data-slick-' + key ) ) {
						responsive.push({
							breakpoint: breakpoint[ key ],
							settings: parseJSON( node.getAttribute( 'data-slick-' + key ) )
						});
					}
				}

				params = {
					responsive: responsive
				};

				let tmp = Util.merge( [ defaults, params ] );

				$( node ).slick( tmp );

				// Filtering
				let links = document.querySelectorAll( '.slick-filter-link' );
				links.forEach( function( element ) {
					element.addEventListener( 'click', function () {
						let filter = element.getAttribute( 'data-filter' );
						$( node ).slick( 'slickUnfilter' );
						if( filter !== '*' ) {
							$( node ).slick( 'slickFilter', '[data-category="' + filter + '"]' );
						}
					});
				});
			});
		}
	});
}());
