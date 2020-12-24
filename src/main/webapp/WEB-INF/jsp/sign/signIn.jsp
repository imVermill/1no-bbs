<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ page session="false"%>

<%@ include file="/WEB-INF/jsp/include/declare.jsp"%>
</head>

<script type="text/javascript">
$(document).ready(function() {
	$("#btnSignOut").on("click", function() {
		location.href = "/sign/signOut.do";
	})
	$("#btnSignUp").on("click", function() {
		location.href = "/sign/signUp.do";
	})
	$("#btnSignEdit").on("click", function() {
		location.href = "/sign/signEdit.do";
	})

})
</script>
<body>
	<form name='homeForm' action="/sign/signIn.do" method="post">
		<c:if test="${member == null}">
			<div>
				<label for="userId"></label> 
				<input type="text" id="userId" name="userId">
			</div>
			<div>
				<label for="password"></label> 
				<input type="password" id="password" name="password">
			</div>
			<div>
				<button type="submit">로그인</button>
				<button type="button" id="btnSignUp" name="btnSignUp">회원가입</button>
			</div>
		</c:if>
		<c:if test="${member != null }">
			<div>
				<p>${member.userId}님환영 합니다.</p>
				<button type="button" id="btnSignEdit" name="btnSignEdit">회원정보수정</button>
				<button type="button" id="btnSignOut" name="btnSignOut">로그아웃</button>
			</div>
		</c:if>
		<c:if test="${msg == false}">
			<p style="color: red;">로그인 실패! 아이디와 비밀번호 확인해주세요.</p>
		</c:if>
	</form>
</body>
</html>