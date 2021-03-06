<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>

<%-- include declare --%>
<%@ include file="/WEB-INF/jsp/include/declare.jsp"%>
</head>

<script type="text/javascript">
$(document).ready(function() {
	$("#btnSubmit").on("click", function() {
		if ($("#password").val() == "") {
			alert("비밀번호를 입력해주세요.");
			$("#password").focus();
			return false;
		}
		$.ajax({
			  url : "/sign/chkedPwdAjax.do"
			, type : "POST"
			, dataType : "json"
			, data : $("#delForm").serializeArray()
			, success : function(data) {
				
				if(data == true) {
					if(confirm("탈퇴하시겠습니까?")) {
						$("#delForm").submit();
					}
				} else {
					alert("비밀번호가 올바르지 않습니다.");
					return;
				}
			}
		})
	});
	
	$("#btnCancel").on("click", function() {
		location.href = "/";
	})


})
</script>
<body>
	<div class="container">
		<%-- nav include --%>
		<%@ include file="/WEB-INF/jsp/include/nav.jsp"%>

		<section id="container">
			<form action="/member/memberDelete" method="post" id="delForm" name="delForm">
				<div class="form-group has-feedback">
					<label class="control-label" for="userId">아이디</label>
					<input type="text" class="form-control" id="userId" name="userId" value="${member.userId}" readonly="readonly" />
				</div>
				<div class="form-group has-feedback">
					<label class="control-label" for="password">패스워드</label>
					<input type="password" class="form-control" id="password" name="password" />
				</div>
				<div class="form-group has-feedback">
					<label class="control-label" for="userNm">성명</label> 
					<input type="text" class="form-control" id="userNm" name="userNm" value="${member.userNm}" readonly="readonly" />
				</div>
				<div class="form-group has-feedback">
					<button type="submit" class="btn btn-success" id="btnSubmit">회원탈퇴</button>
					<button type="button" class="btn btn-danger" id="btnCancel">취소</button>
				</div>
			</form>
			<div>
				<c:if test="${msg == false}">
					<p>비밀번호가 맞지 않습니다.</p>
				</c:if>
			</div>
		</section>
	</div>
</body>

</html>