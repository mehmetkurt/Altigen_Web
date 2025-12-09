SV = window.SV || {};

SV.HoverIntent = (function() {

	return function(elements, userConfig) {

		const defaultOptions = {
			exitDelay: 400,
			interval: 100,
			sensitivity: 7,
		};
		let config = {};

		let currX, currY, prevX, prevY;
		let allElems, pollTimer, exitTimer;

		const extend = function(defaults, userArgs) {
			for (let i in userArgs) {
				defaults[i] = userArgs[i];
			}

			return defaults;
		};

		const mouseTrack = function(ev) {
			currX = ev.pageX;
			currY = ev.pageY;
		};

		const mouseCompare = function(targetElem) {
			const distX = prevX - currX, distY = prevY - currY;
			const distance = Math.sqrt(distX*distX + distY*distY);

			if (distance < config.sensitivity) {
				clearTimeout(exitTimer);
				for (let elem of allElems) {
					if (elem.isActive) {
						config.onExit(elem);
						elem.isActive = false;
					}
				}

				config.onEnter(targetElem);
				targetElem.isActive = true;
			} else {
				prevX = currX;
				prevY = currY;
				pollTimer = setTimeout(function() {
					mouseCompare(targetElem);
				}, config.interval);
			}
		};

		const init = function(elements, userConfig) {
			if (!userConfig || !userConfig.onEnter || !userConfig.onExit) {
				throw 'onEnter and onExit callbacks must be provided';
			}
			config = extend(defaultOptions, userConfig);
			allElems = elements;

			for (let elem of allElems) {
				elem.isActive = false;
				elem.addEventListener('mousemove', mouseTrack);

				elem.addEventListener('mouseenter', function(ev) {
					prevX = ev.pageX;
					prevY = ev.pageY;
					if (elem.isActive) {
						clearTimeout(exitTimer);
						return;
					}

					pollTimer = setTimeout(function() {
						mouseCompare(elem);
					}, config.interval);
				});
				elem.addEventListener('mouseleave', function(ev) {
					clearTimeout(pollTimer);
					if (!elem.isActive)
						return;

					exitTimer = setTimeout(function() {
						config.onExit(elem);
						elem.isActive = false;
					}, config.exitDelay);
				});
			}
		};

		init(elements, userConfig);
	};

})();
