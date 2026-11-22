// ==UserScript==
// @name         Popunder Blocker - 1shows, 1flex, 1tube
// @namespace    https://github.com/deadboy18/popunder-blocker
// @version      1.2
// @description  Blocks popunder/clickunder ads on 1shows.org, 1flex.org, 1tube.org and their embedded video players
// @author       deadboy18
// @match        *://*.1shows.org/*
// @match        *://*.1flex.org/*
// @match        *://*.1tube.org/*
// @match        *://*.vidy.st/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @icon         https://raw.githubusercontent.com/deadboy18/popunder-blocker/main/icon.png
// @updateURL    https://raw.githubusercontent.com/deadboy18/popunder-blocker/main/popunder-blocker.user.js
// @downloadURL  https://raw.githubusercontent.com/deadboy18/popunder-blocker/main/popunder-blocker.user.js
// @homepageURL  https://github.com/deadboy18/popunder-blocker
// @supportURL   https://github.com/deadboy18/popunder-blocker/issues
// ==/UserScript==

(function() {
    'use strict';

    const AD_SCRIPT_RE = /layla\.wtf|llvpn\.com|daleelerah|reffpa\.com|popunder|clickunder/i;
    const AD_POPUP_RE = /daleelerah|reffpa|v2006|rtb-pops|popunder/i;

    // 1. Block ad scripts from loading by removing them as they're injected
    const observer = new MutationObserver(mutations => {
        for (const m of mutations) {
            for (const node of m.addedNodes) {
                if (node.tagName === 'SCRIPT' && node.src && AD_SCRIPT_RE.test(node.src)) {
                    node.remove();
                }
            }
        }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });

    // 2. Override window.open to block popunder redirects
    const realOpen = window.open;
    window.open = function(url) {
        if (url && AD_POPUP_RE.test(String(url))) return null;
        return realOpen.apply(this, arguments);
    };

    // 3. Prevent click hijacking on body/document
    // Intercept addEventListener to block ad click listeners on body/document
    const realAddEventListener = EventTarget.prototype.addEventListener;
    let firstClickConsumed = false;

    EventTarget.prototype.addEventListener = function(type, listener, options) {
        // Block suspicious click/mousedown/pointerdown listeners on body or document
        if ((type === 'click' || type === 'mousedown' || type === 'pointerdown') &&
            (this === document || this === document.body || this === window)) {
            const listenerStr = typeof listener === 'function' ? listener.toString() : '';
            if (/window\.open|popup|popunder|click_id|rtb|reffpa|daleelerah/i.test(listenerStr)) {
                return; // silently block
            }
        }
        return realAddEventListener.call(this, type, listener, options);
    };

    // 4. Nuke body.onclick if set by ad scripts
    const onclickDesc = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'onclick') ||
                        Object.getOwnPropertyDescriptor(Element.prototype, 'onclick') ||
                        Object.getOwnPropertyDescriptor(GlobalEventHandlers, 'onclick');

    if (onclickDesc && onclickDesc.set) {
        const realSet = onclickDesc.set;
        Object.defineProperty(HTMLBodyElement.prototype, 'onclick', {
            set: function(fn) {
                if (fn && /window\.open|popup|popunder|click_id|rtb/i.test(fn.toString())) {
                    return; // block ad onclick
                }
                realSet.call(this, fn);
            },
            get: onclickDesc.get ? onclickDesc.get : function() { return null; },
            configurable: true
        });
    }

    // 5. Periodically clear any body.onclick that slips through
    const clearAdHandlers = () => {
        if (document.body && document.body.onclick) {
            const fn = document.body.onclick.toString();
            if (/window\.open|popup|popunder|click_id|rtb|reffpa|daleelerah/i.test(fn)) {
                document.body.onclick = null;
            }
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            clearAdHandlers();
            setInterval(clearAdHandlers, 2000);
        });
    } else {
        clearAdHandlers();
        setInterval(clearAdHandlers, 2000);
    }
})();
