package com.test.bbs.member.service.impl;

import java.util.Date;

public class memberVO {
	private String userId;
	private String password;
	private String userNm;
	private String userSttus;
	private Date regDate;
	
	private String email;
	private String snsYn;
	private String snsId;
	
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
	
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getSnsYn() {
		return snsYn;
	}
	public void setSnsYn(String snsYn) {
		this.snsYn = snsYn;
	}
	public String getSnsId() {
		return snsId;
	}
	public void setSnsId(String snsId) {
		this.snsId = snsId;
	}
	

	@Override
	public String toString() {
		return "memberVO [userId = " + userId + ", password = " + password 
				+ ", userNm = " + userNm + ", userSttus = " + userSttus + ", regDate = " + regDate 
				+ ", email = " + email + ", snsYn = " + snsYn + ", snsId = " + snsId + "]";
	}
}
