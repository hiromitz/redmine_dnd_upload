/**
 * Drag and Drop File Upload for webkit - Plugin for jQuery
 *
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * Depends:
 *   jquery.js
 *
 * Author: hiromitz ( http://github.com/hiromitz )
 *
 */
;(function($) {
	
	$.fn.dndupload = function(opt) {
		// default option
		opt = $.extend({
			url: '',
			name: 'dndupload-input',
			enter: function(){},
			leave: function(){},
			callback: function(){}
		}, opt);
		
		return this.each(function() {
			
			var self = this, c = 0,
			$form = $('<form>', {
				method: 'post',
				action: opt.url,
				enctype: 'multipart/form-data'
			}),
			$input = $('<input>', {
				name: opt.name,
				type: 'file',
				multiple: opt.multiple
			}).addClass('dndupload-input').hide();
			
			// add form
			$form.append($input).prependTo(self);
			
			$(self).css({position: 'relative'}).bind('dragenter.dndupload', function(e) {
				c++;
				$input.show();
				opt.enter.call(self, [e]);
			}).bind('dragleave.dndupload', function(e) {
				c--;
				if (!c) {
					$input.hide();
					opt.leave.call(self, [e]);
				}
			}).bind('drop.dndupload', function(e) {
				e.stopPropagation();
				e.preventDefault();
				return false;
			});
			
			$input.bind('change.dndupload', function() {
				if(!$input.val()) return;
				$form.submit();
				$('#ajax-indicator').show();
				return false;
			});
		});
	};
	
})(jQuery);

