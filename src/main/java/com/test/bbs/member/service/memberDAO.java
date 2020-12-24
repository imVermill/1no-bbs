package com.test.bbs.member.service;

import javax.inject.Inject;

import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Repository;

import com.test.bbs.member.service.impl.memberVO;


@Repository
public class memberDAO {
	
	@Inject
	private SqlSession sqlSession;
	
	// member signUp
	public void signUp(memberVO param) throws Exception {
		sqlSession.insert("bbs.member.signUp", param);
	}
	
	// member signIn
	public memberVO signIn(memberVO param) throws Exception {
		return sqlSession.selectOne("bbs.member.signIn", param);
	}
	
	// member signEdit
	public void signEdit(memberVO param) throws Exception {
		sqlSession.update("bbs.member.signEdit", param);
	}
	
	// user_sttus Dead
	public void signDrawal(memberVO param) throws Exception {
		sqlSession.update("bbs.member.signDrawal", param);
	}
	
	// chkedUserInfo
	public int chkedUserInfo(memberVO param) throws Exception {
		return sqlSession.selectOne("bbs.member.chkedUserInfo", param);
	}
}
