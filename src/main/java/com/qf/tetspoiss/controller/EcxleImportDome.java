package com.qf.tetspoiss.controller;

import com.qf.tetspoiss.service.ImportService;
import com.qf.tetspoiss.utils.EcxlelImport;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.SecurityProperties;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import javax.servlet.http.HttpServletRequest;
import java.io.InputStream;
import java.util.List;

/**
 * @program: tetspoiss
 * @description:
 * @author: Mr.Wang
 * @create: 2019-01-11 18:44
 **/
@Controller
public class EcxleImportDome {
    @RequestMapping("/index")
    public String index(){
        return "index";
    }
    @Autowired
    private ImportService importService;
//    @Autowired
//    private SecurityProperties.User user;
//    @Autowired
//    private UserMapper userMapper;

    @RequestMapping(value="/upload",method= RequestMethod.POST)
    public  @ResponseBody
    String  uploadExcel(HttpServletRequest request) throws Exception {
        MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;

        InputStream inputStream =null;
        List<List<Object>> list = null;
        MultipartFile file = multipartRequest.getFile("filename");
        if(file.isEmpty()){
            return "文件不能为空";
        }
        inputStream = file.getInputStream();
        list = importService.getBankListByExcel(inputStream,file.getOriginalFilename());
        inputStream.close();
//连接数据库部分
        for (int i = 0; i < list.size(); i++) {
            List<Object> lo = list.get(i);
            for (int j = 0; j <lo.size() ; j++) {
                if(j==0){
                    System.out.println("打印第一列"+lo.get(j));
                }
                if(j==1){
                    System.out.println("打印第2列"+lo.get(j));
                }
                if(j==3){
                    System.out.println("打印第3列"+lo.get(j));
                }
                if(j==4){
                    System.out.println("打印第4列"+lo.get(j));
                }
            }
            //userMapper.insert(String.valueOf(lo.get(0)),String.valueOf(lo.get(1)),String.valueOf(lo.get(2)));
            //调用mapper中的insert方法
        }
        return "上传成功";
    }


    @RequestMapping(value="/upload/test",method= RequestMethod.POST)
    public  @ResponseBody
    String  uploadExcels (HttpServletRequest request) throws Exception {
       String s= EcxlelImport.importToDB(request);
        return s;
    }

}
