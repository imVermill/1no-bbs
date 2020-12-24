<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
	<div class="container-xl">
		<a class="navbar-brand" href="#">Container XL</a>
		<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExample07XL" 
			aria-controls="navbarsExample07XL" aria-expanded="false" aria-label="Toggle navigation">
			<span class="navbar-toggler-icon"></span>
		</button>
		<div class="collapse navbar-collapse" id="navbarsExample07XL">
			<ul class="navbar-nav mr-auto">
				<li class="nav-item active">
					<a class="nav-link" href="#">Home<span class="sr-only">(current)</span></a>
				</li>
				<li class="nav-item"><a class="nav-link" href="/dashBoard/listView.do">dashBoard</a></li>
				<li class="nav-item"><a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Disabled</a></li>
				<li class="nav-item dropdown">
					<a class="nav-link dropdown-toggle" href="#" id="dropdown07XL" data-toggle="dropdown" aria-expanded="false">Dropdown</a>
					<div class="dropdown-menu" aria-labelledby="dropdown07XL">
						<a class="dropdown-item" href="#">Action</a> 
						<a class="dropdown-item" href="#">Another action</a> 
						<a class="dropdown-item" href="#">Something else here</a>
					</div>
				</li>
			</ul>
			<form class="form-inline my-2 my-md-0">
				<input type="text" class="form-control mr-sm-2" placeholder="Search" aria-label="Search">
				<button type="button" class="btn btn-secondary my-2 my-sm-0">Search</button>
			</form>
			<ul class="navbar-nav navbar-right">
				<li class="nav-item dropdown">
					<a class="nav-link dropdown-toggle" href="#" id="signDropDown" data-toggle="dropdown" aria-expanded="false">Sign</a>
					<div class="dropdown-menu" aria-labelledby="signDropDown">
						<a class="dropdown-item" href="/sign/signIn.do">Sign-In</a> 
						<a class="dropdown-item" href="/sign/signUp.do">Sign-Up</a> 
					</div>
				</li>
			</ul>
		</div>
	</div>
</nav>