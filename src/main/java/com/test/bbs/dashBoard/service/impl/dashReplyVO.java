package com.test.bbs.dashBoard.service.impl;

import java.util.Date;

public class dashReplyVO {
	private int boardNo;
	private int replyNo;
	private String replyContent;
	private String replyWriter;
	private Date regDate;

	
	public int getBoardNo() {
		return boardNo;
	}
	public void setBoardNo(int boardNo) {
		this.boardNo = boardNo;
	}
	public int getReplyNo() {
		return replyNo;
	}
	public void setReplyNo(int replyNo) {
		this.replyNo = replyNo;
	}
	public String getReplyContent() {
		return replyContent;
	}
	public void setReplyContent(String replyContent) {
		this.replyContent = replyContent;
	}
	public String getReplyWriter() {
		return replyWriter;
	}
	public void setReplyWriter(String replyWriter) {
		this.replyWriter = replyWriter;
	}
	public Date getRegDate() {
		return regDate;
	}
	public void setRegDate(Date regDate) {
		this.regDate = regDate;
	}
	
	@Override
	public String toString() {
		return "dashReplyVO [boardNo=" + boardNo + ", replyNo=" + replyNo + ", replyContent=" + replyContent + 
				", replyWriter=" + replyWriter + ", regDate=" + regDate + "]";
	}
}
