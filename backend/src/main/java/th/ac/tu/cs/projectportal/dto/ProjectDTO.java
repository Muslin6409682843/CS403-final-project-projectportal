package th.ac.tu.cs.projectportal.dto;

import lombok.Data;
import java.util.List;

@Data
public class ProjectDTO {
    public String title;           
    public String projectNameTH;
    public String projectNameEN;
    public List<String> members;
    public String advisor;
    public List<String> coAdvisors;
    public String year;
    public String abstractTh;
    public String abstractEn;
    public String keywordsTH;
    public String keywordsEN;
    public String slideFile;
    public String githubLink;
    public String zipFile;
}
