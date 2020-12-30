//	첨부파일 리스트에 있는 실제 파일의 버퍼
var fileBuffer = {};
//	첨부파일 리스트에 있는 파일을 삭제하기 위한 변수
var fileDelList = {};
//	기존에 업로드 되어있는 파일을 삭제하기 위한 변수
var dbfileDelList = {};
//	파일의 카운트
var fileCnt = 0;
//	허용되지 않은 확장자 갯수 판별
var extSnCnt = 0;
//	수정 시 기존에 업로드된 삭제할 파일들 리스트를 가지고 있는 변수
var dbFileDelList_temp = [];

$(document).ready(function(){
	// 파일첨부 버튼을 눌러 파일을 등록 했을 시 호출
	$('#fakeFile').change(function(){
		fileListUpload($(this)[0].files);
    });

	// 파일 업로드 폼
	$fileForm = $('<form>', {"id" : "fileForm", "enctype" : "multipart/form-data"});

	// 파일 업로드 전송 호출
	$fileForm.ajaxForm({
		contentType : false,
		url : "/fileUpload.do",
        processData : false,
        async : false,
        enctype : "multipart/form-data",
        type : "POST",
        dataType : "json",
        beforeSubmit: function(data, form, option) {
        	if(Object.keys(fileBuffer).length < 1){
        		return false;
        	}
        	for(var file in fileBuffer){
        		var obj = {name : "file[]", value : fileBuffer[file], type : "file"};
            	data.push(obj);
    		}
        },
        success: function(returnData){
        	if(returnData.resultStr == 1){
        		$.each(returnData.fileNoList, function(i, obj){
        			fileUploadSuccessList.push(obj.fileNo);
        		});
        		console.log('파일업로드 성공.');
        	}else if(returnData.resultStr == 0){
        		alert('파일 업로드 중 에러가 발생 했습니다.');
        	}
        },
        error: function(x,e){
            alert('파일 업로드 중 에러가 발생 했습니다.');
        }
	});

	// 파일 리스트의 체크박스를 모두 선택/해제 가능한 함수
	$('#fileUploadModule #fileAllSelect').click(function(){
		if($(this).prop("checked")){
			$.each($('#fileUploadModule .fileLine span input[value^="file_"]:not(:checked)'), function(key, obj){
				$('#fileUploadModule #'+obj.id).trigger("click");
			});
			$('#fileUploadModule .fileLine span input[value^="file_"]').prop("checked",true);
		}else if(!$(this).prop("checked")){
			$.each($('#fileUploadModule .fileLine span input[value^="file_"]:checked'), function(key, obj){
				$('#fileUploadModule #'+obj.id).trigger("click");
			});
			$('#fileUploadModule .fileLine span input[value^="file_"]').prop("checked",false);
		}
	});

	// 파일 리스트에 파일을 끌어다 놓았을 때 파일첨부 리스트 및 버퍼에 입력 되게 하는 함수
	fileDropDown();
}); //document

// 파일 첨부 버튼 클릭 시 숨겨져 있는 파일 input을 호출하여 사용
function fileAttachment(){
	$('#fileUploadModule #fakeFile').trigger("click");
}

// 파일첨부 버튼이나 파일을 끌어다 놓았을 때 리스트 및 버퍼에 작성 하게 해주는 함수
function fileListUpload(files){
	var fileListHtml = "";
	var fileBufferLen = Object.keys(fileBuffer).length;
    $.each(files, function(index, file){
    	var fileName = file.name;
    	var extSn = fileName.substring(fileName.lastIndexOf(".")+1);
    	
    	// 파일첨부 특수문자 업로드 제한
        var iChars = "~`!#$%^&*+=-[]\\\';,/{}|\":<>?";
        if(fileCnt == 0){
        	for (var i = 0; i < fileName.length; i++) {
            	if (iChars.indexOf(fileName.charAt(i)) != -1) {
            		alertMsg("alert", "사용할 수 없는 문자열이 포함되어 있습니다. <br>~`!#$%^&*+=-[]\';,/{}|\":<>?");
            		return false;
            	}
            }
        }
        
    	if(extSnList.indexOf(extSn) < 0){
    		extSnCnt++;
    	}else{
        	var fileSerial = "file_" + fileCnt;
        	var fileNo = "";
        	// 수정 시 파일삭제를 위한 번호 입력
        	if(file.fileNo != undefined){
        		fileNo = "fileNo=\"" + file.fileNo + "\"";
        	}else{
        		// 파일 상세 보기에서는 버퍼에 넣을 필요가 없으므로 등록이나 추가 시에만 사용
        		fileBuffer[fileSerial] = file;
        	}
            // TODO SKM 수정할때 다운로드 기능(권한고려)
        	fileListHtml += "<div class='fileLine' id='" + fileSerial + "'>";
        	fileListHtml += " <span class='fileSelect'><input type='checkbox' id='fileChk_" + fileCnt + "' " + fileNo + " value='" + fileSerial + "' onclick='fileCheck(this)'></span>";
        	fileListHtml += " <span class='fileName'  " + fileNo + "><label style='width:auto;' for='" + fileSerial + "'>" + file.name + "</label></span>";
        	if(file.size > 10000000000){
        		fileListHtml += " <span class='fileSize'>" + Math.round(file.size/1024/1024/1024)+"GB</span>";
        	}else if(file.size > 10000000){
        		fileListHtml += " <span class='fileSize'>" + Math.round(file.size/1024/1024)+"MB</span>";
        	}else if(file.size > 1000){//KB
        		fileListHtml += " <span class='fileSize'>" + Math.round(file.size/1024)+"KB</span>";
        	}else{
        		fileListHtml += " <span class='fileSize'>" + file.size+"Byte</span>";
        	}
        	fileListHtml += "</div>";
        	fileCnt++;
    	}
    });
	       
    if(extSnCnt > 0){
    	alert("사용할 수 없는 확장자를 포함한 파일은 제외 됩니다.");
    }
    extSnCnt = 0;
    if($('#fileListZone .fileLine').length == 0){
    	$('#fileUploadModule .fileListForm #fileListZone').html(fileListHtml);
    }else{
        $('#fileUploadModule .fileListForm #fileListZone').append(fileListHtml);
    }
	$('#fileTotalCnt').html("총 " + $('#fileListZone .fileLine').length + "개 파일");
}

// 삭제할 파일을 체크 했을때 호출되는 함수
function fileCheck(obj){
	if($(obj).attr('fileNo') == undefined){
		var delObj = obj.value;
		if($('#fileUploadModule #'+obj.id).prop("checked")){
			fileDelList[delObj] = "1";
		}else if(!$('#fileUploadModule #'+obj.id).prop("checked")){
			delete fileDelList[delObj];
		}
	}else{
		var delObj = $(obj).attr('fileNo');
		if($('#fileUploadModule #'+obj.id).prop("checked")){
			dbfileDelList[delObj] = obj.value;
		}else if(!$('#fileUploadModule #'+obj.id).prop("checked")){
			delete dbfileDelList[delObj];
		}
	}
}

// 삭제버튼을 눌러 삭제할 파일들을 제거하는 함수
function fileDel(){
	for(var key in fileDelList){
		$('#fileUploadModule #'+key).remove();
		delete fileBuffer[key];
	}

	for(var key in dbfileDelList){
		$('#fileUploadModule #'+dbfileDelList[key]).remove();
		dbFileDelList_temp.push(key);
	}

	fileDelList = [];
	dbfileDelList = [];

	if($('#fileListZone .fileLine').length == 0){
		$('#fileUploadModule .fileListForm #fileListZone').html("<p class='fileDrag'>파일을 드래그 해주세요.</p>");
	}
	$('#fileAllSelect').prop("checked", false);
	$('#fileTotalCnt').html("총 " + $('#fileListZone .fileLine').length + "개 파일");
}

// 파일 리스트에 파일을 끌어다 놓았을 때 호출되는 함수
function fileDropDown(){
	var dropZone = $("#fileUploadModule #dropZone");
    //Drag기능
    dropZone.on('dragenter', function(e) {
        e.stopPropagation();
        e.preventDefault();
        // 드롭다운 영역 css
        dropZone.css('background-color','#E3F2FC');
    });
    dropZone.on('dragleave', function(e) {
        e.stopPropagation();
        e.preventDefault();
        // 드롭다운 영역 css
        dropZone.css('background-color','#FFFFFF');
    });
    dropZone.on('dragover', function(e) {
        e.stopPropagation();
        e.preventDefault();
        // 드롭다운 영역 css
        dropZone.css('background-color','#E3F2FC');
    });
    dropZone.on('drop', function(e){
        e.preventDefault();
        // 드롭다운 영역 css
        dropZone.css('background-color','#FFFFFF');

        var files = e.originalEvent.dataTransfer.files;
        if(files != null){
            if(files.length < 1){
                alert("폴더 업로드 불가");
                return;
            }
            fileListUpload(files);
        } else {
            alert("ERROR");
        }
    });
}