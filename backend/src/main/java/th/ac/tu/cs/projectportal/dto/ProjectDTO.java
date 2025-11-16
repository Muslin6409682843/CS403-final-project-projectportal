package th.ac.tu.cs.projectportal.dto;

import lombok.Data;
import java.util.List;

@Data
public class ProjectDTO {

    private String title;           // ไม่ได้ใช้ใน DB แต่ frontend ส่งมา
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

    private String github;      // แก้ githubLink → github (ตรงกับ DB)

    // ชื่อไฟล์ (หลัง upload)
    private String file;        // PDF
    private String slideFile;   // slide = SildeFile ใน DB
    private String zipFile;     // ZipFile
}
