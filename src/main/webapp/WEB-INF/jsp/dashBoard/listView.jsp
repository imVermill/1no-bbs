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
	
	$('#bbsData').DataTable( {
		paging : true,
        ordering : false,
        info : true,
        lengthMenu : [[10, 30, 50, -1], [10, 30, 50, "All"]],
        scrollX : true,
        scrollY : 200,
        autoWidth : true,
        ajax : {
        	 "type" : "POST"
        	,"url" : "<c:url value='/dashBoard/listAjax.do'/>"
        	,"dataType" : "JSON"
        },
        columns : [
        	 {"data" : "boardNo", 		"name" : "boardNo", 		"title" : "번호", 		"width" : "80"}
        	,{"data" : "boardTitle", 	"name" : "boardTitle", 		"title" : "제목", 		"width" : "400"}
        	,{"data" : "boardWriter", 	"name" : "boardWriter", 	"title" : "작성자", 	"width" : "200"}
        	,{"data" : "regDate", 		"name" : "regDate", 		"title" : "등록일", 	"width" : "200"}
        	,{"data" : "views", 		"name" : "views", 			"title" : "조회수", 	"width" : "100"}
        ],
        columnDefs : [
        	 {targets : [1], 		"className" : "dt-body-left",		"render" : $.fn.dataTable.render.text()}
        	,{targets : [0], 		"className" : "dt-body-right",		"render" : $.fn.dataTable.render.text()}
        	,{targets : [2,3,4],	"className" : "dt-body-center",		"render" : $.fn.dataTable.render.text()}
        ],
        buttons : [
        	'copy', 'csv', 'excel'
        ]
        
    } );
	
	$('#bbsData tbody').on('dblclick', 'tr', function() {
		var data = $('#bbsData').DataTable().row(this).data();
		
		var boardNo = data.boardNo;
		//검색함수
		console.log(boardNo);
	})
})

</script>
<body>
	<div class="container">
	
	<%-- nav include --%>
	<%@ include file="/WEB-INF/jsp/include/nav.jsp" %>

		<section id="container" style="margin-top: 10px; margin-bottom: 10px;">
			<form role="form" method="get">
			
			
			</form>
			<table class="table table-hover" id="bbsData">
				</table>
		</section>
		<hr />
	</div>
</body>
</html>