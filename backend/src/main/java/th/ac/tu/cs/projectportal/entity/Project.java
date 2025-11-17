package th.ac.tu.cs.projectportal.entity;

import lombok.Data;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "project")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ProjectID")
    private Long projectID;

    @Column(name = "Title_th")
    private String titleTh;

    @Column(name = "Title_en")
    private String titleEn;

    @Column(columnDefinition = "TEXT")
    private String abstractTh;

    @Column(columnDefinition = "TEXT")
    private String abstractEn;

    @Column(name = "Keyword_th")
    private String keywordTh;

    @Column(name = "Keyword_en")
    private String keywordEn;

    @Column(name = "Member")
    private String member;

    @Column(name = "Advisor")
    private String advisor;

    @Column(name = "Co_advisor")
    private String coAdvisor;

    @Column(name = "File")
    private String file;

    @Column(name = "create_date")
    private LocalDateTime createDate;

    @Column(name = "Category")
    private String category;

    @Column(name = "year")
    private Integer year;

    @Column(name = "slide_file")
    private String slideFile;

    @Column(name = "zip_file")
    private String zipFile;

    @Column(name = "github")
    private String github;
}
