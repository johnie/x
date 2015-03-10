self = (typeof window !== 'undefined')
	? window   // if in browser
	: (
		(typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope)
		? self // if in worker
		: {}   // if in node js
	);

;(function() {

  'use strict';

  var X = (function () {

    var _ = self.X = {

      /**
       * Initialize
       */

      init: function() {
        _.currentState();
      },

      /**
       * Add active class to navigation
       * on current page.
       */

      currentState: function () {
        var currentPage = $('body').data('current-page');
        if (currentPage) {
          $('.nav a[data-page-id="' + currentPage + '"]').addClass('active');
        }
      }

    };

    if (document.addEventListener) {
  		document.addEventListener('DOMContentLoaded', _.init);
  	}

    return self.X;

  })();

})();
