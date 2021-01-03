package com.test.bbs.member.web;

import java.io.IOException;

import javax.inject.Inject;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.github.scribejava.core.model.OAuth2AccessToken;
import com.test.bbs.member.service.memberService;
import com.test.bbs.member.service.impl.memberVO;


@Controller
public class memberController {
	
	private static final Logger logger = LoggerFactory.getLogger(memberController.class);
	
	private NaverLoginBO naverLoginBO;
	private String apiResult = null;
	
	@Autowired
	private void setNaverLoginBO(NaverLoginBO naverLoginBO) {
		this.naverLoginBO = naverLoginBO;
	}

	@Inject
	BCryptPasswordEncoder pwdEncoder;
	
	@Inject
	memberService mService;
	
	

	// 로그인 첫 화면 요청 메소드
	@RequestMapping(value = "/naverSignIn.do", method = { RequestMethod.GET, RequestMethod.POST })
	public String login(Model model, HttpSession session) throws Exception {
		logger.info("==> Naver Sign-In");
		// 네이버아이디로 인증 URL을 생성하기 위하여 naverLoginBO클래스의 getAuthorizationUrl 호출
		String naverAuthUrl = naverLoginBO.getAuthorizationUrl(session);
		
		logger.debug("naverAuthUrl ==> " + naverAuthUrl);
		
		model.addAttribute("url", naverAuthUrl);
		return "/sign/signIn";
	}

	// 네이버 로그인 성공시 callback호출 메소드
	@RequestMapping(value = "/naverCallback.do", method = { RequestMethod.GET, RequestMethod.POST })
	public String callback(Model model, @RequestParam String code, @RequestParam String state, HttpSession session) throws IOException, ParseException {
		logger.info("==> Naver callback");
		
		OAuth2AccessToken oauthToken;
		oauthToken = naverLoginBO.getAccessToken(session, code, state);
		
		// 1. 로그인 사용자 정보를 읽어온다.
		apiResult = naverLoginBO.getUserProfile(oauthToken); // String형식의 json데이터
		
		// 2. String형식인 apiResult를 json형태로 바꿈
		JSONParser parser = new JSONParser();
		Object obj = parser.parse(apiResult);
		JSONObject jsonObj = (JSONObject) obj;
		
		// 3. 데이터 파싱
		// Top레벨 단계 _response 파싱
		JSONObject response_obj = (JSONObject) jsonObj.get("response");
		// response의 nickname값 파싱
		String nickname = (String) response_obj.get("nickname");
		logger.debug("nickname ==> " + nickname);
		
		// 4.파싱 닉네임 세션으로 저장
		session.setAttribute("sessionId", nickname); // 세션 생성
		model.addAttribute("result", apiResult);
		
		return "/sign/signIn";
	}
	
	
	
	
	
	
	
	@RequestMapping(value = "/sign/signUp.do", method=RequestMethod.GET)
	public String signUp() throws Exception {
		logger.info("==> getRegister signUp");
		
		return "/sign/signUp";
	}

	@RequestMapping(value="/sign/signUpAjax.do", method=RequestMethod.POST)
	public String signUpAjax(memberVO param) throws Exception {
		logger.info("==> postRegister");
		int result = mService.chkedUserInfo(param);
		try {
			if (result != 1) {
				String inputPW = param.getPassword();
				String pwd = pwdEncoder.encode(inputPW);
				param.setPassword(pwd);
				
				mService.signUp(param);
			} else {
				return "/sign/signUp.do";
			}
		} catch (Exception e) {
			throw new RuntimeException();
		}
		
		return "redirect:/";
	}
	
	
	
	
	// member signIn
	@RequestMapping(value = "/sign/signIn.do", method=RequestMethod.GET)
	public String signIn() throws Exception {
		logger.info("==> get signIn");
		
		return "/sign/signIn";
	}
	
	@RequestMapping(value="/sign/signInAjax.do", method=RequestMethod.POST)
	public String signIn(memberVO param, HttpSession httpSession, RedirectAttributes rttr) throws Exception {
		logger.info("==> post signIn");
		
		httpSession.getAttribute("member");
		memberVO signIn = mService.signIn(param);
		
		boolean pwdMatch = pwdEncoder.matches(param.getPassword(), signIn.getPassword());
		
		if(signIn != null && pwdMatch == true) {
			httpSession.setAttribute("member", signIn);
		} else {
			httpSession.setAttribute("member", null);
			rttr.addFlashAttribute("msg", false);
		}
		
		return "redirect:/";
	}
	
	@RequestMapping(value="/sign/signOut.do", method=RequestMethod.GET)
	public String signOut(HttpSession session) throws Exception {
		session.invalidate();
		
		return "redirect:/";
	}
	
	// member signEdit
	@RequestMapping(value="/sign/signEdit.do", method=RequestMethod.GET)
	public String signEdit(memberVO param, HttpSession session) throws Exception {
		
		return "/sign/signEdit.do";
	}
	
	@RequestMapping(value="/sign/signEditAjax.do", method=RequestMethod.POST)
	public String signEditAjax(memberVO param, HttpSession session) throws Exception {
		
		mService.signEdit(param);
		session.invalidate();
		
		return "redirect:/";
	}
	
	// user_sttus Dead GET / POST
	@RequestMapping(value="/sign/signDrawal.do", method=RequestMethod.GET)
	public String signDrawalView() throws Exception {
		
		return "/sign/signDrawal.do";
	}
	
	@RequestMapping(value="/sign/signDrawalAjax.do", method=RequestMethod.POST)
	public String signDrawal(memberVO param, HttpSession session, RedirectAttributes rttr) throws Exception {
		
		mService.signDrawal(param);
		session.invalidate();
		
		return "redirect:/";
	}
	
	@ResponseBody
	@RequestMapping(value="/sign/chkedPwdAjax.do", method=RequestMethod.POST)
	public boolean chkedPwd(memberVO param) throws Exception {
		memberVO membervo = mService.signIn(param);
		boolean pwdChk = pwdEncoder.matches(param.getPassword(), membervo.getPassword());
		
		return pwdChk;
	}
	
	@ResponseBody
	@RequestMapping(value="/sign/chkedUserInfo.do", method = RequestMethod.POST)
	public int chkedUserInfo(memberVO param) throws Exception {
		int result = mService.chkedUserInfo(param);
		
		return result;
	}
	
}
