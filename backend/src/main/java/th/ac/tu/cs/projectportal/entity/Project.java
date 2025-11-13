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
    private Long projectID;

    @Column(name = "Title_th", nullable = false, length = 100)
    private String titleTh;

    @Column(name = "Title_en", nullable = false, length = 100)
    private String titleEn;

    @Column(name = "Abstract_th", nullable = false, length = 255)
    private String abstractTh;

    @Column(name = "Abstract_en", nullable = false, length = 255)
    private String abstractEn;

    @Column(name = "Keyword_th", nullable = false, length = 100)
    private String keywordTh;

    @Column(name = "Keyword_en", nullable = false, length = 100)
    private String keywordEn;

    @Column(name = "Advisor", length = 100)
    private String advisor;

    @Column(name = "Co-advisor", length = 100)
    private String coAdvisor;

    @Column(name = "File", length = 100)
    private String file;

    @Column(name = "CreateDate")
    private LocalDateTime createDate;

    @Column(name = "Category", length = 100)
    private String category;

    @Column(name = "UploadedDate")
    private LocalDateTime uploadedDate;

    @Column(name = "UploadedBy")
    private Long uploadedBy;

    @Column(name = "Upload_file", length = 100)
    private String uploadFile;

    @Column(name = "Upload_code", length = 100)
    private String uploadCode;
}
