package th.ac.tu.cs.projectportal.dto;

import lombok.Data;
import java.util.List;

@Data
public class ProjectDTO {

    private String title;         
    private String projectNameTH;
    private String projectNameEN;

    private List<String> members;
    private String advisor;
    private List<String> coAdvisors; 

    private String year;

    private String abstractTh;
    private String abstractEn;

    private String keywordsTH;
    private String keywordsEN;

    private String github;     

    // ชื่อไฟล์ 
    private String file;        // PDF
    private String slideFile;   // SildeFile 
    private String zipFile;     // ZipFile
}
