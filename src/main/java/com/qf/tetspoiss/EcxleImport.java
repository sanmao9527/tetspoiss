package com.qf.tetspoiss;

import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

/**
 * @program: tetspoiss
 * @description:
 * @author: Mr.Wang
 * @create: 2019-01-11 14:27
 **/
@Controller
public class EcxleImport {
    @RequestMapping("/test")
    @ResponseBody
    public String testpoi(MultipartFile myfile) throws IOException {

        HSSFWorkbook workbook=null;

        //List<BcRegion> list=new ArrayList<>();
        try {
            System.out.println(2);
            workbook=new HSSFWorkbook(myfile.getInputStream());
            HSSFSheet sheet=workbook.getSheetAt(0);
            for (Row row : sheet) {
                if(row.getRowNum()==0) {
                    continue;
                }
                //BcRegion rg=new BcRegion();
//                String citycode="";
//                String shortcode="";
                for (Cell cell : row) {
                    System.out.println(1);
                    int index=cell.getColumnIndex();
                    System.out.println(cell.getStringCellValue());
                   /* if(index==0) {
                        rg.setId(cell.getStringCellValue());
                    }else if(index==1) {
                        rg.setProvince(cell.getStringCellValue().substring(0, cell.getStringCellValue().length()-1));
                    }else if(index==2) {
                        shortcode+=cell.getStringCellValue().substring(0, cell.getStringCellValue().length()-1);
                        citycode+=cell.getStringCellValue().substring(0, cell.getStringCellValue().length()-1);
                        rg.setCity(cell.getStringCellValue().substring(0, cell.getStringCellValue().length()-1));
                    }else if(index==3) {
                        citycode+=cell.getStringCellValue().substring(0, cell.getStringCellValue().length()-1);
                        rg.setDistrict(cell.getStringCellValue());
                    }else if(index==4) {
                        rg.setPostcode(cell.getStringCellValue());
                    }

                    rg.setCitycode(PinYin4jUtils.getHeadByString1(citycode, false));
                    rg.setShortcode(PinYin4jUtils.hanziToPinyin(shortcode, ""));*/
                }
               // list.add(rg);
            }
            //System.out.println(list.size());
            //regionService.addRegion(list);

        } catch (IOException e) {
            throw e;
        }finally {
            workbook.close();
        }

       // return new AppResult(200, "娣诲姞鎴愬姛", null);
        return null;
    }
}
