<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>

<%-- include declare --%>
<%@ include file="/WEB-INF/jsp/include/declare.jsp"%>
</head>
<script type="text/javascript">
$(document).ready(function(){
	var formObj = $("form[name='updateForm']");
	
	$("#btnCancel").on("click", function(){
		location.href = "/board/readView?bno=${replyUpdate.bno}"
			   + "&page=${scri.page}"
			   + "&perPageNum=${scri.perPageNum}"
			   + "&searchType=${scri.searchType}"
			   + "&keyword=${scri.keyword}";
	})
	
})
	
</script>
<body>
	<div class="container">

		<%-- nav include --%>
		<%@ include file="/WEB-INF/jsp/include/nav.jsp"%>

		<section id="container">
			<form name="updateForm" role="form" method="post" action="/board/replyUpdate">
				<input type="hidden" id="boardNo" name="boardNo" value="${replyUpdate.baordNo}" readonly="readonly" />
				<input type="hidden" id="replyNo" name="replyNo" value="${replyUpdate.replyNo}" /> 
				<input type="hidden" id="page" name="page" value="${scri.page}">
				<input type="hidden" id="perPageNum" name="perPageNum" value="${scri.perPageNum}">
				<input type="hidden" id="searchType" name="searchType" value="${scri.searchType}">
				<input type="hidden" id="keyword" name="keyword" value="${scri.keyword}">
				<table class="table table-hover">
					<tbody>
						<tr>
							<td>
								<label for="replyContent">댓글 내용</label>
								<input type="text" class="form-control" id="replyContent" name="replyContent" value="${replyUpdate.replyContent}" />
							</td>
						</tr>

					</tbody>
				</table>
				<div>
					<button type="submit" class="btn btn-primary" id="btnUpdate" name="btnUpdate">저장</button>
					<button type="button" class="btn btn-secondary" id="btnCancel" name="btnCancel">취소</button>
				</div>
			</form>
		</section>
		<hr />
	</div>
</body>
</html>