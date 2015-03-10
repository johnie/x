;(function() {

  'use strict';

  var X = (function () {

    var _ = self.X = {

      init: function() {
        console.log('Glory!');
      }

    };

    if (document.addEventListener) {
  		document.addEventListener('DOMContentLoaded', _.init);
  	}

    return self.X;

  })();

})();
