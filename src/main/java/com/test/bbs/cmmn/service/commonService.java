package com.test.bbs.cmmn.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.multipart.MultipartFile;

import com.test.bbs.cmmn.service.impl.filesInfoVO;

public interface commonService {

	/**
	 * 파일업로드 처리
	 * @param string
	 * @param HttpServletRequest 파일정보가 담긴 파라미터
	 * @return
	 */
	public List<filesInfoVO> insertFiles(List<MultipartFile> files, String userId, String uploadTy) throws Exception;

	/**
	 * 업로드파일의 System Program 정보 수정
	 * @param HashMap 파일의 프로그램정보(sysProgrmNm, sysProgrmNo, fileNo)
	 * @return int
	 * @throws Exception
	 */
	public int saveFileSysProgrm(HashMap<String, Object> param) throws Exception;

	/**
	 * 업로드파일정보 삭제처리 (use_yn = 'N')
	 * @param HashMap 파일정보 (sysProgrmNm, sysProgrmNo, fileNo)
	 * @return int
	 * @throws Exception
	 */
	public int saveFileDelete(HashMap<String, Object> param) throws Exception;

	/**
	 * 파일다운로드 첨부파일 정보 조회
	 * @param 파일 조회 정보
	 * @return
	 */
	public Map<String, Object> selectFileDown(HashMap<String, Object> param) throws Exception;

	/**
	 * 엑셀다운로드
	 * @throws Exception
	 */
	public void excelDownload(HttpServletRequest request, HttpServletResponse response, Map<String, Object> bean, String fileName, String templateFile) throws Exception;

}
