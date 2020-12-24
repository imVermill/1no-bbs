package com.test.bbs.dashBoard.service;


import java.util.List;
import java.util.Map;

import javax.inject.Inject;

import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Repository;

import com.test.bbs.dashBoard.SearchCriteria;
import com.test.bbs.dashBoard.service.impl.dashBoardVO;

@Repository
public class dashBoardDAO {
	
	@Inject
	private SqlSession sqlSession;
	
	// Dash Board INSERT
	public void boardWrite(dashBoardVO param) throws Exception {
		sqlSession.insert("bbs.dashBoard.insert", param);
	}
	
	
	// Dash Board List SELECT
	public List<dashBoardVO> boardList(SearchCriteria param) throws Exception {
		// TODO Auto-generated method stub
		return sqlSession.selectList("bbs.dashBoard.list", param);
	}
	
	// Dash Board List Count
	public int listCount(SearchCriteria param) throws Exception {
		// TODO Auto-generated method stub
		return sqlSession.selectOne("bbs.dashBoard.listCount", param);
	}
	
	// Dash Board SELECT
	public dashBoardVO boardRead(int boardNo) throws Exception {
		return sqlSession.selectOne("bbs.dashBoard.read", boardNo);
	}
	
	// Dash Board UPDATE
	public void boardUpdate(dashBoardVO param) throws Exception {
		sqlSession.update("bbs.dashBoard.update", param);
	}
	
	// DashBoard DELETE
	public void boardDelete(int boardNo) throws Exception {
		sqlSession.delete("bbs.dashBoard.delete", boardNo);
	}
	
	public void insertFile(Map<String, Object> param) throws Exception {
		// TODO Auto-generated method stub
		sqlSession.insert("bbs.dashBoard.insertFile", param);
	}
}
