package com.test.bbs.cmmn.service;

import javax.inject.Inject;

import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Repository;

@Repository
public class commonDAO {
	
	@Inject
	private SqlSession sqlSession;
	
}
