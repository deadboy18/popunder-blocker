// ==UserScript==
// @name         Popunder Blocker - 1shows, 1flex, 1tube
// @namespace    https://github.com/deadboy18/popunder-blocker
// @version      1.0
// @description  Blocks popunder/clickunder ads on 1shows.org, 1flex.org, and 1tube.org by removing ad scripts and intercepting window.open calls
// @author       deadboy18
// @match        *://*.1shows.org/*
// @match        *://*.1flex.org/*
// @match        *://*.1tube.org/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @updateURL    https://raw.githubusercontent.com/deadboy18/popunder-blocker/main/popunder-blocker.user.js
// @downloadURL  https://raw.githubusercontent.com/deadboy18/popunder-blocker/main/popunder-blocker.user.js
// @homepageURL  https://github.com/deadboy18/popunder-blocker
// @supportURL   https://github.com/deadboy18/popunder-blocker/issues
// ==/UserScript==

(function() {
    'use strict';

    // Block ad scripts from loading by removing them as they're injected into the DOM
    const observer = new MutationObserver(mutations => {
        for (const m of mutations) {
            for (const node of m.addedNodes) {
                if (node.tagName === 'SCRIPT' && node.src &&
                    /layla\.wtf|llvpn\.com|daleelerah|reffpa\.com/i.test(node.src)) {
                    node.remove();
                }
            }
        }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });

    // Override window.open to block popunder redirects
    const realOpen = window.open;
    window.open = function(url) {
        if (url && /daleelerah|reffpa|v2006|rtb-pops/i.test(url)) return null;
        return realOpen.apply(this, arguments);
    };
})();
