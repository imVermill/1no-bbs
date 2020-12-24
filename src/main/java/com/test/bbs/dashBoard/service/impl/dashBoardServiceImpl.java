package com.test.bbs.dashBoard.service.impl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.inject.Inject;

import org.springframework.stereotype.Service;
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
	public void boardWrite(dashBoardVO param, MultipartHttpServletRequest mphr) throws Exception {
		dBoardDAO.boardWrite(param);
		
		List<Map<String, Object>> list = fileutils.parseInsertFileInfo(param, mphr);
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
	@Override
	public dashBoardVO boardRead(int boardNo) throws Exception {
		return dBoardDAO.boardRead(boardNo);
	}
	
	// Dash Board UPDATE
	@Override
	public void boardUpdate(dashBoardVO param) throws Exception {
		dBoardDAO.boardUpdate(param);
	}
	
	// DashBoard DELETE
	@Override
	public void boardDelete(int boardNo) throws Exception {
		dBoardDAO.boardDelete(boardNo);
	}

}
