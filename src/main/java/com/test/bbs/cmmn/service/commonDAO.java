package com.test.bbs.cmmn.service;


import java.util.HashMap;
import java.util.Map;

import javax.inject.Inject;

import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Repository;

import com.test.bbs.cmmn.service.impl.filesInfoVO;

@Repository
public class commonDAO {
	
	@Inject
	private SqlSession sqlSession;
	

	/**
	 * @param fileInfoVo - 업로드할 파일이 담긴 VO
	 * @return
	 * @exception Exception
	 */
	public int insertFiles(filesInfoVO fileInfoVo) throws Exception {
		return sqlSession.insert("bbs.common.insertFiles", fileInfoVo);
	}

	/**
	 * 업로드파일의 System Program 정보 수정
	 * @param HashMap 파일의 프로그램정보
	 * @return int
	 * @throws Exception
	 */
	public int updateFileSysProgrm(HashMap<String, Object> param) throws Exception {
		return sqlSession.update("bbs.common.updateFileSysProgrm", param);
	}

	/**
	 * 업로드파일정보 삭제처리 (use_yn = 'N')
	 * @param HashMap 파일정보
	 * @return int
	 * @throws Exception
	 */
	public int updateFileDelete(HashMap<String, Object> param) throws Exception {
		return sqlSession.update("bbs.common.updateFileDelete", param);
	}

	/**
	 * 업로드파일정보 완전삭제 (delete)
	 * @param HashMap 파일정보
	 * @return int
	 * @throws Exception
	 */
	public int deleteFileManage(HashMap<String, Object> param) throws Exception {
		return sqlSession.update("bbs.common.deleteFileManage", param);
	}

	/**
	 * 첨부파일 다운로드용 파일정보 조회
	 * @param fileNo
	 * @return EgovMap file 정보
	 * @exception Exception
	 */
	public Map<String, Object> selectFileDown(HashMap<String, Object> param) {
		return sqlSession.selectOne("bbs.common.selectFileDown", param);
	}

}
