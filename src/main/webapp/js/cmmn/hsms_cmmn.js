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


//send form data to url
function sendFormUrl(reqUrl, reqData, reqType, reqTarget){

	if (!reqUrl || reqUrl == "") {
		alertMsg("alert", "이동할 URL 정보가 없습니다.");
		return ;
	}
	if (!reqType || reqType == "") {
		reqType = "post";
	}
	if (reqType != "get" && reqType != "post") {
		reqType = "post";
	}
	if (reqTarget && reqTarget != "") {
		reqTarget = " target='" + reqTarget + "'";
	}else {
		reqTarget = "";
	}

	var form = document.createElement('form');
    document.body.appendChild(form);
    form.method = reqType;
    form.action = reqUrl;
    if (reqTarget != "") {
    	form.target = reqTarget;
    }
    for (var key in reqData) {
        var input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = reqData[key];
        form.appendChild(input);
    }
    form.submit();

}



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
    	    		if (errText.indexOf("Sign in HSMS") > -1) {
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

//error code define and display message box
function requestMsg(resultCode) {
	if (resultCode || resultCode != "") {
		if (resultCode == "01") {
			alertMsg("error", "로그인 정보가 존재하지 않습니다. 다시 로그인해주십시오.");
		}else if (resultCode == "02") {
			alertMsg("error", "사용권한이 없습니다.");
		}else if (resultCode == "03") {
			alertMsg("error", "GPKI 인증 정보가 없습니다. 회원정보수정에서 GPKI 인증처리를 하시기 바랍니다.");
		}
	}

}

//error code define and display message box
function errorMsg(errCode, errorText) {
    if(errCode == "000"){
    	alertMsg("error", "오프라인 상태입니다. 네트워크상태를 확인하십시오.");
    	//alertMsg('오프라인 상태입니다. 네트워크상태를 확인하십시오.');
    }else if(errCode == "401"){
    	alertMsg("error", "로그인 정보가 존재하지 않습니다. 다시 로그인해주십시오.");
    }else if(errCode == "404"){
    	alertMsg("error", "요청한 페이지가 존재하지 않습니다.");
    }else if(errCode == "500"){
    	alertMsg("error", "응용프로그램이 정상동작되지 않았습니다.");
    }else if(errCode == '001'){
    	alertMsg("error", "요청한 처리가 지연되었습니다.");
    }else {
    	console.log('Error Message : ' + errorText);
    	alertMsg("error", errorText);
    }
}

//table bind data
function bindDataTable(oTable, data) {
	var result = data.result;

	var resultList = {};

	if (result) {
		var listData = data.list;
		if (listData) {
			resultList = listData;
		}
	}else {
		if (data) {
			resultList = data;
		}
	}
	oTable.clear();
	oTable.column().checkboxes.deselectAll();	// header select all 초기화.
	oTable.rows.add(resultList);
	oTable.draw();
}

// header checkbox 초기화. dataTables.checkboxes 시 사용. 오동작(전체 체크 등)
function clearHeaderCheck(oDt) {
	var $tContainer = $(oDt.table().container());
	var $oCheckSelectAll = $('.dt-checkboxes-select-all[data-col="0"] input[type="checkbox"]', $tContainer);

	$oCheckSelectAll.prop({
						"checked" : false
						,"indeterminate" : false
						});
}

// set default datatables
function setDatatableDefault() {
	$.extend( true, $.fn.dataTable.defaults, {
		/*
		dom:"<'row'<'col-sm-8'i><'col-sm-4 text-right'B>>" +
			"<'table-cont'tr>" +
			"<'row'<'col-sm-12'l>>" +
			"<'row'<'col-sm-12'p>>",
		*/
		dom:"<'row'<'col-sm-12'l>>" +
			"<'table-cont'tr>" +
			"<'row'<'col-sm-8' i><'col-sm-4 text-right m-t-5'B>>" +
			"<'row'<'col-sm-12'p>>",
		paging:   true,
	    bLengthChange: false,	// page length change dropdown hide
	    lengthMenu: [[10, 30, 50], [10, 30, 50]],
	    ordering: false,
	    info:     false,
	    searching : false,
	    select : {
	    	style: 'single',
	    	items: 'row',
	    	info: false
	    },
	    language: {
	        "info" : "<p>총 <span> _TOTAL_ </span> 건</p> ",
	        "infoEmpty" : "0 / 0",
	        "infoFiltered" : "(총 건수 : _MAX_)",
	        "lengthMenu" : "목록 개수 : _MENU_ ",
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

function initDataTable(tableInfo) {
	var tId = tableInfo.id;
	if (typeof tId == "undefined" || tId == null || tId == "" || !tId) {
		alertMsg("alert", "Required Table ID");
		return ;
	}
	var tCols = tableInfo.columns;
	if (typeof tCols == "undefined" || tCols == null || tCols == "" || !tCols) {
		alertMsg("alert", "Required Table Columns");
		return ;
	}else {
		if (!Array.isArray(tCols) || tCols.length < 1) {
			alertMsg("alert", "Required Table Columns");
			return ;
		}
	}
	var tColDef = tableInfo.colDef;
	var tSelect = tableInfo.select;
	var tPaging = isBoolean(tableInfo.paging) ? tableInfo.paging : true;
	var tLengthChange = isBoolean(tableInfo.bLengthChange) ? tableInfo.bLengthChange : false;
	var tInfo = isBoolean(tableInfo.info) ? tableInfo.info : false;
	var tSearching = isBoolean(tableInfo.searching) ? tableInfo.searching : false;
	var tLengthMenu = [[10, 30, 50], [10, 30, 50]];
	if (Array.isArray(tableInfo.lengthMenu) && tableInfo.lengthMenu.length > 0) {
		tLengthMenu = tableInfo.lengthMenu;
	}
	var tOrdering = isBoolean(tableInfo.ordering) ? tableInfo.ordering : false;
	var tScrollY = isEmpty(tableInfo.scrollY) ? "" : tableInfo.scrollY;

	var arrBtn = new Array();
	var tBtn = tableInfo.buttons;
	if (typeof tBtn != "undefined" && tBtn != null && tBtn != "" && Array.isArray(tBtn) && tBtn.length > 0) {
		for (var i = 0 ; i < tBtn.length ; i++) {
			var oBtn = tBtn[i];
			if (nvl(oBtn.buttonType) == "copy" ) {
				if (isBoolean(oBtn.callback) == true) {
					arrBtn.push({	extend : "copy", text : "<i class='far fa-copy'></i> " + (isNvl(oBtn.title) ? "Copy" : oBtn.title), className : "btn-sm"
						, exportOptions : (oBtn.exportOptions && typeof oBtn.exportOptions == "object" ) ? oBtn.exportOptions : {}
						, action : function(e, dt, node, config) {
							var fn = window[camelize("callback " + node[0].innerText)];
							if (typeof fn == "function") {
								fn(this, e, dt, node, config);
							}else {
								$.fn.dataTable.ext.buttons.copyHtml5.action.call(this, e, dt, node, config);
							}
						}
					});
				}else {
					arrBtn.push({	extend : "copy", text : "<i class='far fa-copy'></i> " + (isNvl(oBtn.title) ? "Copy" : oBtn.title), className : "btn-sm"});
				}
			}else if (nvl(oBtn.buttonType) == "csv" ) {
				if (isBoolean(oBtn.callback) == true) {
					arrBtn.push({	extend : "csv", text : "<i class='fas fa-file-csv'></i> " + (isNvl(oBtn.title) ? "CSV" : oBtn.title), className : "btn-sm"
						, exportOptions : (oBtn.exportOptions && typeof oBtn.exportOptions == "object" ) ? oBtn.exportOptions : {}
                        , filename: oBtn.filename
						, action : function(e, dt, node, config) {
							var fn = window[camelize("callback " + node[0].innerText)];
							if (typeof fn == "function") {
								fn(this, e, dt, node, config);
							}else {
								$.fn.dataTable.ext.buttons.csvHtml5.action.call(this, e, dt, node, config);
							}
						}
					});
				}else {
					arrBtn.push({	extend : "csv", text : "<i class='fas fa-file-csv'></i> " + (isNvl(oBtn.title) ? "CSV" : oBtn.title), className : "btn-sm"});
				}
			}else if (nvl(oBtn.buttonType) == "excel" ) {
				if (isBoolean(oBtn.callback) == true) {
					arrBtn.push({	extend : "excel", text : "<i class='fas fa-file-excel'></i> " + (isNvl(oBtn.title) ? "Excel" : oBtn.title), className : "btn-sm"
						, exportOptions : (oBtn.exportOptions && typeof oBtn.exportOptions == "object" ) ? oBtn.exportOptions : {}
                        , filename: oBtn.filename
                        , messageTop : oBtn.messageTop
						, action : function(e, dt, node, config) {
							var fn = window[camelize("callback " + node[0].innerText)];
							if (typeof fn == "function") {
								fn(this, e, dt, node, config);
							}else {
								$.fn.dataTable.ext.buttons.excelHtml5.action.call(this, e, dt, node, config);
							}
						}
					});

                    console.dir(arrBtn);
				}else {
					arrBtn.push({	extend : "excel", text : "<i class='fas fa-file-excel'></i> " + (isNvl(oBtn.title) ? "Excel" : oBtn.title), className : "btn-sm"});
				}
			}else if (nvl(oBtn.buttonType) == "pdf" ) {
				if (isBoolean(oBtn.callback) == true) {
					arrBtn.push({	extend : "pdf", text : "<i class='far fa-file-pdf'></i> " + (isNvl(oBtn.title) ? "PDF" : oBtn.title), className : "btn-sm"
						, exportOptions : (oBtn.exportOptions && typeof oBtn.exportOptions == "object" ) ? oBtn.exportOptions : {}
                        , filename: oBtn.filename
						, action : function(e, dt, node, config) {
							var fn = window[camelize("callback " + node[0].innerText)];
							if (typeof fn == "function") {
								fn(this, e, dt, node, config);
							}else {
								$.fn.dataTable.ext.buttons.pdfHtml5.action.call(this, e, dt, node, config);
							}
						}
					});
				}else {
					arrBtn.push({	extend : "pdf", text : "<i class='far fa-file-pdf'></i> " + (isNvl(oBtn.title) ? "PDF" : oBtn.title), className : "btn-sm"});
				}
			}else if (nvl(oBtn.buttonType) == "print" ) {
				if (isBoolean(oBtn.callback) == true) {
					arrBtn.push({	extend : "print", text : "<i class='fas fa-print'></i> " + (isNvl(oBtn.title) ? "Print" : oBtn.title), className : "btn-sm"
						, exportOptions : (oBtn.exportOptions && typeof oBtn.exportOptions == "object" ) ? oBtn.exportOptions : {}
						, action : function(e, dt, node, config) {
							var fn = window[camelize("callback " + node[0].innerText)];
							if (typeof fn == "function") {
								var rtnVal = fn(this, e, dt, node, config);
								if (rtnVal) {
									$.fn.dataTable.ext.buttons.print.action.call(this, e, dt, node, config);
								}
							}else {
								$.fn.dataTable.ext.buttons.print.action.call(this, e, dt, node, config);
							}
						}
					});
				}else {
					arrBtn.push({	extend : "print", text : "<i class='fas fa-print'></i> " + (isNvl(oBtn.title) ? "Print" : oBtn.title), className : "btn-sm"});
				}
			}else if (nvl(oBtn.buttonType) == "button" ) {
				if (nvl(oBtn.title) != "" && isBoolean(oBtn.callback) == true) {
					arrBtn.push({	text : "" + oBtn.title, className : "btn-sm"
						, action : function(e, dt, node, config) {
										var fn = window[camelize("callback " + node[0].innerText)];
										if (typeof fn == "function") {
											fn(this, e, dt, node, config);
										}
									}
					});
				}
			}
		}//end for
	}

	 //$.fn.dataTable.ext.buttons.csvHtml5.action.call(this, e, dt, node, config);

	if ( $.fn.DataTable.isDataTable("#" + tId) ) {
		  $("#" + tId).DataTable().destroy();
		}

	$("#" + tId + " tbody").empty();

	var oDataTable = $("#" + tId).DataTable({
		paging:   tPaging,
	    bLengthChange: tLengthChange,	// page length change dropdown hide
	    info:     tInfo,
	    searching : tSearching,
	    lengthMenu: tLengthMenu,
	    ordering: tOrdering,
	    select: tSelect,
	    scrollY: tScrollY,
	    columns : tCols,
	    columnDefs : tColDef,
	    buttons : arrBtn,
	    destroy : true
		});

	return oDataTable;
}

(function($, window, document, undefined) {
	$(document).ready(function() {

	    // modal show 호출 시, modal 화면 표시전
	    $('.modal').on('show.bs.modal', function (event) {
	    	console.log("show.bs.modal call ------------------------------");
	    	// multi modal backdrop
	    	var zIndex = 1040 + (10 * $('.modal:visible').length);
	    	$(this).css('z-index', zIndex);
	    	setTimeout(function() {
	    			$('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
	    		}, 0);

	    	//position move
	    	if (modalCnt > 0) {
	    		$(this).find('.modal-content').css("margin-top", modalCnt * 70);
	    		$(this).find('.modal-content').css("margin-left", modalCnt * 70);
	    	}

		})

	    // modal 화면 표시 후
	    $('.modal').on('shown.bs.modal', function (event) {
	    	console.log("shown.bs.modal call ------------------------------");

	    	// 향후 주석 처리 필요
	    	$(this).find('.modal-dialog').css({width:'auto', height:'auto', 'max-height':'100%'});

	    	var modalId = this.id;
	    	if (modalId == calledModalId) {
	    		if (typeof showCallback == "function") {
	    			if (showData) {
	        			showCallback(showData);
	    			}else {
	    				showCallback();
	    			}
	    		}
	    	}

	    	modalCnt++;
	    })

	    // modal hide 호출 시 즉시
	    $('.modal').on('hide.bs.modal', function (event) {
	    	console.log("hide.bs.modal call ------------------------------");
	    })

	    // modal 화면 종료 후
	    $('.modal').on('hidden.bs.modal', function (event) {
	    	console.log("hidden.bs.modal call ------------------------------");

	    	if ($('.modal:visible').length > 0) {
	    		setTimeout(function() {
	    				$(document.body).addClass('modal-open');
	    			}, 0);
	    	}

	    	var modalId = this.id;
	    	if (modalId == calledModalId) {
	    		calledModalId = "";
	    		if (typeof hideCallback == "function") {
	    			if (hideData) {
	        			hideCallback(hideData);
	    			}else {
	        			hideCallback();
	    			}
	    		}
	    	}

			if (modalCnt > 0) {
				modalCnt--;
			}

			$(this).find("div.modal-dialog").html("");

		})

});

})(jQuery, window, document);

	var calledModalId = null;
	var showCallback = null;
	var showData = null;
	var hideCallback = null;
	var hideData = null;

	var modalCnt = 0;

	function showModal(modalId, callback, data) {
		calledModalId = modalId;

		// init modal show info
	    showCallback = null;
	    showData = null;

		var objModal = $("#" + modalId);
	    if (!objModal) {
	    	return ;
	    }

		if (typeof callback == "function") {
			showCallback = callback;
			if (data) {
				showData = data;
			}
		}

		objModal.modal("show");
	}

	// hide modal function
	function hideModal(modalId, callback, data) {
		
		// init modal hide info
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



	/**
	 * Bootbox message popup control
	 */

	var focusId = null;

	function setFocusId(fId) {
		focusId = fId;
	}

	//set html object focus
	function setHtmlFocus() {
		console.log("call setHtmlFocus");

		objHtml = focusId;

		if (typeof objHtml == "object") {
    		setTimeout(function(){
    			focusId = null;
        		objHtml.focus();
            }, 100);
    	}else {
    		objHtml = findObject(objHtml);
    		if (typeof objHtml == "object") {
        		setTimeout(function(){
        			focusId = null;
        			objHtml.focus();
                }, 100);
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

	// jqgrid 초기화
	function initJQgrid(gridId, gridInfo) {
	    var ogrid = $(gridId).jqGrid({
	        colModel: gridInfo.columns,
	        guiStyle: "bootstrap4",
	        iconSet: "fontAwesome",
	        idPrefix: "gb1_",
	        rownumbers: true,
	        sortname: "invdate",
	        sortorder: "desc",
	        pager: true,
	        rowNum: 10,
	        rowList: [10, 20, 30, 50],
	        viewrecords: true,
	        height: 350,
	        loadComplete: function() {
	        	/*
	        	below code is good work. but modified css file(.ui-jqgrid tr.jqgrow > td)
	            var grid = $("#example");
	            var ids = grid.getDataIDs();
	            for (var i = 0; i < ids.length; i++) {
	                grid.setRowData ( ids[i], false, {height: 35} );
	            }
	            */
	            //grid.setGridHeight('auto');
	        }
	    	, onSelectRow: function(rowid, status, e) {
	    		//alert("rowid : " + rowid + " / status : " + status);
	    	}
	    });
	    // exTable.jqGrid('navGrid','#listPaging',{edit:false,add:false,del:false,search:false});
	    var htable = jQuery(".ui-jqgrid .ui-jqgrid-htable th");
	    // htable.css ("height", 100);
	    // defined style function in hsms.js
	    htable.style("height", "35px", "important");
	    jQuery(".ui-jqgrid-pager").style("height", "35px", "important");

	    return ogrid;
	};


	//jqGrid bind data
	function bindJQgrid(jqgrid, listData) {
    	var resultList = {};

    	if (listData) {
   			resultList = listData;
    	}
    	jqgrid.jqGrid("clearGridData", true);
    	jqgrid.jqGrid('setGridParam', {
                datatype : 'local',
                data : resultList
            }).trigger("reloadGrid");
	}

	//find html object by id or name
	function findObject(strObj) {
		if (isEmpty(strObj)) {
			return null;
		}
		var objById = $("#" + strObj);
		var objByName = $(strObj);
		var objByClass = $("." + strObj);
    	if (typeof objById == "object") {
    		return objById;
    	}else if (typeof objByName == "object") {
    		return objByName;
    	}else if (typeof objByClass == "object") {
    		return objByClass;
    	}else {
    		return null;
    	}
	}

	// clear data for modal
	function clearModal(mId) {
		$("#" + mId).find("input,textarea,select").val('').end();

		$("#" + mId).find("input[type=checkbox], input[type=radio]").prop("checked", "").end();
	}

	// clear data for form
	function clearForm(fId) {
		$("#" + fId)[0].reset();
	}

	// selectbox binding sample data
	var parentData = [
		 {"pcode" : "", "code" : "a", "name" : "number"}
		,{"pcode" : "", "code" : "b", "name" : "serial"}
	];

	// selectbox binding sample data
	var childData = [
		{"pcode" : "a", "code" : "1", "name" : "one"}
		,{"pcode" : "a", "code" : "2", "name" : "two"}
		,{"pcode" : "a", "code" : "3", "name" : "three"}
		,{"pcode" : "b", "code" : "1", "name" : "first"}
		,{"pcode" : "b", "code" : "2", "name" : "second"}
		,{"pcode" : "b", "code" : "3", "name" : "third"}
		];

	jQuery.fn.extend({
		// To get common code json data, this function is called by ajax url and then set json data in select option
		setCodeData: function(codeId, upperCode, firstData, callback, useYn) {

			if (!(this.is("select") || this.is("SELECT"))) {
				return ;
			}
			var selObj = this;
			var asyncYn = true;
			if(firstData == "" || firstData == undefined){
				asyncYn = false;
			}
			$(this).empty();

			var codeParam = {"codeId" : codeId, "useYn" : "Y"};
			if (upperCode && upperCode != "") {
				codeParam.upperCode = upperCode;
			}
			if (useYn && useYn == "A") {
				codeParam.useYn = "";
			}

			var callbackYn = false;

			if (typeof callback == 'function') {
				callbackYn = true;
			}

		    $.ajax({
		        type : "post",
		        url : "/cmmn/retrieveCodeListAjax.do",
		        async:asyncYn,
		        data : JSON.stringify(codeParam),
		        dataType : 'json',
                context: this,
		        contentType : 'application/json; charset=UTF-8'
		    	})
		    	.done(function(data, textStatus, jqXHR){
		            //console.log("success data : " + data);
		            if (data && data.result && data.result == "S") {
		            	if (data.list) {
				            selObj.setJsonData(data.list, firstData);
		            	}
		            }
		    	})
		    	.fail(function(jqXHR, textStatus, errorThrown){
		            console.log("error code : " + jqXHR.status );
		            console.log("error text : " + jqXHR.statusText );
		        })
		    	.always(function(data, textStatus, jqXHR) {
		    		if (data && data.result && data.result == "S") {
		            	if (data.list) {
							if (callbackYn) {
						        callback(data);
							}
		            	}
		            }
		    	});
		},
		// To get common code json data, this function is called by ajax url and then set json data in select option
		setNfaCodeData: function(cdGrp, upperCdGrp, firstData, callback, useYn) {

			if (!(this.is("select") || this.is("SELECT"))) {
				return ;
			}

			var selObj = this;
			var asyncYn = true;
			if(firstData == "" || firstData == undefined){
				asyncYn = false;
			}
			$(this).empty();

			var codeParam = {"cdGrp" : cdGrp, "useYn" : "Y"};
			if (upperCdGrp && upperCdGrp != "") {
				codeParam.upperCdGrp = upperCdGrp;
			}
			if (useYn && useYn == "A") {
				codeParam.useYn = "";
			}

			var callbackYn = false;

			if (typeof callback == 'function') {
				callbackYn = true;
			}

		    $.ajax({
		        type : "post",
		        url : "/cmmn/retrieveNfaCodeListAjax.do",
		        async:asyncYn,
		        data : JSON.stringify(codeParam),
		        dataType : 'json',
		        contentType : 'application/json; charset=UTF-8'
		    	})
		    	.done(function(data, textStatus, jqXHR){
		            //console.log("success data : " + data);
		            if (data && data.result && data.result == "S") {
		            	if (data.list) {
				            selObj.setJsonData(data.list, firstData);
		            	}
		            }
		    	})
		    	.fail(function(jqXHR, textStatus, errorThrown){
		            console.log("error code : " + jqXHR.status );
		            console.log("error text : " + jqXHR.statusText );
		        })
		    	.always(function(data, textStatus, jqXHR) {
		    		if (data && data.result && data.result == "S") {
		            	if (data.list) {
							if (callbackYn) {
						        callback(data);
							}
		            	}
		            }
		    	});
		},
		setCodeDefined: function(codeId, code, firstData, qParam, callback) {

			if (!(this.is("select") || this.is("SELECT"))) {
				return ;
			}

			var selObj = this;
			var asyncYn = true;
			if(firstData == "" || firstData == undefined){
				asyncYn = false;
			}
			$(this).empty();

			var codeParam = {"codeId" : codeId, "code" : code};
			if (qParam && typeof qParam == "object") {
				codeParam = {"codeId" : codeId, "code" : code, "queryParam" : qParam};
			}

			var callbackYn = false;

			if (typeof callback == 'function') {
				callbackYn = true;
			}

		    $.ajax({
		        type : "post",
		        url : "/cmmn/retrieveCodeDefinedAjax.do",
		        async:asyncYn,
		        data : JSON.stringify(codeParam),
		        dataType : 'json',
		        contentType : 'application/json; charset=UTF-8'
		    	})
		    	.done(function(data, textStatus, jqXHR){
		            //console.log("success data : " + data);
		            if (data && data.result && data.result == "S") {
		            	if (data.list) {
				            selObj.setJsonData(data.list, firstData);
		            	}
		            }
		    	})
		    	.fail(function(jqXHR, textStatus, errorThrown){
		            console.log("error code : " + jqXHR.status );
		            console.log("error text : " + jqXHR.statusText );
		        })
		    	.always(function(data, textStatus, jqXHR) {
		    		if (data && data.result && data.result == "S") {
		            	if (data.list) {
							if (callbackYn) {
						        callback(data);
							}
		            	}
		            }
		    	});
		},
		// set json data in selectbox
		setJsonData: function(jsonData, firstData) {

			if (!(this.is("select") || this.is("SELECT"))) {
				return ;
			}

			var selObj = this;

			$(this).empty();

			if (firstData) {
				if (firstData.toLowerCase() == "all") {
					selObj.append('<option value="" pcode="">전체</option>');
				}else if (firstData.toLowerCase() == "empty") {
					selObj.append('<option value="" pcode=""></option>');
				}else if (firstData.toLowerCase() == "choose") {
					selObj.append('<option value="" pcode="">선택</option>');
				}else {
					if (firstData != "") {
						var firstOpt = firstData.split(":");
						if (firstOpt.length == 3) {
							selObj.append('<option value="' + firstOpt[0] + '" pcode="' + firstOpt[1] + '">' + firstOpt[2] + '</option>');
						}else if (firstOpt.length == 2) {
							selObj.append('<option value="' + firstOpt[0] + '" pcode="">' + firstOpt[1] + '</option>');
						}else {
							selObj.append('<option value="" pcode="">' + firstOpt[0] + '</option>');
						}
					}
				}
			}

			if (jsonData.length > 0) {
				$.each(jsonData, function(i, codeData) {
					var pCd = codeData.pcode;
					if (!pCd) {
						pCd = "";
					}
					if (!codeData.code || !codeData.name) {
						return true;
					}
					selObj.append('<option value="' + codeData.code + '" pcode="' + pCd + '">' + codeData.name + '</option>');	// attr 사용
					//var $option = $("<option/>", {value: codeData.code, pcode: pCd, text: codeData.name});						// prop 사용
					//selObj.append($option);
					//selObj.append($("<option></option>").prop("value", codeData.code).prop("pcode", pCd).text(codeData.name));	// prop 사용
					//selObj.append($("<option></option>").prop("value", codeData.code).attr("pcode", pCd).text(codeData.name));	// attr 사용
				});
				// 0th option selected
				$("option:eq(0)", selObj).prop("selected", true);
			}
		},
		// when parent selectbox is selected,
		// child selectbox initialize option data that pcode data is same with parent value.
		// ex) parentSelect.setBindData(childSelect) code insert parentSelect onchange event.
		setBindData: function(bindId, callback) {

			if (!(this.is("select") || this.is("SELECT"))) {
				return ;
			}
			var bindSel = $("#" + bindId);
			if (!(bindSel.is("select") || bindSel.is("SELECT"))) {
				return ;
			}

			var selVal = $("option:selected", this).val();

			$("#" + bindId).find("option").each(function() {
				if (!selVal || selVal == "") {
					// ie 판별
					var agent = navigator.userAgent.toLowerCase();
					if ( (navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (agent.indexOf("msie") != -1) ) {
				        if (this.nodeName.toUpperCase() === 'OPTION') {
				            var span = $(this).parent();
				            var opt = this;
				            if($(this).parent().is('span')) {
				                $(opt).show();
				                $(span).replaceWith(opt);
				            }
				        }
					}else {
				        $(this).show(); //all other browsers use standard .show()
					}
					//$(this).show();
					return true;
				}
				//var pCd = $(this).prop("pcode");
				var pCd = $(this).attr("pcode");
				if (!pCd || pCd == "") {
					return true;		// continue
				}else if (pCd == selVal) {
					// ie 판별
					var agent = navigator.userAgent.toLowerCase();
					if ( (navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (agent.indexOf("msie") != -1) ) {
				        if (this.nodeName.toUpperCase() === 'OPTION') {
				            var span = $(this).parent();
				            var opt = this;

				            if($(this).parent().is('span')) {
				                $(opt).show();
				                $(span).replaceWith(opt);
				            }
				        }
					}else {
				        $(this).show(); //all other browsers use standard .show()
					}
					//$(this).show();
				}else {
					if ($(this).is('option') && (!$(this).parent().is('span'))) {
						var bIE = false;
						// ie 판별
						var agent = navigator.userAgent.toLowerCase();
						if ( (navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (agent.indexOf("msie") != -1) ) {
							bIE = true;
						}
				        //$(this).wrap((bIE == true) ? '<span>' : null).hide();
						if (bIE) {
					        $(this).wrap('<span>').hide();
						}else {
							$(this).hide();
						}
					}
				}
				// 이전 선택 속성 삭제
				$(this).prop('selected', false);
				//console.log("option value : " + $(this).val() + " / text : " + $(this).text() + " / selected : " + $(this).prop("selected"));
			    //alert(this.text + ' ' + this.value);
			});

            var pcode = $(this).attr("pcode");
			if ((!selVal || selVal == "")||(!pcode || pcode == "")) {
				$("option:eq(0)", bindSel).prop("selected", true);
			}else {
				$("option[pcode=" + selVal + "]:eq(0)", bindSel).prop("selected", true);
			}

			if (callback && typeof callback === "function") {
				callback();
			}

		 },
		// select option remove all.
		removeOptionAll: function() {
			if (!(this.is("select") || this.is("SELECT"))) {
				return ;
			}

			$(this).find("option").remove();
			$(this).find("OPTION").remove();

		},
		// select option remove except first data.
		removeOptionExceptFirst: function() {
			if (!(this.is("select") || this.is("SELECT"))) {
				return ;
			}

			$(this).find("option").not("[value='']").remove();
			$(this).find("OPTION").not("[value='']").remove();

		},
        // select option remove first data. SKM추가
        // 옵션첫번째를 지워준다.
        removeOptionFirst: function() {
            if (!(this.is("select") || this.is("SELECT"))) {
                return ;
            }

            $(this).find("option[value='']").remove();
            $(this).find("OPTION[value='']").remove();
        },
		// html object disabled.
		setDisabled: function(bDisabled) {
			if (this) {
				if (bDisabled) {
					$(this).prop("disabled", bDisabled);
				}else {
					$(this).prop("disabled", bDisabled);
				}
			}
		}
	});

	// 특정 class 로 화면 이동
	function moveToModal(classNm){
		//console.log(classNm);
        var childOffset = $("." + classNm).offset();
        var parentOffset = $("." + classNm).parent().offset();

        if(typeof childOffset == 'undefined' || typeof parentOffset == 'undefined'){
        	return;
        }

        $('.content').animate(
        		{scrollTop : childOffset.top - parentOffset.top}
        		, 400);
    }

	/**
	 * check boolean parameter.
	 */
	function isBoolean(bool) {
		if (bool == null || typeof bool != "boolean") {
			return false;
		}
		 return true;
	}

	/**
	 * Javascript common utility function
	 */
	function isNvl(str) {
		if (typeof str == "undefined" || str == null || str.replace(/ /gi,"") == "") {
			return true;
		}
		 return false;
	}

	/*문자열 공백제거*/
	function trim(str) {
		if( str == null ) {
			return "";
		}

		str = str.replace(/^\s*/,'').replace(/\s*$/, '');
		return str;
	}


    /**
     * 문자열이 빈 문자열인지 체크하여 결과값을 리턴한다.
     * @param str       	: 체크할 문자열
     */
    function isEmpty(str){

        if(typeof str == "undefined" || str == null || str == "null" || str == "" ||  str.trim()=="")
            return true;
        else
            return false ;
    }

    /**
     * 문자열이 빈 문자열인지 체크하여 기본 문자열로 리턴한다.
     * @param str           : 체크할 문자열
     * @param defaultStr    : 문자열이 비어있을경우 리턴할 기본 문자열
     */
    function nvl(str, defaultStr){

        if(typeof str == "undefined" || str == null || str == "null" || str == "") {
        	if(typeof defaultStr == "undefined" || defaultStr == null) {
                defaultStr = "" ;
        	}
            str = defaultStr ;
        }

        return str ;
    }

    /**
     * Date의 String 리턴. format "YYYYMMDD", "YYYY-MM-DD", "YYYY/MM/DD"
     * @param date           : Date
     * @param delimiter    : 구분자(공백, "-", "/" 등)
     */
    function getDateYyyyMmDd(date, delimiter){
    	return date.getFullYear() + delimiter + ("0" + (date.getMonth() + 1)).slice(-2) + delimiter + ("0" + date.getDate()).slice(-2);
    }

    /**
     * Date의 String 리턴. format "YYMMDD", "YY-MM-DD", "YY/MM/DD"
     * @param date           : Date
     * @param delimiter    : 구분자(공백, "-", "/" 등)
     */
    function getDateYyMmDd(date, delimiter){
    	return ("" + date.getFullYear()).slice(-2) + delimiter + ("0" + (date.getMonth() + 1)).slice(-2) + delimiter + ("0" + date.getDate()).slice(-2);
    }

    /**
     * Date의 String 리턴. format "YYYYMM", "YYYY-MM", "YYYY/MM"
     * @param date           : Date
     * @param delimiter    : 구분자(공백, "-", "/" 등)
     */
    function getDateYyyyMm(date, delimiter){
    	return date.getFullYear() + delimiter + ("0" + (date.getMonth() + 1)).slice(-2);
    }



	/*
	 * Camel 표기, 공백 뒤 한문자를 대문자로 변경
	 * javascript expression --> javascriptExpression
	 */
    function camelize(str) {
        return str.replace(/\W+(.)/g, function(match, chr) { return chr.toUpperCase(); });
    }

    /**
     * converted stringify() to jQuery plugin.
     * serializes a simple object to a JSON formatted string.
     * Note: stringify() is different from jQuery.serialize() which URLEncodes form elements
     * UPDATES:
     *      Added a fix to skip over Object.prototype members added by the prototype.js library
     * USAGE:
     *  jQuery.ajax({
     *	    data : {serialized_object : jQuery.stringify (JSON_Object)},
     *		success : function (data) {
     *
     *		}
     *   });
     *
     * CREDITS: http://blogs.sitepointstatic.com/examples/tech/json-serialization/json-serialization.js
     */
    jQuery.extend({
        objToString  : function objToString(obj) {
            var t = typeof (obj);
            if (t != "object" || obj === null) {
                // simple data type
                if (t == "string") obj = '"' + obj + '"';
                return String(obj);
            } else {
                // recurse array or object
                var n, v, json = [], arr = (obj && obj.constructor == Array);

                for (n in obj) {
                    v = obj[n];
                    t = typeof(v);
                    if (obj.hasOwnProperty(n)) {
                        if (t == "string") v = '"' + v + '"'; else if (t == "object" && v !== null) v = jQuery.objToString(v);
                        json.push((arr ? "" : '"' + n + '":') + String(v));
                    }
                }
                return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
            }
        }
    });

    (function($) {
		if ($.fn.style) {
			return;
		}

		// Escape regex chars with \
		var escape = function(text) {
			return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
		};

		// For those who need them (< IE 9), add support for CSS functions
		var isStyleFuncSupported = !!CSSStyleDeclaration.prototype.getPropertyValue;
		if (!isStyleFuncSupported) {
			CSSStyleDeclaration.prototype.getPropertyValue = function(a) {
				return this.getAttribute(a);
			};
			CSSStyleDeclaration.prototype.setProperty = function(styleName, value,
					priority) {
				this.setAttribute(styleName, value);
				var priority = typeof priority != 'undefined' ? priority : '';
				if (priority != '') {
					// Add priority manually
					var rule = new RegExp(escape(styleName) + '\\s*:\\s*'
							+ escape(value) + '(\\s*;)?', 'gmi');
					this.cssText = this.cssText.replace(rule, styleName + ': '
							+ value + ' !' + priority + ';');
				}
			};
			CSSStyleDeclaration.prototype.removeProperty = function(a) {
				return this.removeAttribute(a);
			};
			CSSStyleDeclaration.prototype.getPropertyPriority = function(styleName) {
				var rule = new RegExp(escape(styleName)
						+ '\\s*:\\s*[^\\s]*\\s*!important(\\s*;)?', 'gmi');
				return rule.test(this.cssText) ? 'important' : '';
			}
		}

		// The style function
		$.fn.style = function(styleName, value, priority) {
			// DOM node
			var node = this.get(0);
			// Ensure we have a DOM node
			if (typeof node == 'undefined') {
				return this;
			}
			// CSSStyleDeclaration
			var style = this.get(0).style;
			// Getter/Setter
			if (typeof styleName != 'undefined') {
				if (typeof value != 'undefined') {
					// Set style property
					priority = typeof priority != 'undefined' ? priority : '';
					style.setProperty(styleName, value, priority);
					return this;
				} else {
					// Get style property
					return style.getPropertyValue(styleName);
				}
			} else {
				// Get CSSStyleDeclaration
				return style;
			}
		};
    })(jQuery);


	//소방청 공통 유효성검사 함수(검사항목, 검사유형:추가옵션 값:유효성검사 실패 시 나타낼 메시지)
	function hsmsValidate(objId, options, focusYn){
		var obj = $("#" + objId);
		var objVal = obj.val();
		var regExpType = options.split(':')[0].toLowerCase();
		var etcOpt = options.split(':')[1];
		var altMsg = options.split(':')[2];

		var result = true;

		switch(regExpType){
            case 'required' :
                if(isEmpty(objVal)) result = false;

                break;
			case 'minmax' :
				result = new RegExp(eval("/^.{"+etcOpt.split("|")[0]+","+etcOpt.split("|")[1]+"}$/")).test(objVal);
				while(altMsg.indexOf("#%") > -1){
					altMsg = altMsg.replace("#%",etcOpt.split("|")[0]);
				}

				while(altMsg.indexOf("%#") > -1){
					altMsg = altMsg.replace("%#",etcOpt.split("|")[1]);
				}
				break;
			case 'email' :
				result = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(objVal)
				break;
			case 'iso8601' :
				result = new RegExp(/^\d{4}-([0]\d|1[0-2])-([0-2]\d|3[01])$/).test(objVal);
				break;
			case 'numeric' :
				result = new RegExp(eval("/^[0-9]{1," + etcOpt + "}$/")).test(objVal);
				break;
			case 'numericwithcomma' :
				result = new RegExp(eval("/^[0-9,]{1," + etcOpt + "}$/")).test(objVal);
				/*result = new RegExp(eval("/^[1-9][0-9,]{1," + etcOpt + "}$/")).test(objVal);*/
				break;
			case 'double' :
				result = new RegExp(eval("/^[0-9]{1," + etcOpt.split("|")[0] + "}([.][0-9]{" + etcOpt.split("|")[1] + "})?$/")).test(objVal);
				break;
			case 'alphanum' :
				result = new RegExp(/^[a-z0-9]+$/i).test(objVal);
				break;
			case 'regex' :
				result = new RegExp(eval("/" + etcOpt + "/")).test(objVal);
				break;
			case 'alpha' :
				result = new RegExp(/^[a-z]+$/i).test(objVal);
				break;
			case 'tel' :
				result = new RegExp(/^\d{2,3}-\d{3,4}-\d{4}$/).test(objVal);
				break;
			case 'mobile' :
				result = new RegExp(/^\d{3}-\d{3,4}-\d{4}$/).test(objVal);
				break;
			case 'ssn' :
				result = new RegExp(/^(?:[0-9]{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[1,2][0-9]|3[0,1]))-[1-4][0-9]{6}$/).test(objVal);
				break;
			case 'passwd' :
				result = new RegExp(/(?=.*\d{1,50})(?=.*[~`!@#$%\^&*()-+=]{1,50})(?=.*[a-zA-Z]{1,50}).{8,50}$/).test(objVal);
				break;
            case 'date' : //20200828 날짜추가 SKM
                if(isEmpty(objVal)){  //필수가 아니면 체크하지 않음
                    result = true;
                }else{
                    result = new RegExp(/^\d{4}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|[3][01])/).test(objVal.replace(/([0-9]{4})-([0-9]{2})-([0-9]{2})/g, '$1$2$3'));
                }

                break;
			default:
				// if (altMsg && altMsg != "") {
				// 	if (focusYn == "N") {
				// 		alertMsg("alert", altMsg);
				// 	}else {
				// 		if ($(obj)[0].id && $(obj)[0].id != "") {
				// 			setFocusId($(obj)[0].id);
				// 			alertMsg("alert", altMsg, setHtmlFocus);
				// 		}else {
				// 			alertMsg("alert", altMsg);
				// 		}
				// 	}
				// }
				break;
		}//end swtch

		if(!result){
			if (altMsg && altMsg != "") {
				if (focusYn == "N") {
					alertMsg("alert", altMsg);
				}else {
					if ($(obj)[0].id && $(obj)[0].id != "") {
                        if(regExpType == "date") $("#" + $(obj)[0].id).val("");
						setFocusId($(obj)[0].id);
						alertMsg("alert", altMsg, setHtmlFocus);
					}else {
						alertMsg("alert", altMsg);
					}
				}
			}
			return false;
		}else{
			return true;
		}
	}

	//file download 함수
	function fileDown(fileNo, uploadTy) {
		console.log("fileDown start!!!");
		var fileParam = new Object();
		fileParam.fileNo = fileNo;
		if (uploadTy && uploadTy != "") {
			fileParam.uploadTy = uploadTy;
		}

		hsmsFileDown(fileParam);
	}

	//file download 함수
	function hsmsFileDown(fileParam) {
		console.log("hsmsFileDown start!!!" + JSON.stringify(fileParam));
		var downForm = $("#downForm");
		var fileNo = fileParam.fileNo;

		console.log("hsmsFileDown fileNo:" + fileNo);
		if (!fileNo || fileNo == "") {
			alertMsg("alert", "파일정보가 존재하지 않습니다.");
			return ;
		}
		$('#downForm input[name="fileNo"]').val(fileNo);

		var uploadTy = fileParam.uploadTy;
		if (uploadTy && uploadTy != "") {
			$('#downForm input[name="uploadTy"]').val(uploadTy);
		}

		downForm.attr("action", "/cmmn/file/fileDown.do");
		//downForm.attr("target", "_blank");
		downForm.attr("target", "fileIframe" + fileNo);

		var fileIframeId = 'fileIframe' + fileNo;
		var iframe = document.getElementById(fileIframeId);
		if (iframe === null) {
		    iframe = document.createElement('iframe');
		    iframe.id = fileIframeId;
		    iframe.name = fileIframeId;
		    iframe.style.display = 'none';
		    /*
		    iframe.onload = function() {
		        $(".loading").hide();
		    };
		    */
		    console.log("hsmsFileDown fileIframeId:" + fileIframeId);
		    document.body.appendChild(iframe);
		}

		console.log("hsmsFileDown end!!!" + downForm.serialize());
		downForm.submit();

	}

	//file download 함수
	function failDownMsg() {
		alertMsg("error", "파일다운로드가 실패했습니다.");
	}

	// Div 안의 이미지를 div width 이미지 비율대로 줄임.
	function resizeImageInDiv(objDiv) {

		var maxWdth = objDiv.width();
		var maxHiht = objDiv.height();

		if (maxWdth > 0 | maxHiht > 0) {
			objDiv.find("img").each(function() {
				var maxWidth = maxWdth; // Max width for the image
			    var maxHeight = maxHiht;    // Max height for the image
			    var ratio = 0;  // Used for aspect ratio
			    var width = $(this).width();    // Current image width
			    var height = $(this).height();  // Current image height

			    // Check if the current width is larger than the max
			    if (maxWidth && maxWidth > 0) {
				    if(width > maxWidth){
				        ratio = maxWidth / width;   // get ratio for scaling image
				        $(this).css("width", maxWidth); // Set new width
				        $(this).css("height", height * ratio);  // Scale height based on ratio
				        height = height * ratio;    // Reset height to match scaled image
				    }

				    var width = $(this).width();    // Current image width
				    var height = $(this).height();  // Current image height
			    }

			    // Check if current height is larger than max
			    if (maxHeight && maxHeight > 0) {
				    if(height > maxHeight){
				        ratio = maxHeight / height; // get ratio for scaling image
				        $(this).css("height", maxHeight);   // Set new height
				        $(this).css("width", width * ratio);    // Scale width based on ratio
				        width = width * ratio;    // Reset width to match scaled image
				    }
			    }

			});
		}

	}

	// 이미지가 지정된 maxWdth, maxHiht 보다 큰 경우 해당 이미지 비율대로 줄임.
	function resizeImage(objDiv, objImg) {

		var maxWdth = objDiv.width();
		var maxHiht = objDiv.height();

		if (maxWdth > 0 | maxHiht > 0) {

			var maxWidth = maxWdth; // Max width for the image
			var maxHeight = maxHiht;    // Max height for the image
			var ratio = 0;  // Used for aspect ratio
			var width = objImg.width();    // Current image width
			var height = objImg.height();  // Current image height

			// Check if the current width is larger than the max
			if (maxWidth && maxWidth > 0) {
				if(width > maxWidth){
					ratio = maxWidth / width;   // get ratio for scaling image
					objImg.css("width", maxWidth); // Set new width
					objImg.css("height", height * ratio);  // Scale height based on ratio
					height = height * ratio;    // Reset height to match scaled image
				}

				var width = objImg.width();    // Current image width
				var height = objImg.height();  // Current image height
			}

			// Check if current height is larger than max
			if (maxHeight && maxHeight > 0) {
				if(height > maxHeight){
					ratio = maxHeight / height; // get ratio for scaling image
					objImg.css("height", maxHeight);   // Set new height
					objImg.css("width", width * ratio);    // Scale width based on ratio
					width = width * ratio;    // Reset width to match scaled image
				}
			}

		}

	}

	// 정규식에 맞는 키 입력만 출력
	function checkKeyUp(obj, options) {
		hsmsValidate(obj, options);
	}

	/* Cookie 설정, 삭제, 조회 */
	function setCookie(cookieName, value, exdays){
	    var exdate = new Date();
	    exdate.setDate(exdate.getDate() + exdays);
	    var cookieValue = escape(value) + ((exdays==null) ? "" : "; expires=" + exdate.toGMTString());
	    document.cookie = cookieName + "=" + cookieValue;
	}

	function deleteCookie(cookieName){
	    var expireDate = new Date();
	    expireDate.setDate(expireDate.getDate() - 1);
	    document.cookie = cookieName + "= " + "; expires=" + expireDate.toGMTString();
	}

	function getCookie(cookieName) {
	    cookieName = cookieName + '=';
	    var cookieData = document.cookie;
	    var start = cookieData.indexOf(cookieName);
	    var cookieValue = '';
	    if(start != -1){
	        start += cookieName.length;
	        var end = cookieData.indexOf(';', start);
	        if(end == -1)end = cookieData.length;
	        cookieValue = cookieData.substring(start, end);
	    }
	    return unescape(cookieValue);
	}

	function inputClear(selObj){
		$.each(selObj, function(i, obj){
		    var jqObj = $(obj);
		    if(jqObj.prop('tagName') == "INPUT"){
		        var jqObjType = jqObj.attr("type").toUpperCase();
		        if(jqObjType == "TEXT" || jqObjType == "HIDDEN"){
		            jqObj.val("");
		        }else if(jqObjType == "RADIO"){
		            $('input[name="'+jqObj.attr("name")+'"]').first().prop("checked", true);
		        }else if(jqObjType == "CHECKBOX"){
		            $('input[name="'+jqObj.attr("name")+'"]').prop("checked", true);
		        }
		    }else if(jqObj.prop('tagName') == "TEXTAREA"){
		        jqObj.val("");
		    }
		});
	}

	function makeUniqueArray(srcArray) {

		var uniqueArray = new Array();

		$.each(srcArray, function(i, el){
			if($.inArray(el, uniqueArray) === -1) uniqueArray.push(el);
		});

		return uniqueArray;
	}

	/*
	function searchAddr(zipObj, addrObj) {
		popModalId = "addrModal";
		showModalUrl("addrModal", "/cmmn/searchAddress.do", JSON.stringify({"addrPostno" : zipObj, "addr1" : addrObj}));
	}
	*/

	function changeAllDisabled(uiObj, bDisabled) {
		uiObj.find("input").attr("disabled", bDisabled);
		uiObj.find("select").attr("disabled", bDisabled);
		uiObj.find("textarea").attr("disabled", bDisabled);
	}

	function comma(str) {
		str = String(str);
		return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
	}

	function uncomma(str) {
		str = String(str);
		return str.replace(/[^\d]+/g, '');
	}

	function removePreZero(str) {
		str = String(str);
		return str.replace(/(^0+)/, "");
	}

	function currFormat(str) {
		str = removePreZero(str);
		return comma(uncomma(str));
	}

	function keyDownNumber(event){
	    event = event || window.event;
	    var keyID = (event.which) ? event.which : event.keyCode;
	    if ( (keyID >= 48 && keyID <= 57) || (keyID >= 96 && keyID <= 105) || keyID == 8 || keyID == 46 || keyID == 37 || keyID == 39 )
	        return;
	    else
	        return false;
	}

    function setDateFormat(date_str, delimiter){
        var checkFlag = new RegExp(/^\d{4}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|[3][01])/).test(date_str.replace(/([0-9]{4})-([0-9]{2})-([0-9]{2})/g, '$1$2$3'));
        if(!checkFlag) return ;
        return date_str.replace(/([0-9]{4})([0-9]{2})([0-9]{2})/g, '$1' + delimiter + '$2' + delimiter +'$3');
    }

	// 두개의 날짜를 비교하여 차이 일수 리턴
	function dateDiff(fromDate, toDate) {
	    var diffFrom = fromDate instanceof Date ? fromDate :new Date(fromDate);
	    var diffTo = toDate instanceof Date ? toDate :new Date(toDate);

	    diffFrom =new Date(diffFrom.getFullYear(), diffFrom.getMonth()+1, diffFrom.getDate());
	    diffTo =new Date(diffTo.getFullYear(), diffTo.getMonth()+1, diffTo.getDate());

	    var diff = Math.abs(diffTo.getTime() - diffFrom.getTime());
	    diff = Math.ceil(diff / (1000 * 3600 * 24));

	    return diff;
	}

function to_date(date_str){
    var yyyyMMdd = String(date_str);
    var sYear = yyyyMMdd.substring(0,4);
    var sMonth = yyyyMMdd.substring(4,6);
    var sDate = yyyyMMdd.substring(6,8);

    return new Date(Number(sYear), Number(sMonth)-1, Number(sDate)).format('yyyy-MM-dd');
}
