package com.test.bbs.member.service.impl;

import java.util.Date;

public class memberVO {
	private String userId;
	private String password;
	private String userNm;
	private Date regDate;
	private String userSttus;
	
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getUserNm() {
		return userNm;
	}
	public void setUserNm(String userNm) {
		this.userNm = userNm;
	}
	public Date getRegDate() {
		return regDate;
	}
	public void setRegDate(Date regDate) {
		this.regDate = regDate;
	}
	public String getUserSttus() {
		return userSttus;
	}
	public void setUserSttus(String userSttus) {
		this.userSttus = userSttus;
	}
	
	@Override
	public String toString() {
		return "memberVO [userId = " + userId + ", password = " + password + ", userNm = " + userNm 
				+ ", regDate = " + regDate + ", userSttus = " + userSttus + "]";
	}
}
