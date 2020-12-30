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
		
			callback = params;
			params = undefined;
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
        .always(function() { });

}

// hide modal function
function hideModal(modalId, callback, data) {
    hideCallback = null;
    hideData = null;

    var objModal = $("#" + modalId);
    if (!objModal) {
    	return ;
    }
	if (typeof callback == "function") {
		hideCallback = callback;
		if (data) {
    		hideData = data;
		}
	}

	objModal.modal("hide");
	objModal.children("div.modal-dialog").html("");
}


function showModalUrl(modalId, reqUrl, data, callback) {
    console.log("modalId [%s], reqUrl[%s], callback[%s]", modalId, reqUrl, callback);
	calledModalId = modalId;

	// init modal show info
    showCallback = null;
    showData = null;

	var objModal = $("#" + modalId);
    if (!objModal) {
    	return ;
    }
    var objDialog = $("#" + modalId + " .modal-dialog");
    if (!objDialog) {
    	return ;
    }
	if (typeof callback == "function") {
		showCallback = callback;
		if (data) {
			showData = data;
		}
	}

    objDialog.load(reqUrl + ' .modal-content', data,  function(response, status, jqXHR) {
    	if (status === "success") {
    		objModal.modal("show");
    	}else{
    		return;
    	}
    });

}

function closeModal(oBtn) {
	if(oBtn.id.indexOf("btnClose") > -1) {
		var openModalId = $(oBtn).data("target");
		if (openModalId) {
			if (calledModalId == openModalId) {
				hideModal(calledModalId);
			}else {
				hideModal(openModalId);
			}
		}else {
			hideModal(calledModalId);
		}
	}
}


function alertFocus(sType, sMsg, focusId) {
	alertMsg(sType, sMsg, "", "", focusId);
}

function alertMsg(sType, sMsg, sCallback, sSize, focusId) {

	var msgDialog;

	var ko = {
			OK      : '확인',
			CANCEL  : '취소',
			CONFIRM : '확인'
		};
	bootbox.addLocale('ko', ko);
	bootbox.setDefaults({
			locale: 'ko',
			closeButton: true
		});

	if (typeof sCallback != 'function') {
		sCallback = function(){};
	}
	if (!sSize || sSize == undefined) {
		sSize = null;
	}

	if (sType == "alert") {
		sTitle = '<i class="fas fa-question-circle fa-1x"></i> Alert';

		msgDialog = bootbox.dialog({
            title: sTitle
            ,message: sMsg
			,size : sSize
			,centerVertical : true
            ,buttons: {
                ok: {
                    label: '확인',
                    className: "btn-primary btn-sm",
                    callback: sCallback
                }
            }
        });
	}else if (sType == "info") {
		sTitle = '<i class="fas fa-exclamation-circle fa-1x"></i>  Information';

		msgDialog = bootbox.alert({
            title: sTitle
            ,message: sMsg
			,size : sSize
			,callback :  sCallback	// execute callback function before click ok button
			,centerVertical : true
            ,buttons: {
                ok: {
                    className: "btn-info btn-sm"
                }
            }
		});
	}else if (sType == "error") {
		sTitle = '<i class="fas fa-times-circle fa-1x"></i>  Error';

		msgDialog = bootbox.alert({
            title: sTitle
            ,message: sMsg
			,size : sSize
			,callback :  sCallback
			,centerVertical : true
            ,buttons: {
                ok: {
                    className: "btn-danger btn-sm"
                }
            }
		});
	}else if (sType == "confirm") {
		sTitle = '<i class="far fa-check-circle"></i>  Confirm';

		msgDialog = bootbox.confirm({
            title: sTitle
            ,message: sMsg
			,centerVertical : true
			,buttons : {
				cancel: {
		            label: '<i class="fa fa-times"></i> 취소'
		        },
		        confirm: {
		            label: '<i class="fa fa-check"></i> 확인'
		        }
			}
			,size : sSize
			,callback :  function(result) {
				sCallback(result);
			}
		});
	}

	msgDialog.on('hidden.bs.modal', function(e){
		console.log("call bootbox hidden!");
		// Do something with the dialog just after it has been shown to the user...
		var modalBody = $(".modal.fade.show");
		console.log("call bootbox hidden : " + modalBody );
		if (modalBody) {
			if (!$("body").hasClass("modal-open")) {
				$("body").addClass("modal-open { overflow-y:scroll; }");
			}
		}

		if (focusId && focusId != "" && typeof $("#" + focusId) == 'object') {
			$("#" + focusId).focus();
		}
	});


	var box = msgDialog.find('.modal-dialog');
	msgDialog.css('display', 'block');
	box.css("margin-top", Math.max(0, ($(window).height() - box.height()) / 2));

}

// DataTables Init.
function setDatatableDefault() {
	$.extend( true, $.fn.dataTable.defaults, {
	
		dom:"<'row'<'col-sm-12'l>>" +
			"<'table-cont'tr>" +
			"<'row'<'col-sm-8' i><'col-sm-4 text-right m-t-5'B>>" +
			"<'row'<'col-sm-12'p>>",
		paging:		true,
	    bLengthChange: false,	// page length change dropdown hide
	    lengthMenu:	[[10, 30, 50], [10, 30, 50]],
	    ordering:	false,
	    info:		false,
	    searching:	false,
	    select : {
	    	style: 'single',
	    	items: 'row',
	    	info: false
	    },
	    language: {
	        "info" : "<p>총 <span> _TOTAL_ </span> 건</p> ",
	        "infoEmpty":	  "0 / 0",
	        "infoFiltered":   "(총 건수 : _MAX_)",
	        "lengthMenu":	  "목록 개수 : _MENU_ ",
	        "decimal":        "",
	        "emptyTable":     "조회된 정보가 없습니다",
	        "infoPostFix":    "",
	        "thousands":      ",",
	        "loadingRecords": "Loading...",
	        "processing":     "Processing...",
	        "search":         "Search:",
	        "zeroRecords":    "일치하는 정보가 없습니다",
	        "paginate": {
	            "first":      "First",
	            "last":       "Last",
	            "next":       "Next",
	            "previous":   "Previous"
	        },
	        "aria": {
	            "sortAscending":  ": activate to sort column ascending",
	            "sortDescending": ": activate to sort column descending"
	        }
		},
		defaultContent: ""
	} );
}
