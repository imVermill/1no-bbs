package com.test.bbs.dashBoard.service;

import java.util.List;

import com.test.bbs.dashBoard.service.impl.dashReplyVO;

public interface dashReplyService {
	
	// dashBoard Reply Select
	public List<dashReplyVO> selectReply(int boardNo) throws Exception;
	
	// dashBoard Reply Insert
	public void insertReply(dashReplyVO param) throws Exception;
	
	// dashBoard Reply Update
	public void updateReply(dashReplyVO param) throws Exception;
	
	// dashBoard Reply Delete
	public void deleteReply(dashReplyVO param) throws Exception;
	
	// dashBoard Reply SelectSearch
	public dashReplyVO selectReplySearch(int replyNo) throws Exception;

}
