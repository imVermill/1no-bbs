package com.test.bbs.dashBoard.service;

import java.util.List;
import java.util.Map;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.test.bbs.dashBoard.SearchCriteria;
import com.test.bbs.dashBoard.service.impl.dashBoardVO;

@Transactional
public interface dashBoardService {
	
	// Dash Board INSERT
	public void boardWrite(dashBoardVO param, String[] files, String[] fileNm, MultipartHttpServletRequest request) throws Exception;
	
	// Dash Board List SELECT
	public List<dashBoardVO> boardList(SearchCriteria param) throws Exception;
	
	// Dash Board List Count
	public int listCount(SearchCriteria param) throws Exception;
	
	// Dash Board SELECT
	@Transactional
	public dashBoardVO boardRead(int boardNo) throws Exception;
	
	// Dash Board UPDATE
	public void boardUpdate(dashBoardVO param, String[] files, String[] fileNm, MultipartHttpServletRequest request) throws Exception;
	
	// DashBoard DELETE
	public void boardDelete(int boardNo) throws Exception;
	
	// DashBoard AttchFile
	public List<Map<String, Object>> selectFileList(int boardNo) throws Exception;
	public Map<String, Object> selectFileInfo(Map<String, Object> param) throws Exception;
}
