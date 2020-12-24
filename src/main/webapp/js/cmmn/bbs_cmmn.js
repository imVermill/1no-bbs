$(document).ready(function(){

	jQuery.fn.load = function( url, params, callback ) {
		var selector, type, response,
		self = this,
		off = url.indexOf( " " );

		if ( off > -1 ) {
			selector = url.split(" ")[1];
			url = url.slice( 0, off );
		}

		// If it's a function
		if ( isFunction( params ) ) {

			// We assume that it's the callback
			callback = params;
			params = undefined;

			// Otherwise, build a param string
		} else if ( params && typeof params === "object" ) {
			type = "POST";
		}

		// If we have elements to modify, make the request
		if ( self.length > 0 ) {
			jQuery.ajax( {
				url: url,

				// If "type" variable is undefined, then "GET" method will be used.
				// Make value of this field explicit since
				// user can override it through ajaxSetup method
				type: type || "GET",
				dataType: "html",
				data: params
			} ).done( function( responseText ) {

				// Save response for use in complete callback
				response = arguments;

				self.html(responseText);

				// If the request succeeds, this function gets "data", "status", "jqXHR"
				// but they are ignored because response was set above.
				// If it fails, this function gets "jqXHR", "status", "error"
			} ).always( callback && function( jqXHR, status ) {
				self.each( function() {
					callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
				} );
			} );
		}

		return this;
	};

	function isFunction(functionToCheck) {
		var getType = {};
		return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
	}
});

// send post request with ajax
function sendAjax(reqUrl, reqData, reqType, callback){

	var rtnVal = {"result" : "E"};
	var callbackYn = false;

	if (!reqUrl) {
    	alertMsg('잘못된 요청입니다.\n관리자에게 문의하십시오.');
    	return rtnVal;
	}
	if (!reqData) {
		reqData == "";
	}
	if (!reqType || (reqType != "post" && reqType != "get")) {
		reqType == "post";
	}
	if (typeof callback == 'function') {
		callbackYn = true;
	}
    $.ajax({
        type : reqType,
        url : reqUrl,
        data : reqData,
        dataType : 'json',
        async : true,
        timeout : 0,
        contentType : 'application/json; charset=UTF-8'
    	})
    	.done(function(data, textStatus, jqXHR){
    		if (callbackYn) {
	            callback(data);
    		}else {
    			return data;
    		}
    	})
    	.fail(function(jqXHR, textStatus, errorThrown){
            console.log("error code : " + jqXHR.status );
            console.log("error text : " + jqXHR.statusText );

            var errCode = jqXHR.status;
            var errCodeText = jqXHR.statusText;
    	    var errText =  jqXHR.responseText;

    	    if(jqXHR.status == 0){
    	    	console.log('You are offline!!n Please Check Your Network.');
    	    	errCode = "000";
    	    }else if(jqXHR.status == 200){
    	    	if (errCodeText == "parsererror") {
    	    		if (errText.indexOf("Sign-In and try again") > -1) {
    	    	    	console.log("로그인 정보가 존재하지 않습니다. 다시 로그인해주십시오.");
    	    	    	errCode = "401";
    	    	    	errText = "로그인 정보가 존재하지 않습니다. 다시 로그인해주십시오.";
    	    		}
    	    	}
    	    }else if(jqXHR.status == 401){
    	    	console.log("로그인 정보가 존재하지 않습니다. 다시 로그인해주십시오.");
    	    	errCode = "401";
    	    	errText = "로그인 정보가 존재하지 않습니다. 다시 로그인해주십시오.";
    	    }else if(jqXHR.status == 404){
    	    	console.log('Requested URL not found.');
    	    	errCode = "404";
    	    	errText = "요청한 페이지가 존재하지 않습니다.";
    	    }else if(jqXHR.status == 500){
    	    	console.log('Internel Server Error.');
    	    	errCode = "500";
    	    	errText = "응용프로그램이 정상동작되지 않았습니다.";
    	    }else if(textStatus == 'timeout'){
    	    	console.log('Request Time out.');
    	    	errCode = "001";
    	    	errText = "요청한 처리가 지연되었습니다.";
    	    }else {
    	    	console.log('Unknow Error.n' + jqXHR.responseText);
    	    	errCode = "500";
    	    	errText = "응용프로그램이 정상동작되지 않았습니다.";
    	    }

    		rtnVal = {"result" : "E", "list" : null, "resultCode" : errCode, "resultMsg" : errText, "detailMsg" : errCodeText, "succUrl" : "", "failUrl" : ""};

    		if (callbackYn) {
	            callback(rtnVal);
    		}else {
    			errorMsg(errCode, errText);
    			return rtnVal;
    		}
        })
    	.always(function() {

    	});

}
