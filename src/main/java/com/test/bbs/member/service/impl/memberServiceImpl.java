package com.test.bbs.member.service.impl;

import javax.inject.Inject;

import org.springframework.stereotype.Service;

import com.test.bbs.member.service.memberDAO;
import com.test.bbs.member.service.memberService;

@Service
public class memberServiceImpl implements memberService {
	
	@Inject
	memberDAO mDAO;
	
	// member signUp
	@Override
	public void signUp(memberVO param) throws Exception {
		mDAO.signUp(param);
	}
	
	// member signIn
	@Override
	public memberVO signIn(memberVO param) throws Exception {
		return mDAO.signIn(param);
	}
	
	// member signEdit
	@Override
	public void signEdit(memberVO param) throws Exception {
		mDAO.signEdit(param);
	}
	
	// user_sttus Dead
	@Override
	public void signDrawal(memberVO param) throws Exception {
		mDAO.signDrawal(param);
	}
	
	// chkedUserInfo
	@Override
	public int chkedUserInfo(memberVO param) throws Exception {
		return mDAO.chkedUserInfo(param);
	}
}
