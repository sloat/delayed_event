/**
* ================
* jQuery delayed event plugin - 1.0
* ================
*
* jquery.delayed_event-1.0.js
*     Matt Schmidt [http://www.mattptr.net]
*
* Licensed under a Three-clause BSD License
*     http://mattptr.net/license/license.txt
*
* $(selector).delayed_event(event_type, delay, callback)
*     Execute a callback function for an event after a specified amount of time (ms).
*     
*     Event objects are collected and passed to the callback after the event has
*     not been triggered within the timeout delay. In other words, triggering the 
*     event resets the timer.
*
*     * event_type, standard jQuery event. E.g., click, mouseenter, etc.
*     * delay, how long to wait until triggering the callback
*     * callback, accepts 1 parameter, an array of events collected while 
*       waiting for the timer to expire.
*
* $(selector).delayed_event('stop')
*     Stops execution of a delayed event.
*
* Please note that this doesn't work very well with the `submit` event.
*
* --------
* Examples
* --------
*
*     // Trigger keyup when the user is finished typing.
*     // `events` is an array.
*     $('input[name=txt]').delayed_event('keyup', 1000, function (events) {
*         var last = events[events.length - 1];
*         console.log("Last key: " + last.which);
*     });
*
*     // Total up the number of clicks on a button
*     $('input[name=btn]').delayed_event('click', 1000, function (events) {
*         console.log(events.length + ' click(s) a second ago');
*     });
*
*     // Show an element after the mouse has stayed on the parent for more
*     // than one second. Similar to the `hoverIntent` plugin.
*     $('.hover').delayed_event('mouseenter', 1000, function () {
*         $('.toggle').show();
*     }).bind('mouseleave', function () {
*         $(this).delayed_event('stop');
*         $('.toggle').hide();
*     });
*  
*/

(function ($) {
    var methods = {
        bind: function (event_type, delay, cb) {
            return this.each(function () {
                var $this = $(this);
                var self = this;
                var data = $this.data('delayed_event');
                
                if (!data) {
                    $this.data('delayed_event', {
                        tm_id: null,
                        events: []
                    });
                    data = $this.data('delayed_event');
                }

                $this.bind(event_type, function (event) {
                    if (data.tm_id)
                        clearTimeout(data.tm_id);
                    data.events.push(event);
                    data.tm_id = setTimeout(function () {
                        cb.call(self, data.events);
                        data.events = [];
                    }, delay);
                });
            });
        },
        stop: function () {
            return this.each(function () {
                var $this = $(this);
                var data = $this.data('delayed_event');

                if (data && data.tm_id) {
                    clearTimeout(data.tm_id);
                    data.events = [];
                }
            });
        }
    };

    $.fn.delayed_event = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        }
        else {
            return methods.bind.apply(this, arguments);
        }
    };
})(jQuery);
