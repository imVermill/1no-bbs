<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<%-- include declare --%>
<%@ include file="/WEB-INF/jsp/include/declare.jsp"%>
</head>
<script type="text/javascript">
$(document).ready(function(){
	var formObj = $("form[name='writeForm']");
	
	$("button").on(click,function() {
		var objId = this.id;
		
		if(objId == "btnWrite") {	
			writeBoard();
		}
	})
	
})


function fn_valiChk(){
	var regForm = $("form[name='writeForm'] .valChk").length;
	for(var i = 0; i<regForm; i++){
		if($(".valChk").eq(i).val() == "" || $(".valChk").eq(i).val() == null){
			alert($(".valChk").eq(i).attr("title"));
			return true;
		}
	}
}

function writeBoard() {
	if(fn_valiChk()) {
		return false;
	}
	formObj.attr("action", "/dashBoard/write.do");
	formObj.attr("method", "post");
	formObj.submit();
}

</script>
<body>

	<div class="container">
	
	<%-- nav include --%>
	<%@ include file="/WEB-INF/jsp/include/nav.jsp" %>
	
		<section id="container">
			<form role="form" action="/dashBoard/write.do" method="post" enctype="multipart/form-data">
				<table class="table table-hover">
					<tbody>
						<tr>
							<td>
								<label for="boardTitle">제목</label>
								<input type="text" class="form-control valChk" id="boardTitle" name="boardTitle" />
							</td>
						</tr>
						<tr>
							<td>
								<label for="boardContent">내용</label>
								<textarea class="form-control valChk" id="boardContent" name="boardContent"></textarea>
							</td>
						</tr>
						<tr>
							<td>
								<label for="boardWriter">작성자</label>
								<input type="text" class="form-control valChk" id="boardWriter" name="boardWriter" />
							</td>
						</tr>
						<tr>
							<td>
								<!-- <input type="file" id="file" name="file" /> -->
								<%@ include file="/WEB-INF/jsp/include/fileUpload.jsp" %>
							</td>
						</tr>
						<tr>
							<td>
								<button type="submit" class="btn btn-primary" id="btnWrite" name="btnWrite">작성</button>
								<button type="button" class="btn btn-secondary" id="btnCancel" name="btnDelete">취소</button>
							</td>
						</tr>
					</tbody>
				</table>
			</form>
		</section>
		<hr />
	</div>
</body>
</html>