/* Default Values */
var _datePickerDefault = {
    monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    weekdaysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    weekdaysFull: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    showMonthsShort: true,
    labelMonthNext: 'Next month',
    labelMonthPrev: 'Previous month',
    labelMonthSelect: 'Select a month',
    labelYearSelect: 'Select a year',
    selectMonths: true,
    format: 'dd/mm/yyyy',
    formatSubmit: 'dd/mm/yyyy',
    today: '',
    clear: '',
    close: '',
    closeOnSelect: true,
    showWeekdaysFull: false,
    selectYears: 100
};
var _timePickerDefault = {
    autoclose: true,
    donetext: '',
    twelvehour: true
};
var _dataTableDefault = {
    stateSave: true,
    deferRender: true,
    destroy: true
};
var _tinyMCEDefault = {
  selector: 'textarea#txtDescription',
  plugins: [ 'code', 'lists', 'table', 'fullscreen'],
  toolbar: 'undo redo styleselect bold italic alignleft aligncenter alignright image bullist numlist outdent indent code',
  a11y_advanced_options: true,
  mobile: {
    plugins: [ 'autosave', 'lists', 'autolink' ],
    toolbar: [ 'undo', 'bold', 'italic', 'styleselect' ]
  },
  placeholder: 'Type here...',
  skin: 'oxide-dark'
};
var _sideNavDefault = {
  edge: 'left', // Choose the horizontal origin
  closeOnClick: true, // Closes side-nav on &lt;a&gt; clicks, useful for Angular/Meteor
  timeDurationOpen: 300, // Time duration open menu
  timeDurationClose: 200, // Time duration open menu
  timeDurationOverlayOpen: 50, // Time duration open overlay
  timeDurationOverlayClose: 200, // Time duration close overlay
  easingOpen: 'easeOutQuad', // Open animation
  easingClose: 'easeOutCubic', // Close animation
  showOverlay: true, // Display overflay
  showCloseButton: false, // Append close button into siednav
  slim: true
};

/* Commons Functions */
function getHash() {
    var hash = '';
    if (window.location.hash.length > 0) hash = window.location.hash.split('?')[0].substring(1).toLowerCase().replace('/', '');
    return hash;
}
function setHash(value) {
    window.location.hash = '';
    window.history.pushState(null, null, value);
}
function getQueryStringValue(key,defValue) {
    var value = unescape(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + escape(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
    return (value)?value:defValue;
}
function getQueryIntValue(key,defValue) {
    var value = unescape(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + escape(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
    return (value)?parseInt(value):defValue;
}
function getQueryBoolValue(key,defValue) {
    var value = unescape(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + escape(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
    return (value=='true')?true:(value=='false')?false:defValue;
}
function setQuery(objParams) {
    var value = '';
    var route = (window.location.href.indexOf('?')>0)?window.location.href.split('?')[0]:window.location.href;
    for (k in objParams) {
      if (objParams.hasOwnProperty(k)) {
        if (value!='') value+='&';
        value+=k+'='+objParams[k];
      }
    }
    if (value!='') {
      value = route+'?'+value;
      window.location.hash = '';
      window.history.pushState(null, null, value);
    }
    else {
      window.history.pushState(null, null, route);
    }
}
function setUrlQuery(urlQ) {
  window.location.hash = '';
  window.history.pushState(null, null, urlQ);
}
function initializeTooltips () {
    $('[data-toggle="tooltip"]').each(function() {
      $(this).tooltip({
          container: $(this).parent(),
          fontSize: '8px',
          offset: 1
      });
    });
};
function DateTimeToDateObj(DATETIME) {
    if (DATETIME == null) return null;
    var parts = DATETIME.split(" ");
    var date = parts[0].split("/");
    var time = parts[1].split(":");
    var d1 = new Date(Number(date[2]), Number(date[1]) - 1, Number(date[0]), time[0], time[1]);
}

function DateTimeToUnixTimestamp(DATETIME) {
    if (DATETIME == null) return null;
    var parts = DATETIME.split(" ");
    var date = parts[0].split("/");
    var time = parts[1].split(":");
    if (isNaN(Number(time))) {
        let addHour = 0;
        if (time[1].indexOf('PM')>0) addHour = 12;
        time[1] = time[1].replace('AM','').replace('PM','');
        time[0] = parseInt(time[0]);
        time[0] += parseInt(addHour);
    };
    var d1 = new Date(Number(date[2]), Number(date[1]) - 1, Number(date[0]), time[0], time[1]);
    return d1.getTime() / 1000;
}
function DateToUnixTimestamp(DATETIME) {
    if (DATETIME == null) return null;
    var parts = DATETIME.split(" ");
    var date = parts[0].split("/");
    var d1 = new Date(Number(date[2]), Number(date[1]) - 1, Number(date[0]), 0, 0);
    return d1.getTime() / 1000;
}

function UnixTimeStampToDateTime(UNIX_timestamp, obj = false) {
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    var monthsStr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var momentDay = ['AM', 'PM'];
    var year = a.getFullYear();
    var date = a.getDate();
    var hourFormat = (a.getHours() + 24) % 12 || 12;
    var hour = (hourFormat<10)?'0'+hourFormat:hourFormat;
    var min = (a.getMinutes()<10)?'0'+a.getMinutes():a.getMinutes();
    var dateReturn = (!obj) ?  date + ' ' + monthsStr[a.getMonth()] + ', ' + year + ' ' + hour + ':' + min + ' ' + ((a.getHours()>=12)?momentDay[1]:momentDay[0]) : new Date(year, a.getMonth(), date, hour, min);
    return dateReturn;
}
function UnixTimeStampToDate(UNIX_timestamp, obj = false) {
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    var monthsStr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = a.getFullYear();
    var date = a.getDate();
    var dateReturn = (!obj) ?  date + ' ' + months[a.getMonth()] + ', ' + year: new Date(year, a.getMonth(), date);
    return dateReturn;
}

/* Prototype functions */
String.prototype.format = function() {
  a = this;
  for (k in arguments) {
    a = a.replace("{" + k + "}", arguments[k])
  }
  return a
}
var dateFormat = function () {
    var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
        timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
        timezoneClip = /[^-+\dA-Z]/g,
        pad = function (val, len) {
            val = String(val);
            len = len || 2;
            while (val.length < len) val = "0" + val;
            return val;
        };

    // Regexes and supporting functions are cached through closure
    return function (date, mask, utc) {
        var dF = dateFormat;

        // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
        if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
            mask = date;
            date = undefined;
        }

        // Passing date through Date applies Date.parse, if necessary
        date = date ? new Date(date) : new Date;
        if (isNaN(date)) throw SyntaxError("invalid date");

        mask = String(dF.masks[mask] || mask || dF.masks["default"]);

        // Allow setting the utc argument via the mask
        if (mask.slice(0, 4) == "UTC:") {
            mask = mask.slice(4);
            utc = true;
        }

        var _ = utc ? "getUTC" : "get",
            d = date[_ + "Date"](),
            D = date[_ + "Day"](),
            m = date[_ + "Month"](),
            y = date[_ + "FullYear"](),
            H = date[_ + "Hours"](),
            M = date[_ + "Minutes"](),
            s = date[_ + "Seconds"](),
            L = date[_ + "Milliseconds"](),
            o = utc ? 0 : date.getTimezoneOffset(),
            flags = {
                d:    d,
                dd:   pad(d),
                ddd:  dF.i18n.dayNames[D],
                dddd: dF.i18n.dayNames[D + 7],
                m:    m + 1,
                mm:   pad(m + 1),
                mmm:  dF.i18n.monthNames[m],
                mmmm: dF.i18n.monthNames[m + 12],
                yy:   String(y).slice(2),
                yyyy: y,
                h:    H % 12 || 12,
                hh:   pad(H % 12 || 12),
                H:    H,
                HH:   pad(H),
                M:    M,
                MM:   pad(M),
                s:    s,
                ss:   pad(s),
                l:    pad(L, 3),
                L:    pad(L > 99 ? Math.round(L / 10) : L),
                t:    H < 12 ? "a"  : "p",
                tt:   H < 12 ? "am" : "pm",
                T:    H < 12 ? "A"  : "P",
                TT:   H < 12 ? "AM" : "PM",
                Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
                o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
                S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
            };

        return mask.replace(token, function ($0) {
            return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
        });
    };
}();

// Some common format strings
dateFormat.masks = {
    "default":      "ddd mmm dd yyyy HH:MM:ss",
    shortDate:      "m/d/yy",
    mediumDate:     "mmm d, yyyy",
    longDate:       "mmmm d, yyyy",
    fullDate:       "dddd, mmmm d, yyyy",
    shortTime:      "h:MM TT",
    mediumTime:     "h:MM:ss TT",
    longTime:       "h:MM:ss TT Z",
    isoDate:        "yyyy-dd-nn",
    isoTime:        "HH:MM:ss",
    isoDateTime:    "yyyy-dd-mm'T'HH:MM:ss",
    isoUtcDateTime: "UTC:yyyy-dd-mm'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
    dayNames: [
        "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ],
    monthNames: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ]
};

// For convenience...
Date.prototype.format = function (mask, utc) {
    return dateFormat(this, mask, utc);
};

function isNumberKey(evt){
    var charCode = (evt.which) ? evt.which : evt.keyCode
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
};

function renderAutoCompleteCompany(nameObj, arrValues, apiPath) {
  var arrLabels = [];
  angular.forEach(arrValues, function(item, key){
    arrLabels.push(item.label);
  });
  $(nameObj).mdb_autocomplete({
    data:  arrLabels,
    formatItem: function (id) {
      return '<img src="'+((arrValues[id].avatar)?(apiPath+'/v1/common/viewFile?type=profile&file='+arrValues[id].avatar):'http://localhost:8080/assets/img/not-available-avatar.png')+'" height="30" class="avatar mr-2"/><span>'+arrValues[id].label+'</span>';
    }
  });
};

function getRandomString(length) {
    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var result = '';
    for ( var i = 0; i < length; i++ ) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
};

function loadJS(file, callback, error, type) {
    var _file = file ;
    var loaded = document.querySelector('script[src="'+file+'"]') ;

    if (loaded) {
      loaded.onload = callback ;
      loaded.onreadystatechange = callback;
      return
    }

    var script = document.createElement("script");

    script.type = (typeof type ==="string" ? type : "application/javascript") ;

    script.src = file;
    script.async = false ;
    script.defer = false ;
    script.onload = callback ;

    if (error) {
       script.onerror = error ;
    }
    else {
       script.onerror = function(e) {
         console.error("Script File '" + _file + "' not found :-(");
       };
    }

    script.onreadystatechange = callback;

    document.body.appendChild(script);
};
