package com.test.bbs.cmmn.service;

import java.util.List;
import java.util.Map;

import javax.inject.Inject;

import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Repository;

@Repository
public class commonDAO {
	
	@Inject
	private SqlSession sqlSession;
	
	public List<Map<String, Object>> selectFileList(int boardNo) throws Exception {
		// TODO Auto-generated method stub
		return sqlSession.selectList("bbs.common.selectFileList", boardNo);
	}
	
	public Map<String, Object> selectFileInfo(Map<String, Object> param) throws Exception {
		// TODO Auto-generated method stub
		return sqlSession.selectOne("bbs.common.selectFileInfo", param);
	}
}
