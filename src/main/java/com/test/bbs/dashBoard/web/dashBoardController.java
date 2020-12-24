package com.test.bbs.dashBoard.web;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.test.bbs.dashBoard.PageMaker;
import com.test.bbs.dashBoard.SearchCriteria;
import com.test.bbs.dashBoard.service.dashReplyService;
import com.test.bbs.dashBoard.service.dashBoardService;
import com.test.bbs.dashBoard.service.impl.dashBoardVO;
import com.test.bbs.dashBoard.service.impl.dashReplyVO;

import java.util.List;

import javax.inject.Inject;

@Controller
public class dashBoardController {
	
	private static final Logger logger = LoggerFactory.getLogger(dashBoardController.class);
	
	@Inject
	dashBoardService dBoardService;
	
	@Inject
	dashReplyService dReplyService;
	
	// DashBoard INSERT View
	@RequestMapping(value = "/dashBoard/writeView.do", method = RequestMethod.GET)
	public void writeView() throws Exception {
		logger.info("==> dashBoard/writeView");
	}
	
	// DashBoard INSERT
	@RequestMapping(value = "/dashBoard/write.do", method = RequestMethod.POST)
	public String write(dashBoardVO param, MultipartHttpServletRequest mphr) throws Exception {
		logger.info("==> dashBoard/write");
		
		dBoardService.boardWrite(param, mphr);
		
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
		
		return "/dashBoard/readView";
	}
	
	// DashBoard UPDATE View
	@RequestMapping(value = "/dashBoard/updateView.do", method = RequestMethod.GET)
	public String updateView(dashBoardVO param, Model model) throws Exception {
		logger.info("==> dashBoard/updateView");
		
		model.addAttribute("update", dBoardService.boardRead(param.getBoardNo()));
		
		return "/dashBoard/updateView";
	}
	
	// DashBoard UPDATE
	@RequestMapping(value = "/dashBoard/update.do", method = RequestMethod.POST)
	public String update(dashBoardVO param) throws Exception {
		logger.info("==> dashBoard/update");
		
		dBoardService.boardUpdate(param);
		
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
}
