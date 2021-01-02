package com.test.bbs.member.web;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.social.connect.Connection;
import org.springframework.social.google.api.Google;
import org.springframework.social.google.api.impl.GoogleTemplate;
import org.springframework.social.google.api.plus.Person;
import org.springframework.social.google.api.plus.PlusOperations;
import org.springframework.social.google.connect.GoogleConnectionFactory;
import org.springframework.social.oauth2.AccessGrant;
import org.springframework.social.oauth2.GrantType;
import org.springframework.social.oauth2.OAuth2Operations;
import org.springframework.social.oauth2.OAuth2Parameters;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.test.bbs.member.service.memberService;
import com.test.bbs.member.service.impl.memberVO;


@Controller
public class memberController {
	
	private static final Logger logger = LoggerFactory.getLogger(memberController.class);
	
	@Autowired
	private GoogleConnectionFactory googleConnectionFactory;
	@Autowired
	private OAuth2Parameters googleOAuth2Parameters;
	
	@Inject
	BCryptPasswordEncoder pwdEncoder;
	
	@Inject
	memberService mService;
	
	
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
	
	
	@RequestMapping(value = "/googleLogin.do", method = RequestMethod.POST)
	public String doGoogleSignInActionPage(HttpServletResponse response, Model model) throws Exception {
		
		OAuth2Operations oauthOperations = googleConnectionFactory.getOAuthOperations();
		String url = oauthOperations.buildAuthorizeUrl(GrantType.AUTHORIZATION_CODE, googleOAuth2Parameters);
	  
		logger.debug("/member/googleSignIn, url : " + url);
	  
		model.addAttribute("url", url);
	  
		return "login/googleLogin";
	}
	
	@RequestMapping(value = "/googleSignInCallback.do", method = RequestMethod.GET)
	public String doSessionAssignActionPage(HttpServletRequest request) throws Exception {
		logger.info("/member/googleSignInCallback");
		String code = request.getParameter("code");

		OAuth2Operations oauthOperations = googleConnectionFactory.getOAuthOperations();
		AccessGrant accessGrant = oauthOperations.exchangeForAccess(code , googleOAuth2Parameters.getRedirectUri(), null);

		String accessToken = accessGrant.getAccessToken();
		Long expireTime = accessGrant.getExpireTime();
	  
		if (expireTime != null && expireTime < System.currentTimeMillis()) {
			accessToken = accessGrant.getRefreshToken();
			System.out.printf("accessToken is expired. refresh token = {}", accessToken);
		}
	  
		Connection<Google> connection = googleConnectionFactory.createConnection(accessGrant);
		Google google = connection == null ? new GoogleTemplate(accessToken) : connection.getApi();

		PlusOperations plusOperations = google.plusOperations();
		Person profile = plusOperations.getGoogleProfile();
		memberVO memVO = new memberVO();
		
		logger.debug("profile.getDisplayName() == >" + profile.getDisplayName());
	  
		memVO.setUserNm(profile.getDisplayName());
		memVO.setSnsId("g" + profile.getId());
		
		HttpSession session = request.getSession();
		//memVO = service.googleLogin(memVO);

		session.setAttribute("login", memVO);

		return "redirect:/";
	}
	
	
	// member signIn
	@RequestMapping(value = "/sign/signIn.do", method=RequestMethod.GET)
	public String signIn() throws Exception {
		logger.info("==> getRegister signIn");
		
		return "/sign/signIn";
	}
	
	@RequestMapping(value="/sign/signInAjax.do", method=RequestMethod.POST)
	public String signIn(memberVO param, HttpSession httpSession, RedirectAttributes rttr) throws Exception {
		logger.info("postLogin");
		
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
	public String signOut(HttpSession httpSession) throws Exception {
		httpSession.invalidate();
		
		return "redirect:/";
	}
	
	// member signEdit
	@RequestMapping(value="/sign/signEdit.do", method=RequestMethod.GET)
	public String signEdit(memberVO param, HttpSession httpSession) throws Exception {
		
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
