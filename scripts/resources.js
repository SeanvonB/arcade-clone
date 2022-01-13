// Resources.js

// This file is an image loading utility that includes a caching layer, so
// common images can easily be reused.

(function () {
	let resourceCache = {},
		readyCallbacks = [];

	// Parameter: either URL string of single image or array of image URLs
	function load(urlOrArr) {
		if (urlOrArr instanceof Array) {
			urlOrArr.forEach(function (url) {
				_load(url);
			});
		} else {
			_load(urlOrArr);
		}
	}

	function _load(url) {
		// Return cached image if available
		if (resourceCache[url]) {
			return resourceCache[url];
		} else {
			const img = new Image();
			img.onload = function () {
				resourceCache[url] = img;
				// Call ALL previously defined `onReady()` callbacks
				if (isReady()) {
					readyCallbacks.forEach(function (func) {
						func();
					});
				}
			};
			// Will update to `true` when image loads
			resourceCache[url] = false;
			img.src = url;
		}
	}

	// Faster `load()` for images known to be in cache
	function get(url) {
		return resourceCache[url];
	}

	// Check whether all requested images have been loaded
	function isReady() {
		var ready = true;
		for (var k in resourceCache) {
			if (resourceCache.hasOwnProperty(k) && !resourceCache[k]) {
				ready = false;
			}
		}
		return ready;
	}

	function onReady(func) {
		readyCallbacks.push(func);
	}

	window.Resources = {
		load: load,
		get: get,
		onReady: onReady,
		isReady: isReady,
	};
})();
