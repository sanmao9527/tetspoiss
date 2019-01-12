package com.qf.tetspoiss.utils;

import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

/**
 * @program: tetspoiss
 * @description:
 * @author: Mr.Wang
 * @create: 2019-01-12 10:26
 **/
public class EcxlelImport {
    public static String importToDB(HttpServletRequest request) throws Exception {
        final  String excel2003 =".xls";
        final  String excel2007 =".xlsx";

        MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;

        InputStream inputStream =null;
        List<List<Object>> list = null;
        MultipartFile file = multipartRequest.getFile("filename");
        if(file.isEmpty()){
            return "文件不能为空";
        }
        inputStream = file.getInputStream();
        String fileName=file.getOriginalFilename();
        //
        //List<List<Object>> lists= null;
        //创建Excel工作薄
        Workbook wb = null;
        String fileType = fileName.substring(fileName.lastIndexOf("."));
        if(excel2003.equals(fileType)){
            wb = new HSSFWorkbook(inputStream);
        }else if(excel2007.equals(fileType)){
            wb = new XSSFWorkbook(inputStream);
        }else{
            throw new Exception("解析的文件格式有误！");
        }
        if(null == wb){
            throw new Exception("创建Excel工作薄为空！");
        }
        Sheet sheet = null;
        Row row = null;
        Cell cell = null;

        list = new ArrayList<List<Object>>();
        for (int i = 0; i < wb.getNumberOfSheets(); i++) {
            sheet = wb.getSheetAt(i);
            if(sheet==null){continue;}

            for (int j = sheet.getFirstRowNum(); j <= sheet.getLastRowNum(); j++) {
                row = sheet.getRow(j);
                //||row.getFirstCellNum()==j
                if(row==null){continue;}

                List<Object> li = new ArrayList<Object>();
                for (int y = row.getFirstCellNum(); y < row.getLastCellNum(); y++) {
                    cell = row.getCell(y);
                    li.add(cell);
                }
                list.add(li);
            }
        }
        wb.close();
        //return list;
        inputStream.close();
//连接数据库部分
        for (int i = 0; i < list.size(); i++) {
            List<Object> lo = list.get(i);
            for (Object o : lo) {
                System.out.println(String.valueOf(o));
            }
            //userMapper.insert(String.valueOf(lo.get(0)),String.valueOf(lo.get(1)),String.valueOf(lo.get(2)));
            //调用mapper中的insert方法
        }
        return "导入成功";
    }
}
