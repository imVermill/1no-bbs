package com.test.bbs.dashBoard.service;

import java.util.List;

import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.test.bbs.dashBoard.SearchCriteria;
import com.test.bbs.dashBoard.service.impl.dashBoardVO;

public interface dashBoardService {
	
	// Dash Board INSERT
	public void boardWrite(dashBoardVO param, MultipartHttpServletRequest mphr) throws Exception;
	
	// Dash Board List SELECT
	public List<dashBoardVO> boardList(SearchCriteria param) throws Exception;
	
	// Dash Board List Count
	public int listCount(SearchCriteria param) throws Exception;
	
	// Dash Board SELECT
	public dashBoardVO boardRead(int boardNo) throws Exception;
	
	// Dash Board UPDATE
	public void boardUpdate(dashBoardVO param) throws Exception;
	
	// DashBoard DELETE
	public void boardDelete(int boardNo) throws Exception;
}
