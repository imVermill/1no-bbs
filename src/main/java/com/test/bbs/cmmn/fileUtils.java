package com.test.bbs.cmmn;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.test.bbs.dashBoard.service.impl.dashBoardVO;

@Component("fileUtils")
public class fileUtils {
	private static final String filePath = "C:\\DevTools\\downloads";
	
	public List<Map<String, Object>> parseInsertFileInfo(dashBoardVO param, MultipartHttpServletRequest mphr) throws Exception {
		/*
		 * Iterator은 데이터들의 집합체에서 컬렉션으로부터 정보를 얻어올 수 있는 인터페이스
		 * List, Array 순차적으로 데이터의 접근 가능, Map등의 클래스들은 순차적으로 접근 불가능
		 */
		Iterator<String> iterator = mphr.getFileNames();
		
		MultipartFile multipartfile = null;
		String orgFileName = null;
		String orgFileExtension = null;
		String chngFileName = null;
		
		List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
		Map<String, Object> listMap = null;
		
		int boardNo = param.getBoardNo();
		
		File file = new File(filePath);
		if (file.exists() == false) {
			file.mkdirs();
		}
		
		while(iterator.hasNext()) {
			multipartfile = mphr.getFile(iterator.next());
			if(multipartfile.isEmpty() == false) {
				orgFileName = multipartfile.getOriginalFilename();
				orgFileExtension = orgFileName.substring(orgFileName.lastIndexOf("."));
				chngFileName = getRandomString() + orgFileExtension;
				
				file = new File(filePath + chngFileName);
				multipartfile.transferTo(file);
				listMap = new HashMap<String, Object>();
				listMap.put("BOARDNO", boardNo);
				listMap.put("ORG_FILE_NAME", orgFileName);
				listMap.put("STORED_FILE_NAME", chngFileName);
				listMap.put("FILE_SIZE", multipartfile.getSize());
				list.add(listMap);
			}
		}
		return list;
	}
	
	public static String getRandomString() {
		return UUID.randomUUID().toString().replaceAll("-", "");
	}
}
