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
import java.nio.file.Path;

@RestController
@RequestMapping("/api/admin/projects") 
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ProjectController {

    private final ProjectService projectService;

    // เพิ่มโครงงานใหม่
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

            System.out.println("zipFile = " + (zipFile != null ? zipFile.getOriginalFilename() : "null"));
            System.out.println("slideFile = " + (slideFile != null ? slideFile.getOriginalFilename() : "null"));
            System.out.println("file = " + (file != null ? file.getOriginalFilename() : "null"));
            
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
            Path uploadPath = Paths.get(uploadDir).toAbsolutePath();
            System.out.println("Absolute path: " + uploadPath);
            Files.createDirectories(uploadPath);

            // Debug: ดู path ที่เซฟจริง
            System.out.println("Saving to: " + Paths.get(uploadDir).toAbsolutePath());

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

    // ดึงโครงงานทั้งหมด
    @GetMapping
    public ResponseEntity<List<Project>> getAllProjects() {
        try {
            List<Project> projects = projectService.getAllProjects();
            return ResponseEntity.ok(projects);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ลบโครงงานพร้อมไฟล์
    @DeleteMapping("/{id}")
public ResponseEntity<?> deleteProject(@PathVariable Long id) {
    try {
        Project project = projectService.getProjectById(id);
        if (project == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("ไม่พบโครงงาน ID: " + id);
        }

        // ลบไฟล์ในโฟลเดอร์ upload/
        String uploadDir = "upload";
        if (project.getFile() != null) {
            Files.deleteIfExists(Paths.get(uploadDir, project.getFile()));
        }
        if (project.getUploadFile() != null) {
            Files.deleteIfExists(Paths.get(uploadDir, project.getUploadFile()));
        }
        if (project.getUploadCode() != null) {
            Files.deleteIfExists(Paths.get(uploadDir, project.getUploadCode()));
        }

        // ลบจาก database
        projectService.deleteProjectById(id);

        return ResponseEntity.ok("ลบโครงงานและไฟล์เรียบร้อย ID: " + id);
    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("เกิดข้อผิดพลาดในการลบโครงงาน: " + e.getMessage());
    }
}

// แก้ไขโครงงาน
@PutMapping(value = "/edit/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
public ResponseEntity<?> editProject(
        @PathVariable("id") Long id,
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
        // ดึงโครงงานเก่าจาก DB
        Project project = projectService.getProjectById(id);
        if (project == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("ไม่พบโครงงานที่ต้องการแก้ไข");
        }

        // อัปเดตข้อมูลตัวโครงงาน
        project.setTitleTh(projectNameTH);
        project.setTitleEn(projectNameEN);
        project.setAbstractTh(abstractTh);
        project.setAbstractEn(abstractEn != null ? abstractEn : project.getAbstractEn());
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
        Path uploadPath = Paths.get(uploadDir).toAbsolutePath();
        Files.createDirectories(uploadPath);

        // อัปโหลดไฟล์ถ้ามีการส่งใหม่
        if (file != null) {
            String filePath = uploadDir + "/" + file.getOriginalFilename();
            file.transferTo(Paths.get(filePath));
            project.setFile(file.getOriginalFilename());
        }
        if (slideFile != null) {
            String slidePath = uploadDir + "/" + slideFile.getOriginalFilename();
            slideFile.transferTo(Paths.get(slidePath));
            project.setUploadFile(slideFile.getOriginalFilename());
        }
        if (zipFile != null) {
            String zipPath = uploadDir + "/" + zipFile.getOriginalFilename();
            zipFile.transferTo(Paths.get(zipPath));
            project.setUploadCode(zipFile.getOriginalFilename());
        }

        project.setCategory(year);
        Project updatedProject = projectService.saveProject(project);

        return ResponseEntity.ok(updatedProject);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("ไม่สามารถแก้ไขโครงงานได้: " + e.getMessage());
    }
}

// ดึงโครงงานโดยใช้ ID
@GetMapping("/{id}")
public ResponseEntity<?> getProjectById(@PathVariable Long id) {
    Project project = projectService.getProjectById(id);
    if (project == null) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("ไม่พบโครงงาน");
    }
    return ResponseEntity.ok(project);
}




}
