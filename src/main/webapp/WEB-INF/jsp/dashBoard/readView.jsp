<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>

<%-- include declare --%>
<%@ include file="/WEB-INF/jsp/include/declare.jsp"%>
</head>
<script>
$(document).ready(function(){
	$("button").click(function() {
		var objId = this.id;
		
		if(objId == "btnUpdate" || objId == "btnDelete") {	
			chngBoard(objId);
		} else if (objId == "btnList") {
			location.href = "/dashBoard/listView.do";
		} else if (objId == "btnReply") {
			insertReply();
		} else if (objId == "btnRplyUpdt") {
			location.href = "/dashBoard/replyUpdateView?boardNo=${read.boardNo}"
				+ "&page=${scri.page}"
				+ "&perPageNum=${scri.perPageNum}"
				+ "&searchType=${scri.searchType}"
				+ "&keyword=${scri.keyword}"
				+ "&rno="+$(this).attr("data-rno");
		} else if (objId == "btnRplyDlte") {
			location.href = "/dashBoard/replyDeleteView?boardNo=${read.boardNo}"
				+ "&page=${scri.page}"
				+ "&perPageNum=${scri.perPageNum}"
				+ "&searchType=${scri.searchType}"
				+ "&keyword=${scri.keyword}"
				+ "&rno="+$(this).attr("data-rno");
		}
	})
	
	
})

function chngBoard(objId) {
	var formObj = $("form[name='readForm']");
	
	if (objId == "btnUpdate") {
		formObj.attr("action", "/dashBoard/updateView.do");
		formObj.attr("method", "get");
		formObj.submit();		
	}
	if (objId == "btnDelete") {
		var deleteYn = confirm("해당 게시글을 삭제하시겠습니까 ?");
		
		if (deleteYn == true) {
			formObj.attr("action", "/dashBoard/delete.do");
			formObj.attr("method", "post");
			formObj.submit();
		}
	}
}

function insertReply() {
	var formObj = $("form[name='replyForm']");
	
	formObj.attr("action", "/dashBoard/insertReply.do");
	formObj.submit();			
}


</script>
<body>
	<div class="container">

		<%-- nav include --%>
		<%@ include file="/WEB-INF/jsp/include/nav.jsp"%>

		<section id="container">
			<form name="readForm" role="form" method="post">
				<input type="hidden" id="boardNo" name="boardNo" value="${read.boardNo}" />
			</form>
			<table class="table table-hover">
				<tbody>
					<tr>
						<td>
							<label for="boardTitle">제목</label>
							<input type="text" class="form-control" id="boardTitle" name="boardTitle" value="${read.boardTitle}" readonly="readonly" />
						</td>
					</tr>
					<tr>
						<td>
							<label for="boardContent">내용</label>
							<textarea class="form-control" id="boardContent" name="boardContent" readonly="readonly"><c:out value="${read.boardContent}" /></textarea>
						</td>
					</tr>
					<tr>
						<td>
							<label for="boardWriter">작성자</label>
							<input type="text" class="form-control" id="boardWriter" name="boardWriter" value="${read.boardWriter}" readonly="readonly" />
						</td>
					</tr>
					<tr>
						<td>
							<label for="regdate">작성날짜</label>
							<fmt:formatDate value="${read.regDate}" pattern="yyyy-MM-dd" />
						</td>
					</tr>
				</tbody>
			</table>
			<div>
				<button type="button" class="btn btn-primary" id="btnUpdate" name="btnUpdate">수정</button>
				<button type="button" class="btn btn-primary" id="btnDelete" name="btnDelete">삭제</button>
				<button type="button" class="btn btn-secondary" id="btnList" name="btnList">목록</button>
			</div>
			
			<%-- dashBoard Reply --%>
			<div class="form-group" id="reply">
				<ol class="replyList">
					<c:forEach items="${reply}" var="reply">
						<li>
							<p>
							작성자 : ${reply.replyWriter} <br />
							작성 날짜 : <fmt:formatDate value="${reply.regDate}" pattern="yyyy-MM-dd" />
							</p>
							<p>${reply.replyContent}</p>
							<div>
								<button type="button" class="btn btn-primary" id="btnRplyUpdt" data-replyno="${reply.replyNo}">수정</button>
								<button type="button" class="btn btn-primary" id="btnRplyDlte" data-replyno="${reply.replyNo}">삭제</button>
							</div>
						</li>
					</c:forEach>
				</ol>
			</div>
			
			<form name="replyForm" method="post">
				<input type="hidden" id="boardNo" name="boardNo" value="${read.boardNo}" >
				<input type="hidden" id="page" name="page" value="${scri.page}" >
				<input type="hidden" id="perPageNum" name="perPageNum" value="${scri.perPageNum}" >
				<input type="hidden" id="searchType" name="searchType" value="${scri.searchType}" >
				<input type="hidden" id="keyword" name="keyword" value="${scri.keyword}" >
				
				<div>
					<label for="replyWriter">댓글 작성자</label>
					<input type="text" class="form-control" id="replyWriter" name="replyWriter" /><br />
					<label for="replyContent">댓글 내용</label>
					<input type="text" class="form-control" id="replyContent" name="replyContent" />
				</div>
				<div>
					<button type="button" class="btn btn-primary" id="btnReply" name="btnReply">작성</button>
				</div>
			</form>
		</section>
		<hr />
	</div>
</body>
</html>