<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>

<%-- include declare --%>
<%@ include file="/WEB-INF/jsp/include/declare.jsp"%>
</head>
<script type="text/javascript">
$(document).ready(function() {
	$("button").click(function() {
		var objId = this.id;
		
		if(objId == "btnUpdate") {	
			updtBoard();
		} else if(objId == "btnCancel") {
			event.preventDefault();
			location.href = "/dashBoard/listView.do";
		} 
	})
	
})


function fn_valiChk() {
	var updateForm = $("form[name='updateForm'] .valChk").length;
	for (var i = 0; i < updateForm; i++) {
		if ($(".valChk").eq(i).val() == "" || $(".valChk").eq(i).val() == null) {
			alert($(".valChk").eq(i).attr("title"));
			return true;
		}
	}
}

function updtBoard() {
	var formObj = $("form[name='updateForm']");
	if (fn_valiChk()) {
		return false;
	}
	formObj.attr("action", "/dashBoard/update.do");
	formObj.attr("method", "post");
	formObj.submit();
}

</script>
<body>
	<div class="container">

		<%-- nav include --%>
		<%@ include file="/WEB-INF/jsp/include/nav.jsp"%>

		<section id="container">
			<form name="updateForm" role="form" action="/dashBoard/update" method="post">
				<input type="hidden" name="boardNo" value="${update.boardNo}" readonly="readonly" />
				<table class="table table-hover">
					<tbody>
						<tr>
							<td>
								<label for="boardTitle">제목</label> 
								<input type="text" class="form-control valChk" id="boardTitle" name="boardTitle" value="${update.boardTitle}" />
							</td>
						</tr>
						<tr>
							<td>
								<label for="boardContent">내용</label>
								<textarea class="form-control valChk" id="boardContent" name="boardContent"><c:out value="${update.boardContent}" /></textarea>
							</td>
						</tr>
						<tr>
							<td>
								<label for="boardWriter">작성자</label> 
								<input type="text" class="form-control valChk" id="boardWriter" name="boardWriter" value="${update.boardWriter}" readonly="readonly" />
							</td>
						</tr>
						<tr>
							<td>
								<label for="regDate">작성날짜</label>
								<fmt:formatDate value="${update.regDate}" pattern="yyyy-MM-dd" />
							</td>
						</tr>
					</tbody>
				</table>
				<div>
					<button type="submit" class="btn btn-primary" id="btnUpdate" name="btnUpdate">저장</button>
					<button type="submit" class="btn btn-secondary" id="btnCancel" name="btnDelete">취소</button>
				</div>
			</form>
		</section>
		<hr />
	</div>
</body>
</html>