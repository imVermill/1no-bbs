package com.test.bbs.cmmn.web;

import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.test.bbs.cmmn.service.commonService;
import com.test.bbs.cmmn.service.impl.fileInfoVO;
import com.test.bbs.member.service.impl.memberVO;

@Controller
public class commonController {

	@Inject
	commonService cmmnService;
	
	private static final Logger logger = LoggerFactory.getLogger(commonController.class);
	

	@RequestMapping(value = "/fileUpload.do", method = RequestMethod.POST)
	@ResponseBody
	public HashMap<String, Object> fileUpload(HttpServletRequest req, Model model) throws Exception {

		List<fileInfoVO> fileNoList = new ArrayList<fileInfoVO>();

		HashMap<String, Object> resultMap = new HashMap<>();

		try {
			MultipartHttpServletRequest multipart = (MultipartHttpServletRequest) req;
			List<MultipartFile> files = multipart.getFiles("file[]");

			memberVO memberVo = (memberVO) req.getSession().getAttribute("loginVO");

			fileNoList = cmmnService.insertFiles(files, memberVo.getUserId(), "fileUpload");

			resultMap.put("resultStr", "1");
			resultMap.put("fileNoList", fileNoList);

		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("resultStr", "0");
			logger.error("파일업로드 중 에러 발생");
		}
		logger.debug("==> resultMap : " + resultMap);

		return resultMap;
	}

	@RequestMapping(value = "/ckeditorUpload.do")
	@ResponseBody
	public void ckeditorUpload(HttpServletRequest req, HttpServletResponse res, @RequestParam MultipartFile upload) throws Exception {

		String CKEditorFuncNum = req.getParameter("CKEditorFuncNum");

		List<MultipartFile> files = new ArrayList<MultipartFile>();
		files.add(upload);

		List<fileInfoVO> uploadVo = new ArrayList<>();

		memberVO memberVo = (memberVO) req.getSession().getAttribute("loginVO");
		uploadVo = cmmnService.insertFiles(files, memberVo.getUserId(), "ckeditor");

		res.setContentType("text/html; charset=UTF-8");
        PrintWriter out = res.getWriter();

        out.println("<script>\nwindow.parent.CKEDITOR.tools.callFunction(" + CKEditorFuncNum + ", '" + uploadVo.get(0).getFileCours().replaceAll("\\\\","/") 
        			+ uploadVo.get(0).getChangeFileNm() + "." + uploadVo.get(0).getChangeFileExtsn() + "', '');\n window.parent.fileUploadSuccessList.push("+uploadVo.get(0).getFileNo()+")</script>");
        out.flush();
        out.close();

        return;
	}
	
}
