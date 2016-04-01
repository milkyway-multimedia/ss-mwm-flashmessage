window.flash_message = (function (mwm, $) {
    if (!mwm.hasOwnProperty('alerts')) {
        return;
    }

    var exports = window.flash_message || {},
        loadMessages = function(messages) {
            messages = messages.sort(function(a, b) {
                return ((a['priority'] < b['priority']) ? -1 : ((a['priority'] > b['priority']) ? 1 : 0));
            });

            mwm.alerts.flash(messages);
        };

    exports.ajax = function(link, before, ping) {
        if(!$.isArray(before)) {
            before = before ? before.split(',') : [];
        }

        var messages = [],
            loadLink = function () {
                $.get(link)
                    .done(function (data) {
                        if(data === false) {
                            return;
                        }

                        if (data && $.isArray(data)) {
                            messages = messages.concat(data);
                        }

                        loadMessages(messages);

                        if(ping) {
                            var link = ping.hasOwnProperty('link') ? ping.link : ping,
                                timeout = ping.hasOwnProperty('timeout') ? ping.timeout : 5000,
                                pingBefore = ping.hasOwnProperty('before') ? ping.before : before;

                            setTimeout(function() {
                                exports.ajax(link, pingBefore, ping);
                            }, timeout);
                        }
                    });
            };

        if (before.length) {
            var done = 0;

            for (var i = 0; i < before.length; i++) {
                $.get(before[i])
                    .done(function (data) {
                        if (data && $.isArray(data)) {
                            messages = messages.concat(data);
                        }
                    })
                    .always(function () {
                        done++;

                        if (done === before.length) {
                            loadLink();
                        }
                    });
            }
        }
        else {
            loadLink();
        }
    };

    return exports;
}(window.mwm || {}, window.jQuery || window.Zepto || window.Sprint || (window.mwm && mwm.jquery ? mwm.jquery : null)));