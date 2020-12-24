package com.test.bbs.dashBoard.service;

import java.util.List;

import javax.inject.Inject;

import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Repository;

import com.test.bbs.dashBoard.service.impl.dashReplyVO;

@Repository
public class dashReplyDAO {

	@Inject
	SqlSession sqlsession;
	
	// dashBoard Reply Select
	public List<dashReplyVO> selectReply(int boardNo) throws Exception {
		return sqlsession.selectList("bbs.dashReply.selectReply", boardNo);
	}
	
	// dashBoard Reply Insert
	public void insertReply(dashReplyVO param) throws Exception {
		sqlsession.insert("bbs.dashReply.insertReply", param);
	}
	
	// dashBoard Reply Update
	public void updateReply(dashReplyVO param) throws Exception {
		sqlsession.update("bbs.dashReply.updateReply", param);
	}
	
	// dashBoard Reply Delete
	public void deleteReply(dashReplyVO param) throws Exception {
		sqlsession.delete("bbs.dashReply.deleteReply", param);
	}
	
	// dashBoard Reply SelectSearch
	public dashReplyVO selectReplySearch(int replyNo) throws Exception {
		return sqlsession.selectOne("bbs.dashReply.selectReplySearch", replyNo);
	}
}
