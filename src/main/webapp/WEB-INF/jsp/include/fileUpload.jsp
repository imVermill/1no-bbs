<%@ page language="java" pageEncoding="UTF-8"%>
<script src="<c:url value='/js/cmmn/fileUpload.js' />"></script>
<script type="text/javascript">
	var extSnList = "${extSnList}";
	var fileUploadSuccessList = [];
</script>
<div id="fileUploadModule">
	<input type="file" id="fakeFile" multiple="multiple" style="display:none;">
	<span id="fileTotalCnt"  style="margin:5px; float:left;">총 0개 파일</span>
	<div align="right">
		<input type="button" class="btn btn-sm btn-secondary" value="파일첨부" onclick="fileAttachment()" style="margin-right:1px;">
		<input type="button" class="btn btn-sm btn-secondary" value="삭제" onclick="fileDel();" style="margin-left:1px;">
	</div>
	<div class="fileListForm" id="dropZone"">
		<!-- 파일리스트 필드 -->
		<div id="fileListFieldSet">
			<div class="fileLine">
				<span class="fileSelect">
					<input type="checkbox" id="fileAllSelect" name="fileAllSelect">
				</span>
				<span class="fileName">파일명</span>
				<span class="fileSize">용량</span>
       		</div>
		</div>
		<!-- 실제 파일리스트 -->
		<div id="fileListZone">
			<p class="fileDrag">파일을 드래그 해주세요.</p>
		</div>
	</div>
</div>