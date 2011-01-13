/**
 * Drag and Drop File Upload - Plugin for jQuery
 *
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * Depends:
 *   jquery.js
 *
 * Author: hiromitz ( http://github.com/hiromitz )
 *
 * TODO:
 *   Chrome, Safari support (only Firefox 3.6+)
 *
 */

;(function($, undefined){

    function drop(event, opt){
        var builder = '',
			data = event.dataTransfer || event.originalEvent.dataTransfer,
			dashdash = '--', crlf = '\r\n',
			boundary = '------multipartformboundary' + (new Date).getTime(),
			xhr = new XMLHttpRequest(),
			file;
        
        builder = dashdash + boundary + crlf;
        
        $.each(data.files, function(i, file){

            /* Generate headers. */
            builder += 'Content-Disposition: form-data; name="' + opt.name.replace('#', i+1) + '"';
            if (file.fileName) {
                builder += '; filename="' + file.fileName + '"';
            }
            builder += crlf;
            builder += 'Content-Type: application/octet-stream';
            builder += crlf;
            builder += crlf;
            
            /* Append binary data. */
            builder += file.getAsBinary();
            builder += crlf;
            
            /* Write boundary. */
            builder += dashdash;
            builder += boundary;
            builder += crlf;
        });
        
        /* Mark end of the request. */
        builder += dashdash;
        builder += boundary;
        builder += dashdash;
        builder += crlf;
        
        xhr.open("POST", opt.url, true);
        xhr.setRequestHeader('content-type', 'multipart/form-data; boundary=' + boundary);

        xhr.onload = function(event){
            if (xhr.responseText) {
                opt.callback.call(this, xhr.responseText);
            }
        };
        
        xhr.send(builder);
        return false;
    }
    
    $.fn.dndupload = function(op){
    
    	// extend default option
        op = $.extend({
	        url: 'upload.php',
	        method: 'post',
	        dover: 'dnd-dover',
	        name: 'file[]',
			callback: function(){}
	    }, op);
        
        return this.each(function(){
            var self = this;
            
            $(this).bind('dragenter', function(ev){
                ev.stopPropagation();
                ev.preventDefault();
                $(self).addClass(op.dover);
                return false;
            }).bind('dragover', function(ev){
                ev.stopPropagation();
                ev.preventDefault();
                $(self).addClass(op.dover);
                return false;
            }).bind('dragleave', function(ev){
                ev.stopPropagation();
                ev.preventDefault();
                $(self).removeClass(op.dover);
                return false;
            }).bind('drop', function(ev){
                ev.stopPropagation();
                ev.preventDefault();
                $(self).removeClass(op.dover);
                drop(ev, op);
                return false;
            }, false);
        });
    };
    
    
})(jQuery);

