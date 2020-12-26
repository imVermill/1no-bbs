package com.test.bbs.cmmn.web;

import javax.inject.Inject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;

import com.test.bbs.cmmn.service.commonService;

@Controller
public class commonController {

	@Inject
	commonService cmmnService;
	
	private static final Logger logger = LoggerFactory.getLogger(commonController.class);
	
}
