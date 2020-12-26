package com.test.bbs.cmmn.web;

import java.io.File;
import java.net.URLEncoder;
import java.util.Map;

import javax.inject.Inject;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.test.bbs.cmmn.service.commonService;

@Controller
public class commonController {

	@Inject
	commonService cmmnService;
	
	private static final Logger logger = LoggerFactory.getLogger(commonController.class);
	
	@RequestMapping(value = "/fileDown.do")
	public void fileDown(@RequestParam Map<String, Object> param, HttpServletResponse hsrs) throws Exception {
		logger.info("==> cmmn/fileDown");
		
		Map<String, Object> resultMap = cmmnService.selectFileInfo(param);
		String orgFileName = (String) resultMap.get("ORG_FILE_NAME");
		String chngFileName = (String) resultMap.get("CHNG_FILE_NAME");
		
		// 파일을 저장했던 위치에서 첨부파일을 읽어 byte[]형식 변환
		byte fileByte[] = org.apache.commons.io.FileUtils.readFileToByteArray(new File("C:\\DevTools\\downloads" + chngFileName));
		
		hsrs.setContentType("application/octet-stream");
		hsrs.setContentLength(fileByte.length);
		hsrs.setHeader("Content-Disposition", "attachment; fileName=\"" + URLEncoder.encode(orgFileName, "UTF-8") + "\";");
		hsrs.getOutputStream().write(fileByte);
		hsrs.getOutputStream().flush();
		hsrs.getOutputStream().close();
	}
}
