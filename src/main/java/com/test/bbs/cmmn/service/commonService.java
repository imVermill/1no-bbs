package com.test.bbs.cmmn.service;

import java.util.List;
import java.util.Map;


public interface commonService {
	public List<Map<String, Object>> selectFileList(int boardNo) throws Exception;
	
	public Map<String, Object> selectFileInfo(Map<String, Object> param) throws Exception;
}
