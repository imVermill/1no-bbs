package com.test.bbs.dashBoard.service.impl;

import java.util.List;

import javax.inject.Inject;

import org.springframework.stereotype.Service;

import com.test.bbs.dashBoard.service.dashReplyDAO;
import com.test.bbs.dashBoard.service.dashReplyService;

@Service
public class dashReplyServiceImpl implements dashReplyService {
	
	@Inject
	private dashReplyDAO dReplyDAO;
	
	
	// dashBoard Reply Select
	@Override
	public List<dashReplyVO> selectReply(int boardNo) throws Exception {
		return dReplyDAO.selectReply(boardNo);
	}
	
	// dashBoard Reply Insert
	@Override
	public void insertReply(dashReplyVO param) throws Exception {
		dReplyDAO.insertReply(param);
	}
	
	// dashBoard Reply Update
	@Override
	public void updateReply(dashReplyVO param) throws Exception {
		dReplyDAO.updateReply(param);
	}
	
	// dashBoard Reply Delete
	@Override
	public void deleteReply(dashReplyVO param) throws Exception {
		dReplyDAO.deleteReply(param);
	}
	
	// dashBoard Reply SelectSearch
	@Override
	public dashReplyVO selectReplySearch(int replyNo) throws Exception {
		return dReplyDAO.selectReplySearch(replyNo);
	}

}
