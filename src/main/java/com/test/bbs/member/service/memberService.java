package com.test.bbs.member.service;

import com.test.bbs.member.service.impl.memberVO;

public interface memberService {
	
	// member signUp
	public void signUp(memberVO param) throws Exception;
	
	// member signIn
	public memberVO signIn(memberVO param) throws Exception;
	
	// member signEdit
	public void signEdit(memberVO param) throws Exception;

	// user_sttus Dead
	public void signDrawal(memberVO param) throws Exception;
	
	// chkedUserInfo
	public int chkedUserInfo(memberVO param) throws Exception;
}
