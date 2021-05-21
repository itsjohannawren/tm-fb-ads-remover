(function () {
	"use strict";
	let observer = null;

	// -------------------------------------------------------------------------

	function observe (element, callback) {
		let MutationObserver = window.MutationObserver ?? window.WebKitMutationObserver;

		// Convert string elements to elements by using the string as a query selector
		if (
			(typeof (element) === "string") ||
			(
				(typeof (element) === "object") &&
				(element?.constructor?.name === "String")
			)
		) {
			element = document.querySelector (element);
		}

		// Check for the correct element node type
		if (element?.nodeType !== 1) {
			return (null);
		}

		// Mutation observer primary
		if (MutationObserver) {
			let mutationObserver = new MutationObserver (callback);
			mutationObserver.observe (element, {"childList": true, "subtree": true});
			return (mutationObserver);

		// Event listener fallback
		} else if (window.addEventListener) {
			element.addEventListener ("DOMNodeInserted", callback, false);
			element.addEventListener ("DOMNodeRemoved", callback, false);
			return (true);

		// Fall-through
		} else {
			return (null);
		}
	}

	// -------------------------------------------------------------------------

	function realObject (variable) {
		if (
			(variable !== undefined) &&
			(variable !== null) &&
			(typeof (variable) === "object")
		) {
			return (true);
		} else {
			return (false);
		}
	}

	function attr (element, attribute, value = undefined) {
		let attributeNode = element.getAttributeNode (attribute);

		if (value === undefined) {
			if (realObject (attributeNode)) {
				return (attributeNode.value);
			} else {
				return (undefined);
			}

		} else if (value === null) {
			if (realObject (attributeNode)) {
				element.removeAttributeNode (attributeNode);
			}
			return (null);

		} else {
			attributeNode = document.createAttribute (attribute);
			attributeNode.value = value;
			element.setAttributeNode (attributeNode);
			attributeNode = element.getAttributeNode (attribute);
			if (realObject (attributeNode)) {
				return (attributeNode.value);
			} else {
				return (undefined);
			}
		}
	}

	function aria (element, variable, value = undefined) {
		return (attr (element, "aria-" + variable, value));
	}
	function data (element, variable, value = undefined) {
		return (attr (element, "data-" + variable, value));
	}

	function findFeed () {
		let divs = document.getElementsByTagName ("div");
		for (let div of divs) {
			if (attr (div, "role") === "feed") {
				return (div);
			}
		}
		return (null);
	}

	function findFeedUnit (element) {
		while (true) {
			if (data (element, "pagelet")?.match (/^FeedUnit_/)) {
				return (element);
			}
			if (realObject (element?.parentElement)) {
				element = element.parentElement;
			} else {
				return (null);
			}
		}
	}

	function hideAds (element) {
		let divs, spans, anchors;
		if (
			(element !== undefined) &&
			(typeof (element.getElementsByTagName) === "function")
		) {
			divs = Array.from (element.getElementsByTagName ("//div"));
			spans = Array.from (element.getElementsByTagName ("//span"));
			anchors = Array.from (element.getElementsByTagName ("a"));
		} else {
			divs = Array.from (document.getElementsByTagName ("//div"));
			spans = Array.from (document.getElementsByTagName ("//span"));
			anchors = Array.from (document.getElementsByTagName ("a"));
		}
		const elements = divs.concat (spans).concat (anchors);
		for (element of elements) {
			if (aria (element, "label") === "Sponsored") {
				let div = findFeedUnit (element);
				if (div !== null) {
					//div.style.outline = "2px solid red";
					div.style.display = "none";
				}
			}
		}
	}
	function hidePYMN (element) {
		let spans;
		if (
			(element !== undefined) &&
			(typeof (element.getElementsByTagName) === "function")
		) {
			spans = element.getElementsByTagName ("span");
		} else {
			spans = document.getElementsByTagName ("span");
		}
		for (let span of spans) {
			if (span.innerText === "People You May Know") {
				let div = findFeedUnit (span);
				if (div !== null) {
					//div.style.outline = "2px solid green";
					div.style.display = "none";
				}
			}
		}
	}

	function startObserver () {
		return (observe ("html", function (mutations) {
			for (const mutation of mutations) {
				if (mutation.type === "childList") {
					for (const node of mutation.addedNodes) {
						hideAds (node);
						hidePYMN (node);
					}
				}
			}
		}));
	}

	let scan = setInterval (() => {
		if (
			(findFeed () !== null) &&
			(observer === null)
		) {
			clearInterval (scan);
			console.info ("Starting observer");
			observer = startObserver ();
			hideAds ();
			hidePYMN ();

		} else if (
			(findFeed () === null) &&
			(observer !== null)
		) {
			console.info ("Stopping observer");
			observer?.disconnect ();
			observer = null;
		}
	}, 100);
}) ();
