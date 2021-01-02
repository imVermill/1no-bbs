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

<div class="container">
	
	<%-- nav include --%>
	<%@ include file="/WEB-INF/jsp/include/nav.jsp" %>
	
		<section id="container">

			<div class="col-md-6 main-block-left">
				<div class="panel panel-default">
					<div class="panel-heading">
						<h5 class="panel-header">아이디 로그인</h5>
					</div>

					<form action="/sign/signIn.do" class="form-signin form-user panel-body panel-margin" method="POST" id='loginForm' autocomplete='off'>
						<input type="hidden" name="redirectUrl" value="%2F" />
						<input type="text" name="username" autocorrect="off" autocapitalize="off" id="username"
							class="username form-control input-sm" placeholder="아이디" required autofocus>
						<input type="password" name='password' class="password form-control input-sm" placeholder="비밀번호" required>
						<div class="checkbox">
							<label>
								<input type="checkbox" name="remember_me" id="remember_me"> 로그인 유지
							</label>
						</div>
						
						<div id="divUserLogin">
							<button class="btn btn-primary btn-block" type="submit"
								id="btnUserLogin">로그인</button>
						</div>
						
						<div class="signup-block">
							<a href="/find/user/index">계정 찾기</a>
							<span class="inline-saperator">/</span>
							<a href="/user/register">회원가입</a>
						</div>
					</form>
				</div>
			</div>
			
			<div class="col-md-6 main-block-right">
				<div class="panel panel-default">
					<div class="panel-heading">
						<h5 class="panel-header">SNS 로그인</h5>
					</div>
					<div class="panel-body panel-margin sns-buttons">
						<a href="/oauth2/authorization/facebook" id="facebook-connect-link" class="btn btn-facebook btn-block">
							<i class="fa fa-facebook fa-fw"></i> Facebook 으로 로그인
						</a>
						<a href="/oauth2/authorization/google" id="google-connect-link" class="btn btn-google btn-block">
							<i class="fa fa-google fa-fw"></i> Google 로 로그인
						</a>
					</div>
				</div>
			</div>

		</section>
		
</div>
</body>
</html>