package th.ac.tu.cs.projectportal.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import th.ac.tu.cs.projectportal.entity.Project;
import th.ac.tu.cs.projectportal.service.ProjectService;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/admin/projects") 
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ProjectController {

    private final ProjectService projectService;

    @PostMapping(value = "/add", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> addProject(
            @RequestParam("title") String title,
            @RequestParam("projectNameTH") String projectNameTH,
            @RequestParam("projectNameEN") String projectNameEN,
            @RequestParam("members") String membersJson,
            @RequestParam("advisor") String advisor,
            @RequestParam("coAdvisors") String coAdvisorsJson,
            @RequestParam("year") String year,
            @RequestParam("abstractTh") String abstractTh,
            @RequestParam(value = "abstractEn", required = false) String abstractEn,
            @RequestParam(value = "keywordsTH", required = false) String keywordsTH,
            @RequestParam(value = "keywordsEN", required = false) String keywordsEN,
            @RequestPart(value = "file", required = false) MultipartFile file,
            @RequestPart(value = "slideFile", required = false) MultipartFile slideFile,
            @RequestPart(value = "zipFile", required = false) MultipartFile zipFile
    ) {
        try {
            Project project = new Project();
            project.setTitleTh(projectNameTH);
            project.setTitleEn(projectNameEN);
            project.setAbstractTh(abstractTh);
            project.setAbstractEn(abstractEn != null ? abstractEn : "");
            project.setKeywordTh(keywordsTH);
            project.setKeywordEn(keywordsEN);
            project.setAdvisor(advisor);

            // Co-Advisors
            if (coAdvisorsJson != null && !coAdvisorsJson.isEmpty()) {
                List<String> coList = new ObjectMapper().readValue(coAdvisorsJson, List.class);
                project.setCoAdvisor(String.join(", ", coList));
            }

            // สร้างโฟลเดอร์ upload ถ้าไม่มี
            String uploadDir = "upload";
            Files.createDirectories(Paths.get(uploadDir));

            // บันทึกไฟล์ PDF
            if (file != null) {
                String filePath = uploadDir + "/" + file.getOriginalFilename();
                file.transferTo(Paths.get(filePath));
                project.setFile(file.getOriginalFilename());
            }

            // บันทึก Slide
            if (slideFile != null) {
                String slidePath = uploadDir + "/" + slideFile.getOriginalFilename();
                slideFile.transferTo(Paths.get(slidePath));
                project.setUploadFile(slideFile.getOriginalFilename());
            }

            // บันทึก Zip / Github
            if (zipFile != null) {
                String zipPath = uploadDir + "/" + zipFile.getOriginalFilename();
                zipFile.transferTo(Paths.get(zipPath));
                project.setUploadCode(zipFile.getOriginalFilename()); //รอแก้ไข
            }

            project.setCreateDate(LocalDateTime.now());
            project.setCategory(year);

            Project savedProject = projectService.saveProject(project);

            return ResponseEntity.status(HttpStatus.CREATED).body(savedProject);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("ไม่สามารถบันทึกโครงงานได้: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Project>> getAllProjects() {
        try {
            List<Project> projects = projectService.getAllProjects();
            return ResponseEntity.ok(projects);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
}

}
