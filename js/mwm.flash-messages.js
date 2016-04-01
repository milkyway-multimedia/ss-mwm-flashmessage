var mwm=window.mwm||{};mwm.alerts=function(t,e,a,i){var n=t.alerts||{},o={alerts:{success:"alert-success",error:"alert-error",hide:"hide",hideForm:"hide",animation:"subtle-bounce",animated:"animated",invisible:"invisible",position:"center"},notify:{timeout:3,position:"top"},vex:{className:"vex-theme-default",focusFirstInput:!1},messenger:{message:{},position:{extraClasses:"messenger-fixed messenger-on-top-right"}},top:{prependTo:"body",bar:'<div id="FlashNotifications" class="notifications-flash"></div>',message:'<div class="notifications-flash--item notifications-flash--item_{{ level }}" data-content="{{ content }}" data-id="{{ id }}"><div class="notifications-flash--item-content">{{ content }}</div></div>',dismissable:'<span class="close notifications-flash--item-close" data-dismiss="notifications-flash--item" aria-label="Close"><span aria-hidden="true">&times;</span></span>',initCheck:function(){return n.top.$bar.length||e("#FlashNotifications").length},classes:{animated:"notifications-flash_in"}},flash:{levels:{top:"top",modal:"message",note:"notify"}}},s=function(){return e&&"function"==typeof e().modal},r=function(){return e&&"function"==typeof e().dialog},l=function(){return e&&typeof e.hasOwnProperty("noticeAdd")},d=function(t,e){"top"==e?t.css({top:0,bottom:"auto"}).addClass("notification-top"):"bottom"==e?t.css({top:"auto",bottom:0}).addClass("notification-bottom"):"left"==e?t.css({left:0,right:"auto"}).addClass("notification-left"):"right"==e?t.css({left:"auto",right:0}).addClass("notification-right"):t.removeClass("notification-top notification-bottom notification-left notification-right")},m=function(t){return e.map(t.split(" "),function(t,e){return"messenger-on-"+e}).join(" ")},f=function(){o.top.initCheck()||(n.top.$bar=e(o.top.bar),e(o.top.prependTo).prepend(n.top.$bar))};return n.configure=function(t){o=e.extend(!0,{},o,t)},n.message=function(t,i){var l,m,f=t.Content?t.Content:t.message?t.message:t.content;if(t.redirect&&(e("body").addClass("loading-redirect"),window.location=t.redirect),f&&!t.hideMessage){t.$form&&t.$form.data("onMessageClass")&&t.$form.addClass(t.$form.data("onMessageClass"));var c=function(e,a){return function(){var n=t.$form?t.$form.find(".form-group.error"):[];!n.length&&a&&(n=a.parents("form").find(".form-group.error")),n.length&&n.first().find(":input:not(:hidden)").first().focus(),i&&i(),a&&m.trigger("mwm::alert",[e,t]),t.$form&&t.$form.trigger("mwm::alert",[e,t])}};if(s()&&!t.hideModal&&t.$modal&&!e(".modal-backdrop").length)t.Title&&t.$modal.find('[role="title"]').html(t.Title),f&&t.$modal.find('[role="content"]').html(f),t.$modal.modal(),t.$modal.off("hidden.bs.modal.forms.mwm").on("hidden.bs.modal.forms.mwm",c("modal",t.$modal)),n.clear(t);else if(!r()||t.hideModal||e(".ui-widget-overlay").length)if(!t.hideAlert&&t.$alert&&t.$alert.length)t.hideForm&&(t.$form?t.$form.addClass(o.alerts.hideForm):t.$alert.parents("form:first").addClass(o.alerts.hideForm)),t.success&&t.success!==!1?t.$alert.removeClass(o.alerts.error).addClass(o.alerts.success).html(f):t.$alert.removeClass(o.alerts.success).addClass(o.alerts.error).html(f),l=t.$alert.data("animate"),l||(l=o.alerts.animation),t.$alert.hasClass(o.alerts.invisible)?t.$alert.removeClass(o.alerts.invisible+" "+o.alerts.hide).addClass(o.alerts.animated+" "+l):t.$alert.hasClass(o.alerts.animated)?(t.$alert.removeClass(o.alerts.animated+" "+l).addClass(o.alerts.invisible),setTimeout(function(){t.$alert.removeClass(o.alerts.invisible+" "+o.alerts.hide).addClass(o.alerts.animated+" "+l)},50)):t.$alert.removeClass(o.alerts.hide),c("html",t.$alert)();else if(a){var u=t.positionAlert?t.positionAlert:o.alerts.position,p=a.dialog.alert(e.extend({},o.vex,{message:f})).bind("vexOpen.mwm",function(e,a){d(a.$vex,u),t.closeAfter||c("vex")()});t.closeAfter&&setTimeout(function(){a.close(p.data().vex.id),c("vex")()},1e3*t.closeAfter)}else r()?(m=e('<div class="ui-widget-modal-content">'+f+"</div>"),m.dialog({resizable:!1,title:t.Title?t.Title:null}),n.clear(t)):(alert(f),c("ui-alert")());else m=e('<div class="ui-widget-modal-content">'+f+"</div>"),m.dialog({modal:!0,title:t.Title?t.Title:null}),n.clear(t)}},n.notify=function(t,n){var s,r=t.Content?t.Content:t.message?t.message:t.content;if(r&&!t.hideMessage){var f=t.Timeout?t.Timeout:o.notify.timeout;f*=1e3;var c=t.position?t.position:o.notify.position;if(i){s=e.extend({},o.messenger.message,{message:r}),t.type&&(s.type=t.type);var u=e.extend({},o.messenger.position,t.advanced||{});c&&(u.extraClasses="messenger-fixed "+m(c)),i(u).post(s),t.$form&&t.$form.trigger("mwm::notification",["messenger",t]),e.event.trigger("mwm::notification",["messenger",t])}else if(a){s=e.extend({},o.vex,{message:r});var p=a.dialog.alert(s).bind("vexOpen.mwm",function(a,i){d(i.$vex,c),f||(n&&n(),t.$form&&t.$form.trigger("mwm::notification",["vex",t]),e.event.trigger("mwm::notification",["vex",t]))});f&&setTimeout(function(){p.data()&&p.data().vex&&p.data().vex.id&&a.close(p.data().vex.id),n&&n(),t.$form&&t.$form.trigger("mwm::notification",["vex",t]),e.event.trigger("mwm::notification",["vex",t])},f)}else l()?(s={text:r},t.type&&(s.type=t.type),f&&(s.stayTime=f),t.$form&&t.$form.trigger("mwm::notification",["noticeAdd",t]),e.noticeAdd(s),e.event.trigger("mwm::notification",["noticeAdd",t])):(alert(r),n&&n(),t.$form&&t.$form.trigger("mwm::notification",["alert",t]))}},n.button=function(i,n,s){var l=!0;if(!(i&&i.length&&i.data("alertContent")&&i.data("alertTarget")))return l;var d,m=i.data("alertTarget"),f=i.data("alertType")?i.data("alertType"):"alert",c=i.data("alertIf"),u=e({},o.vex,{message:i.data("alertContent"),buttons:i.data("alertButtons")?i.data("alertButtons"):{}}),p=function(o,m){if(o&&(u.message="string"==typeof o?o:e(o).text()),m&&(u.className=u.className?u.className+" "+m:m),u.buttons&&u.buttons.cancel&&(u.buttons.cancel.click=function(t){return t.data().vex.value=!1,a.close(t.data().vex.id)}),c&&!e(c).length)return l;if("alert"===f)a?a.dialog.alert(u):r()?(d=e('<div class="ui-widget-modal-content">'+u.message+"</div>"),u.title=i.data("alertTitle"),u.buttons={OK:function(){e(this).dialog("close")}},d.dialog(u)):alert(u.message);else if("confirm"===f){t&&t.forms&&t.forms.submit&&(t.forms.submit.submitting=!0),l=!1;var p=!1;if(a)u.callback=function(t){n&&t?n():s&&!t&&s()},a.dialog.confirm(u);else if(r()){if(d=e('<div class="ui-widget-modal-content">'+u.message+"</div>"),u.title=i.data("alertTitle"),2==e(u.buttons).length){var g=0;e(u.buttons).each(function(t){0===g?u.buttons[t]=function(){n&&n(),e(this).dialog("close")}:u.buttons[t]=function(){s&&s(),e(this).dialog("close")}})}else u.buttons={OK:function(){n&&n(),e(this).dialog("close")},Cancel:function(){s&&s(),e(this).dialog("close")}};d.dialog(u)}else p=confirm(u.message),n&&p?n():s&&!p&&s()}return null};if(m)if(0===m.indexOf("#")&&e(m).length){var g=e(m),v="";if(g.data("modal")){var h=g.find(".modal-content").find("[role=title]");h.length&&(v+=h[0].outerHTML),v+=g.find(".modal-content").find("[role=content]").html(),p(v,"button-alert-from-modal")}else v=g.html(),p(v,"button-alert-from-html")}else e.get(m,function(t){p(t,"button-alert-from-url")});else p(null,"button-alert-from-attribute");return l},n.clear=function(t){t.$alert&&t.$alert.length&&t.$alert.addClass(o.alerts.hide)},n.top=n.top||{},n.top.$bar=n.top.$bar||[],n.top.message=function(t){f();var a=t.Content?t.Content:t.message?t.message:t.content,i=t.id?t.id:a;if(a&&!n.top.$bar.find('[data-id="'+i+'"]').length){var s=e(o.top.message.replace(new RegExp("{{ level }}","g"),t.level||"info").replace(new RegExp("{{ content }}","g"),a).replace(new RegExp("{{ id }}","g"),i));if(t.dismissable){var r=e(o.top.dismissable);s.prepend(r),r.one("click",function(){n.top.clear(s)})}n.top.$bar.append(s).addClass(o.top.classes.animated).parent().addClass(o.top.classes.animated),setTimeout(function(){s.addClass(o.top.classes.animated),t.timeout&&setTimeout(function(){s.removeClass(o.top.classes.animated)},1e3*t.timeout),n.top.$bar.trigger("mwm::top:alert",[s,t])},500)}},n.top.clear=function(t){f();var a=null;t?(a=t instanceof e?t:n.top.$bar.children().filter(function(){return e(this).data("id")==t}),a.removeClass(o.top.classes.animated),a.one("webkitTransitionEnd mozTransitionEnd MSTransitionEnd otransitionend transitionend",function(){e(this).remove()})):(n.top.$bar.removeClass(o.top.classes.animated),n.top.$bar.one("webkitTransitionEnd mozTransitionEnd MSTransitionEnd otransitionend transitionend",function(){n.top.$bar.text("").parent().removeClass(o.top.classes.animated)})),n.top.$bar.trigger("mwm::top:cleared",[a,t])},n.flash=function(t,e){for(var a=[],i=0;i<t.length;i++)t[i].type||(t[i].hasOwnProperty("level")&&o.flash.levels.hasOwnProperty(t[i].level)?t[i].type=o.flash.levels[t[i].level]:t[i].type="top"),e&&-1===a.indexOf(t[i].type)&&(a=a.push(t[i].type),"top"==t[i].type?n.top.clear():n.clear()),n[t[i].type](t[i])},n}(window.mwm||{},window.jQuery||window.Zepto||window.Sprint,window.vex||null,window.Messenger||null),window.flash_message=function(t,e){if(t.hasOwnProperty("alerts")){var a=window.flash_message||{},i=function(e){e=e.sort(function(t,e){return t.priority<e.priority?-1:t.priority>e.priority?1:0}),t.alerts.flash(e)};return a.ajax=function(t,n,o){e.isArray(n)||(n=n?n.split(","):[]);var s=[],r=function(){e.get(t).done(function(t){if(t!==!1&&(t&&e.isArray(t)&&(s=s.concat(t)),i(s),o)){var r=o.hasOwnProperty("link")?o.link:o,l=o.hasOwnProperty("timeout")?o.timeout:5e3,d=o.hasOwnProperty("before")?o.before:n;setTimeout(function(){a.ajax(r,d,o)},l)}})};if(n.length)for(var l=0,d=0;d<n.length;d++)e.get(n[d]).done(function(t){t&&e.isArray(t)&&(s=s.concat(t))}).always(function(){l++,l===n.length&&r()});else r()},a}}(window.mwm||{},window.jQuery||window.Zepto||window.Sprint||(window.mwm&&mwm.jquery?mwm.jquery:null));