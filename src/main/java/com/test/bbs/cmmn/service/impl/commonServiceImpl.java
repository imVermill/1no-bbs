package com.test.bbs.cmmn.service.impl;

import java.util.List;
import java.util.Map;

import javax.inject.Inject;

import org.springframework.stereotype.Service;

import com.test.bbs.cmmn.service.commonDAO;
import com.test.bbs.cmmn.service.commonService;
@Service
public class commonServiceImpl implements commonService {
	
	@Inject
	private commonDAO cmmnDAO;
	
	@Override
	public List<Map<String, Object>> selectFileList(int boardNo) throws Exception {
		return cmmnDAO.selectFileList(boardNo);
	}
	
	@Override
	public Map<String, Object> selectFileInfo(Map<String, Object> param) throws Exception {
		return cmmnDAO.selectFileInfo(param);
	}
}
