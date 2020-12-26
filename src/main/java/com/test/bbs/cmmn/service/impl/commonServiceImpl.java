package com.test.bbs.cmmn.service.impl;

import javax.inject.Inject;

import org.springframework.stereotype.Service;

import com.test.bbs.cmmn.service.commonDAO;
import com.test.bbs.cmmn.service.commonService;
@Service
public class commonServiceImpl implements commonService {
	
	@Inject
	private commonDAO cmmnDAO;
	
}
