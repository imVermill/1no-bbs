package com.test.bbs.dashBoard.service.impl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.inject.Inject;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.test.bbs.cmmn.fileUtils;
import com.test.bbs.dashBoard.SearchCriteria;
import com.test.bbs.dashBoard.service.dashBoardDAO;
import com.test.bbs.dashBoard.service.dashBoardService;

@Service
public class dashBoardServiceImpl implements dashBoardService {
	
	@Resource (name="fileUtils")
	private fileUtils fileutils;
	
	@Inject
	private dashBoardDAO dBoardDAO;
	
	// Dash Board INSERT
	@Override
	public void boardWrite(dashBoardVO param, String[] files, String[] fileNm, MultipartHttpServletRequest request) throws Exception {
		dBoardDAO.boardWrite(param);
		
		List<Map<String, Object>> list = fileutils.parseInsertFileInfo(param, files, fileNm, request);
		int size = list.size();
		for(int i=0; i<size; i++) {
			dBoardDAO.insertFile(list.get(i));
		}
	}
	
	// Dash Board List SELECT
	@Override
	public List<dashBoardVO> boardList(SearchCriteria param) throws Exception {
		return dBoardDAO.boardList(param);
	}
	
	// Dash Board List Count
	@Override
	public int listCount(SearchCriteria param) throws Exception {
		return dBoardDAO.listCount(param);
	}
	
	// Dash Board SELECT
	@Transactional(isolation = Isolation.READ_COMMITTED)
	@Override
	public dashBoardVO boardRead(int boardNo) throws Exception {
		dBoardDAO.updateViews(boardNo);
		return dBoardDAO.boardRead(boardNo);
	}
	
	// Dash Board UPDATE
	@Override
	public void boardUpdate(dashBoardVO param, String[] files, String[] fileNm, MultipartHttpServletRequest request) throws Exception {
		dBoardDAO.boardUpdate(param);
		
		List<Map<String, Object>> list = fileutils.parseInsertFileInfo(param, files, fileNm, request);
		Map<String, Object> tempMap = null;
		int size = list.size();
		for(int i = 0; i < size; i++) {
			tempMap = list.get(i);
			if(tempMap.get("IS_NEW").equals("N")) {
				dBoardDAO.insertFile(tempMap);
			} else {
				dBoardDAO.updateFile(tempMap);
			}
		}
	}
	
	// DashBoard DELETE
	@Override
	public void boardDelete(int boardNo) throws Exception {
		dBoardDAO.boardDelete(boardNo);
	}
	
	// DashBoard AttchFile
	@Override
	public List<Map<String, Object>> selectFileList(int boardNo) throws Exception {
		return dBoardDAO.selectFileList(boardNo);
	}
	@Override
	public Map<String, Object> selectFileInfo(Map<String, Object> param) throws Exception {
		return dBoardDAO.selectFileInfo(param);
	}

}
