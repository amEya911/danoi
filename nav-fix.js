/**
 * DA NOI — Navigation Bridge
 * Fixes navigation in legacy Squarespace pages to redirect
 * the logo and "Home" links back to the redesigned homepage.
 *
 * Handles both local file:// browsing and http:// server environments.
 */
(function () {
  'use strict';

  // Determine path based on protocol
  var isLocal = window.location.protocol === 'file:';
  var currentPath = window.location.pathname;
  var homePath;

  if (currentPath.indexOf('/danoi.in/') !== -1) {
    homePath = '../index.html';
  } else {
    homePath = './index.html';
  }

  // Fix all logo links (Squarespace links logos to index.html)
  function fixLogoLinks() {
    var logoLinks = document.querySelectorAll(
      '.header-title-logo a, ' +
      'a[href="index.html"], ' +
      'a[href="./index.html"], ' +
      'a[href="../index.html"], ' +
      'a[href="/"]'
    );

    logoLinks.forEach(function (link) {
      link.setAttribute('href', homePath);
    });
  }

  // Fix favicon links (legacy pages still point to Squarespace CDN)
  function fixFavicons() {
    var favicons = document.querySelectorAll('link[rel="icon"], link[rel="apple-touch-icon"], link[rel="shortcut icon"]');
    var faviconPath = (currentPath.indexOf('/danoi.in/') !== -1) ? '../favicon.png' : './favicon.png';
    
    favicons.forEach(function (icon) {
      icon.setAttribute('href', faviconPath);
      // Optional: change type to png if it was ico
      if (icon.getAttribute('type') === 'image/x-icon') {
        icon.setAttribute('type', 'image/png');
      }
    });
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      fixLogoLinks();
      fixFavicons();
    });
  } else {
    fixLogoLinks();
    fixFavicons();
  }

  // Also observe for dynamically injected elements (Squarespace lazy-loads)
  var observer = new MutationObserver(function() {
    fixLogoLinks();
    fixFavicons();
  });
  observer.observe(document.body, { childList: true, subtree: true });
  // Observe head for dynamically injected favicons
  observer.observe(document.head, { childList: true, subtree: true });

  // Stop observing after 5 seconds to avoid performance hit
  setTimeout(function () {
    observer.disconnect();
  }, 5000);
})();
