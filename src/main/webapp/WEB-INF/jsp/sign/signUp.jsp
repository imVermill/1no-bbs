<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>

<%-- include declare --%>
<%@ include file="/WEB-INF/jsp/include/declare.jsp"%>
</head>
<script type="text/javascript">
$(document).ready(function() {
	$("#btnRegist").on("click", function() {
		if ($("#userId").val() == "") {
			alert("아이디를 입력해주세요.");
			$("#userId").focus();
			return false;
		}
		if ($("#password").val() == "") {
			alert("비밀번호를 입력해주세요.");
			$("#password").focus();
			return false;
		}
		if ($("#userNm").val() == "") {
			alert("성명을 입력해주세요.");
			$("#userNm").focus();
			return false;
		}
	});
	
	$("#btnCancel").on("click", function() {
		location.href = "/sign/signIn.do";
	});

})

function isChkedId() {
	$.ajax({
		  url : "/sign/chkedUserInfo.do"
		, type : "POST"
		, dataType : "json"
		, data : {"userId" : $("#userId").val()}
		, success : function(data) {
			if (!data) {
				$("#chkUserId").attr("value", "Y");
				alert("사용 가능한 아이디입니다.");
			} else {
				alert("중복된 아이디입니다.");
				return false;
			}
		}
	})
}
</script>
<body>
	<div class="container">

		<%-- nav include --%>
		<%@ include file="/WEB-INF/jsp/include/nav.jsp"%>
		
		<section id="container">
			<form action="/sign/signUpAjax.do" method="post">
				<div class="form-group has-feedback">
					<label class="control-label" for="userId">아이디</label> 
					<input type="text" class="form-control" id="userId" name="userId" />
					<button type="button" class="btn btn-primary" id="userIdChk" name="userIdChk" onclick="isChkedId()" value="N">중복확인</button>
				</div>
				<div class="form-group has-feedback">
					<label class="control-label" for="password">패스워드</label> 
					<input type="password" class="form-control" id="password" name="password" />
				</div>
				<div class="form-group has-feedback">
					<label class="control-label" for="userNm">성명</label> 
					<input type="text" class="form-control" id="userNm" name="userNm" />
				</div>
				<div class="form-group has-feedback">
					<button type="submit" class="btn btn-success" id="btnRegist" name="btnRegist">회원가입</button>
					<button type="button" class="btn btn-danger" id="btnCancel" name="btnCancel">취소</button>
				</div>
			</form>
		</section>
	</div>

</body>

</html>