/*
 * Copyright 2008-2009 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.test.bbs.cmmn;

import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.test.bbs.member.service.impl.memberVO;


@Component("fileUtils")
public class commonController {
	
	/** log */
	private static final Logger logger = LoggerFactory.getLogger("CMMN");

	@RequestMapping(value = "/FileUpload.do", method = RequestMethod.POST)
	@ResponseBody
	public HashMap<String, Object> hsmsFileUpload(HttpServletRequest req, Model model ) throws Exception {

		List<FileInfoVO> fileNoList = new ArrayList<FileInfoVO>();

		HashMap<String, Object> resultMap = new HashMap<>();

		try{
			MultipartHttpServletRequest multipart = (MultipartHttpServletRequest) req;
			List<MultipartFile> files = multipart.getFiles("file[]");

			memberVO loginVo = (memberVO) req.getSession().getAttribute("loginVO");

			fileNoList = CommonService.insertFiles(files, loginVo.getUniqId(), "fileUpload");

			resultMap.put("resultStr", "1");
			resultMap.put("fileNoList", fileNoList);

		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("resultStr", "0");
			logger.error("파일업로드 중 에러 발생");
		}

		logger.debug("resultMap:" + resultMap);

		return resultMap;
	}

	@RequestMapping(value = "/ckeditorUpload.do")
	@ResponseBody
	public void ckeditorUpload(HttpServletRequest req, HttpServletResponse res, @RequestParam MultipartFile upload) throws Exception {

		String CKEditorFuncNum = req.getParameter("CKEditorFuncNum");

		List<MultipartFile> files = new ArrayList<MultipartFile>();
		files.add(upload);

		List<HsmsFileInfoVO> uploadVo = new ArrayList<>();

		memberVO loginVo = (memberVO) req.getSession().getAttribute("loginVO");

		uploadVo = commonService.insertFiles(files, loginVo.getUserId(), "ckeditor");

		res.setContentType("text/html; charset=UTF-8");
        PrintWriter out = res.getWriter();

        out.println("<script>\nwindow.parent.CKEDITOR.tools.callFunction("+CKEditorFuncNum+", '" + uploadVo.get(0).getFileCours().replaceAll("\\\\","/") + uploadVo.get(0).getChangeFileNm() + "." + uploadVo.get(0).getChangeFileExtsn() + "', '');\n window.parent.fileUploadSuccessList.push("+uploadVo.get(0).getFileNo()+")</script>");
        out.flush();
        out.close();

        return;
	}

}
