package com.test.bbs.cmmn.service.impl;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.test.bbs.cmmn.service.commonDAO;
import com.test.bbs.cmmn.service.commonService;
import com.test.bbs.cmmn.web.commonController;

@Service
public class commonServiceImpl implements commonService {
	
	private static final Logger logger = LoggerFactory.getLogger(commonController.class);
	
	@Inject
	private commonDAO cmmnDAO;
	

	/**
	 * 파일업로드 처리
	 * @param HttpServletRequest 파일정보가 담긴 파라미터
	 * @return
	 */
	@Override
	public List<fileInfoVO> insertFiles(List<MultipartFile> files, String userId, String uploadTy) throws Exception {

		String extSnList = "xlsx|xls|hwp|doc|ppt|pptx|pdf|txt|jpg|png|gif|bmp|zip|7z|rar";
		for(MultipartFile file : files) {
			String fileName = file.getOriginalFilename();
			String extSn = fileName.substring(fileName.lastIndexOf(".")+1);
		}

		long nowDate = System.currentTimeMillis();
		SimpleDateFormat yyyySdf = new SimpleDateFormat("yyyy");
		SimpleDateFormat mmSdf = new SimpleDateFormat("MM");
		SimpleDateFormat ddSdf = new SimpleDateFormat("dd");

		String uploadPath_folder = yyyySdf.format(new Date(nowDate)) + "/" + mmSdf.format(new Date(nowDate)) + "/" 
				+ ddSdf.format(new Date(nowDate)) + "/";

		String sysMode =  (System.getProperty("sys.mode") == null) ? "" : System.getProperty("sys.mode");

		// 업로드 파일 저장 PATH
		String uploadPath = "C:\\Users\\Public\\Downloads" + uploadPath_folder;
		
		// 업로드 파일 URL
		String fileUrl = "/upload/";

		File saveFolder = new File(uploadPath);

		if (!saveFolder.exists() || saveFolder.isFile()) {
			saveFolder.mkdirs();
		}


		List<fileInfoVO> fileInfoList = new ArrayList<fileInfoVO>();
		for(MultipartFile file : files) {
			if (!"".equals(file.getOriginalFilename())) {
				String fileName = file.getOriginalFilename();
				fileInfoVO fileInfoVo = new fileInfoVO();

				//밀리세컨드로 현재시간 구해서 파일명에 적용
				long time = System.currentTimeMillis();
				SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmssSSS");
				String changeFileName = sdf.format(new Date(time));
				String changeFileExtsm = "myFiles";
				String filePath = uploadPath + changeFileName+"."+changeFileExtsm;
				String serverPath = uploadPath_folder;

				fileInfoVo.setFileCours(serverPath);
				fileInfoVo.setFileNm(file.getOriginalFilename());
				fileInfoVo.setFileExtsn(fileName.substring(fileName.lastIndexOf(".")+1));
				fileInfoVo.setChangeFileNm(changeFileName);
				fileInfoVo.setChangeFileExtsn(changeFileExtsm);
				fileInfoVo.setFrstRegisterId(userId);
				fileInfoVo.setLastUpdusrId(userId);
				fileInfoVo.setFileMg(file.getSize()+"");
				fileInfoVo.setUploadTy(uploadTy);

				try{
					cmmnDAO.insertFiles(fileInfoVo);

					// save file
					file.transferTo(new File(filePath));

					// change file url and return file info to web page. ckeditor use file info
					fileInfoVo.setFileCours(fileUrl + serverPath);
					fileInfoList.add(fileInfoVo);

				} catch (Exception e) {
					e.printStackTrace();
					logger.error("==> fileUpload Err!!");
				}
			}
		}
		return fileInfoList;
	}

	/**
	 * 업로드파일의 System Program 정보 수정
	 * @param HashMap 파일의 프로그램정보(sysProgrmNm, sysProgrmNo, fileNo)
	 * @return int
	 * @throws Exception
	 */
	@Override
	public int saveFileSysProgrm(HashMap<String, Object> param) throws Exception {
		return cmmnDAO.updateFileSysProgrm(param);
	}

	/**
	 * 업로드파일정보 삭제처리(use_yn = 'N')
	 * @param HashMap 파일정보(sysProgrmNm, sysProgrmNo, fileNo)
	 * @return int
	 * @throws Exception
	 */
	@Override
	public int saveFileDelete(HashMap<String, Object> param) throws Exception {
		return cmmnDAO.updateFileDelete(param);
	}

	/**
	 * 파일다운로드 첨부파일 정보 조회
	 * @param 파일 조회 정보
	 * @return
	 */
	@Override
	public Map selectFileDown(HashMap<String, Object> param) throws Exception {
		return cmmnDAO.selectFileDown(param);
	}

	/**
	 * 엑셀다운로드
	 * @param request, response, bean : 데이터가 담긴 맵, fileName : 다운받을 때 파일명, templateFile : 샘플파일명
	 * @return
	 */
	@Override
	public void excelDownload(HttpServletRequest request, HttpServletResponse response, Map<String, Object> bean, String fileName, String templateFile) throws Exception {
		String tempPath = request.getSession().getServletContext().getRealPath("/WEB-INF/template");
        try {
            InputStream is = new BufferedInputStream(new FileInputStream(tempPath + "\\" + templateFile));
            XLSTransformer xls = new XLSTransformer();
            Workbook workbook;
			workbook = xls.transformXLS(is, bean);
			
			String header =request.getHeader("User-Agent");
			String encodingFileName = "";
			if(header.contains("MSIE") || header.contains("Trident")) {
				encodingFileName = URLEncoder.encode(fileName,"UTF-8").replaceAll("\\+", "%20");
			}else{
				encodingFileName = new String(fileName.getBytes("UTF-8"), "ISO-8859-1");
			}

            response.setHeader("Content-Disposition", "attachment; filename=\"" + encodingFileName + ".xlsx\"");

            OutputStream os = response.getOutputStream();

            workbook.write(os);
        } catch (ParsePropertyException | IOException e) {
            e.printStackTrace();
        }
	}

	
}
