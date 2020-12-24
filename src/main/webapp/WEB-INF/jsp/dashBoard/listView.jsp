<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>

<%-- include declare --%>
<%@ include file="/WEB-INF/jsp/include/declare.jsp"%>
</head>
<style type="text/css">
li {
	list-style: none;
	float: left;
	padding: 6px;
}
</style>
<script>
$(document).ready(function(){
	var formObj = $("form[name='writeForm']");
	
	$("button").click(function() {
		var objId = this.id;
		
		if(objId == "btnSearch") {	
			self.location = "list" + '${pageMaker.makeQuery(1)}' 
			+ "&searchType=" + $("select option:selected").val() 
			+ "&keyword=" + encodeURIComponent($('#keywordInput').val());
		} else if(objId == "btnWrite") {
			location.href = "/dashBoard/writeView.do";
		} 
	})
})
</script>
<body>
	<div class="container">
	
	<%-- nav include --%>
	<%@ include file="/WEB-INF/jsp/include/nav.jsp" %>

		<section id="container">
			<form role="form" method="get">
				<table class="table table-hover">
					<tr>
						<th>번호</th>
						<th>제목</th>
						<th>작성자</th>
						<th>등록일</th>
					</tr>
					<c:forEach items="${list}" var="list">
						<tr>
							<td class="dt-body-right"><c:out value="${list.boardNo}" /></td>
							<td class="dt-body-left">
								<a href="/dashBoard/readView.do?boardNo=${list.boardNo}&page=${scri.page}&perPageNum=${scri.perPageNum}&searchType=${scri.searchType}&keyword=${scri.keyword}"><c:out value="${list.boardTitle}" /></a>
							</td>
							<td class="dt-body-center"><c:out value="${list.boardWriter}" /></td>
							<td class="dt-body-center"><fmt:formatDate value="${list.regDate}" pattern="yyyy-MM-dd" /></td>
						</tr>
					</c:forEach>

				</table>
				<div class="search row">
					<div class="col-xs-2 col-sm-2">
						<select name="searchType" class="form-control">
							<option value="n" <c:out value="${scri.searchType == null ? 'selected' : ''}"/>>-----</option>
							<option value="t" <c:out value="${scri.searchType eq 't' ? 'selected' : ''}"/>>제목</option>
							<option value="c" <c:out value="${scri.searchType eq 'c' ? 'selected' : ''}"/>>내용</option>
							<option value="w" <c:out value="${scri.searchType eq 'w' ? 'selected' : ''}"/>>작성자</option>
							<option value="tc" <c:out value="${scri.searchType eq 'tc' ? 'selected' : ''}"/>>제목+내용</option>
						</select>
					</div>
					<div class="col-xs-10 col-sm-10">
						<div class="input-group">
							<input type="text" class="form-control"  id="keywordInput" name="keywordInput" value="${scri.keyword}" /> 
							<span class="input-group-btn">
								<button type="button" class="btn btn-secondary" id="btnSearch" name="btnSearch">검색</button>
							</span>
						</div>
					</div>
				</div>
				<div class="col-md-offset-6">
					<ul class="pagination">
						<c:if test="${pageMaker.prev}">
							<li><a href="list${pageMaker.makeSearch(pageMaker.startPage - 1)}">이전</a></li>
						</c:if>
						<c:forEach begin="${pageMaker.startPage}" end="${pageMaker.endPage}" var="idx">
							<li<c:out value="${pageMaker.cri.page == idx ? 'class=info' : ''}" />>
								<a href="list${pageMaker.makeSearch(idx)}">${idx}</a>
							</li>
						</c:forEach>
						<c:if test="${pageMaker.next && pageMaker.endPage > 0}">
							<li><a href="list${pageMaker.makeSearch(pageMaker.endPage + 1)}">다음</a></li>
						</c:if>
					</ul>
					
					<button type="button" class="btn btn-primary" id="btnWrite" name="btnWrite">작성</button>
				</div>
			</form>
		</section>
		<hr />
	</div>
</body>
</html>