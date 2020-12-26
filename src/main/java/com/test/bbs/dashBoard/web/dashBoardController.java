package com.test.bbs.dashBoard.web;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.test.bbs.cmmn.service.commonService;
import com.test.bbs.dashBoard.PageMaker;
import com.test.bbs.dashBoard.SearchCriteria;
import com.test.bbs.dashBoard.service.dashReplyService;
import com.test.bbs.dashBoard.service.dashBoardService;
import com.test.bbs.dashBoard.service.impl.dashBoardVO;
import com.test.bbs.dashBoard.service.impl.dashReplyVO;

import java.io.File;
import java.net.URLEncoder;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;
import javax.servlet.http.HttpServletResponse;

@Controller
public class dashBoardController {
	
	private static final Logger logger = LoggerFactory.getLogger(dashBoardController.class);
	
	@Inject
	dashBoardService dBoardService;
	
	@Inject
	dashReplyService dReplyService;
	
	@Inject
	commonService cmmnService;
	
	// DashBoard INSERT View
	@RequestMapping(value = "/dashBoard/writeView.do", method = RequestMethod.GET)
	public void writeView() throws Exception {
		logger.info("==> dashBoard/writeView");
	}
	
	// DashBoard INSERT
	@RequestMapping(value = "/dashBoard/write.do", method = RequestMethod.POST)
	public String write(dashBoardVO param, String[] files, String[] fileNm, MultipartHttpServletRequest mphr) throws Exception {
		logger.info("==> dashBoard/write");
		
		dBoardService.boardWrite(param, files, fileNm, mphr);
		
		return "redirect:/dashBoard/listView.do";
	}
	
	// DashBoard List View
	@RequestMapping(value = "/dashBoard/listView.do", method = RequestMethod.GET)
	public String listView(@ModelAttribute("scri") SearchCriteria param, Model model) throws Exception {
		logger.info("==> dashBoard/listView");
		
		model.addAttribute("list", dBoardService.boardList(param));
		
		PageMaker pageMaker = new PageMaker();
		pageMaker.setCri(param);
		pageMaker.setTotalCount(dBoardService.listCount(param));
		
		model.addAttribute("pageMaker", pageMaker);
		
		return "/dashBoard/listView";
	}
	
	// DashBoard SELECT
	@RequestMapping(value = "/dashBoard/readView.do", method = RequestMethod.GET)
	public String readView(dashBoardVO param, @ModelAttribute("scri") SearchCriteria scri, Model model) throws Exception {
		logger.info("==> dashBoard/readView");
		
		model.addAttribute("read", dBoardService.boardRead(param.getBoardNo()));
		model.addAttribute("scri", scri);
		
		List<dashReplyVO> dashReplyList = dReplyService.selectReply(param.getBoardNo());
		model.addAttribute("reply", dashReplyList);
		
		List<Map<String, Object>> fileList = dBoardService.selectFileList(param.getBoardNo());
		model.addAttribute("fileList", fileList);
		
		return "/dashBoard/readView";
	}
	
	// DashBoard UPDATE View
	@RequestMapping(value = "/dashBoard/updateView.do", method = RequestMethod.GET)
	public String updateView(dashBoardVO param, @ModelAttribute("scri") SearchCriteria scri, Model model) throws Exception {
		logger.info("==> dashBoard/updateView");
		
		model.addAttribute("update", dBoardService.boardRead(param.getBoardNo()));
		model.addAttribute("scri", scri);
		
		List<Map<String, Object>> fileList = dBoardService.selectFileList(param.getBoardNo());
		model.addAttribute("fileList", fileList);
		
		return "/dashBoard/updateView";
	}
	
	// DashBoard UPDATE
	@RequestMapping(value = "/dashBoard/update.do", method = RequestMethod.POST)
	public String update(dashBoardVO param, @ModelAttribute("scri") SearchCriteria scri, RedirectAttributes rttr,
			@RequestParam(value = "fileNoDel[]") String[] files, @RequestParam(value = "fileNmDel[]") String[] fileNm,
			MultipartHttpServletRequest mphr) throws Exception {
		logger.info("==> dashBoard/update");
		
		dBoardService.boardUpdate(param, files, fileNm, mphr);
		
		rttr.addAttribute("page", scri.getPage());
		rttr.addAttribute("perPageNum", scri.getPerPageNum());
		rttr.addAttribute("searchType", scri.getSearchType());
		rttr.addAttribute("keyword", scri.getKeyword());
		
		return "redirect:/dashBoard/listView.do";
	}
	
	// DashBoard DELETE
	@RequestMapping(value = "/dashBoard/delete.do", method = RequestMethod.POST)
	public String delete(dashBoardVO param) throws Exception {
		logger.info("==> dashBoard/delete");
		
		dBoardService.boardDelete(param.getBoardNo());
		
		return "redirect:/dashBoard/listView.do";
	}
	
	// DashReply
	@RequestMapping(value = "/dashBoard/insertReply.do", method = RequestMethod.POST)
	public String insertReplyAjax(dashReplyVO param, SearchCriteria scri, RedirectAttributes rttr) throws Exception {
		logger.info("==> dashBoard/insertReply");
		
		dReplyService.insertReply(param);
		
		rttr.addAttribute("boardNo", param.getBoardNo());
		rttr.addAttribute("page", scri.getPage());
		rttr.addAttribute("perPageNum", scri.getPerPageNum());
		rttr.addAttribute("searchType", scri.getSearchType());
		rttr.addAttribute("keyword", scri.getKeyword());
		
		return "redirect:/dashBoard/readView.do";
	}
	
	// DashReply UPDATE View
	@RequestMapping(value = "/dashBoard/replyUpdateView.do", method = RequestMethod.GET)
	public String replyUpdateView(dashReplyVO param, SearchCriteria scri, Model model) throws Exception {
		logger.info("==> dashBoard/replyUpdateView");
		
		model.addAttribute("replyUpdate", dReplyService.selectReply(param.getReplyNo()));
		model.addAttribute("scri", scri);
		
		return "/dashBoard/replyUpdateView";
	}
	
	// DashReply UPDATE
	@RequestMapping(value = "/dashBoard/replyUpdate.do", method = RequestMethod.POST)
	public String replyUpdate(dashReplyVO param, SearchCriteria scri, RedirectAttributes rttr) throws Exception {
		logger.info("==> dashBoard/replyUpdate");
		
		dReplyService.updateReply(param);
		
		rttr.addAttribute("boardNo", param.getBoardNo());
		rttr.addAttribute("page", scri.getPage());
		rttr.addAttribute("perPageNum", scri.getPerPageNum());
		rttr.addAttribute("searchType", scri.getSearchType());
		rttr.addAttribute("keyword", scri.getKeyword());
		
		return "redirect:/dashBoard/readView.do";
	}
	
	// DashReply DELETE View
	@RequestMapping(value = "/dashBoard/replyDeleteView.do", method = RequestMethod.GET)
	public String replyDeleteView(dashReplyVO param, SearchCriteria scri, Model model) throws Exception {
		logger.info("==> dashBoard/replyDeleteView");
		
		model.addAttribute("replyUpdate", dReplyService.selectReply(param.getReplyNo()));
		model.addAttribute("scri", scri);
		
		return "/dashBoard/replyDeleteView";
	}
	
	// DashReply DELETE
	@RequestMapping(value = "/dashBoard/replyDelete.do", method = RequestMethod.POST)
	public String replyDelete(dashReplyVO param, SearchCriteria scri, RedirectAttributes rttr) throws Exception {
		logger.info("==> dashBoard/replyDelete");
		
		dReplyService.deleteReply(param);
		
		rttr.addAttribute("boardNo", param.getBoardNo());
		rttr.addAttribute("page", scri.getPage());
		rttr.addAttribute("perPageNum", scri.getPerPageNum());
		rttr.addAttribute("searchType", scri.getSearchType());
		rttr.addAttribute("keyword", scri.getKeyword());
		
		return "redirect:/dashBoard/readView.do";
	}
	
	@RequestMapping(value = "/fileDown.do")
	public void fileDown(@RequestParam Map<String, Object> param, HttpServletResponse hsrs) throws Exception {
		logger.info("==> cmmn/fileDown");
		
		Map<String, Object> resultMap = dBoardService.selectFileInfo(param);
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
