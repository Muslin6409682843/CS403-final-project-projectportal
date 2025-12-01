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

    // ----------------------------
    // เพิ่มโครงงานใหม่
    // ----------------------------
    @PostMapping(value = "/add", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> addProject(
            @RequestParam("title") String title,
            @RequestParam("projectNameTH") String projectNameTH,
            @RequestParam("projectNameEN") String projectNameEN,
            @RequestParam("members") String membersJson,
            @RequestParam("advisor") String advisor,
            @RequestParam("coAdvisors") String coAdvisorsJson,
            @RequestParam(value = "year", required = false) String year,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam("abstractTh") String abstractTh,
            @RequestParam(value = "abstractEn", required = false) String abstractEn,
            @RequestParam(value = "keywordsTH", required = false) String keywordsTH,
            @RequestParam(value = "keywordsEN", required = false) String keywordsEN,
            @RequestParam(value = "github", required = false) String github,
            @RequestPart(value = "file", required = false) MultipartFile file,
            @RequestPart(value = "slideFile", required = false) MultipartFile slideFile,
            @RequestPart(value = "zipFile", required = false) MultipartFile zipFile) {
        try {
            Project project = new Project();

            project.setTitleTh(projectNameTH);
            project.setTitleEn(projectNameEN);
            project.setAbstractTh(abstractTh);
            project.setAbstractEn(abstractEn != null ? abstractEn : "");
            project.setKeywordTh(keywordsTH);
            project.setKeywordEn(keywordsEN);
            project.setAdvisor(advisor);
            project.setGithub(github);
            project.setCategory(category);

            // Parse members JSON List
            if (membersJson != null && !membersJson.isEmpty()) {
                List<String> memberList = new ObjectMapper().readValue(membersJson, List.class);
                project.setMember(String.join(", ", memberList));
            }

            // Parse co-advisors JSON
            if (coAdvisorsJson != null && !coAdvisorsJson.isEmpty()) {
                List<String> coList = new ObjectMapper().readValue(coAdvisorsJson, List.class);
                project.setCoAdvisor(String.join(", ", coList));
            }

            // Directory upload/
            String uploadDir = "upload";
            Path uploadPath = Paths.get(uploadDir).toAbsolutePath();
            Files.createDirectories(uploadPath);

            // Save PDF File → file
            if (file != null) {
                String filePath = uploadDir + "/" + file.getOriginalFilename();
                file.transferTo(Paths.get(filePath));
                project.setFile(file.getOriginalFilename());
            }

            // Save Slide → slide_file
            if (slideFile != null) {
                String slidePath = uploadDir + "/" + slideFile.getOriginalFilename();
                slideFile.transferTo(Paths.get(slidePath));
                project.setSlideFile(slideFile.getOriginalFilename());
            }

            // Save Zip → zip_file
            if (zipFile != null) {
                String zipPath = uploadDir + "/" + zipFile.getOriginalFilename();
                zipFile.transferTo(Paths.get(zipPath));
                project.setZipFile(zipFile.getOriginalFilename());
            }

            project.setCreateDate(LocalDateTime.now());

            // แปลง year String → Integer
            if (year != null && !year.isEmpty()) {
                project.setYear(Integer.parseInt(year));
            }

            Project saved = projectService.saveProject(project);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("ERROR: " + e.getMessage());
        }

        
    }

    // ----------------------------
    // ดึงโครงงานทั้งหมด
    // ----------------------------
    @GetMapping
    public ResponseEntity<List<Project>> getAllProjects() {
        return ResponseEntity.ok(projectService.getAllProjects());
    }

    // ----------------------------
    // ลบโครงงาน
    // ----------------------------
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable Long id) {
        try {
            Project project = projectService.getProjectById(id);
            if (project == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("ไม่พบโครงงาน ID: " + id);
            }

            String uploadDir = "upload";

            if (project.getFile() != null)
                Files.deleteIfExists(Paths.get(uploadDir, project.getFile()));

            if (project.getSlideFile() != null)
                Files.deleteIfExists(Paths.get(uploadDir, project.getSlideFile()));

            if (project.getZipFile() != null)
                Files.deleteIfExists(Paths.get(uploadDir, project.getZipFile()));

            projectService.deleteProjectById(id);

            return ResponseEntity.ok("ลบโครงงานเรียบร้อย ID: " + id);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("ลบโครงงานล้มเหลว: " + e.getMessage());
        }
    }

    @DeleteMapping("/file/{id}/{type}")
    public ResponseEntity<?> deleteProjectFile(@PathVariable Long id, @PathVariable String type) {
        Project project = projectService.getProjectById(id);
        if (project == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("ไม่พบโครงงาน");

        // ลบไฟล์ใน upload และ ลบค่าในฐานข้อมูล
        String uploadDir = "upload";
        try {
            String fileName = switch(type) {
                case "file" -> project.getFile();
                case "slide" -> project.getSlideFile();
                case "zip" -> project.getZipFile();
                default -> null;
            };
            if(fileName != null) Files.deleteIfExists(Paths.get(uploadDir, fileName));

            // ลบค่าในฐานข้อมูล
            switch(type) {
                case "file" -> project.setFile(null);
                case "slide" -> project.setSlideFile(null);
                case "zip" -> project.setZipFile(null);
            }
            projectService.saveProject(project);
            return ResponseEntity.ok("ลบไฟล์เรียบร้อย");
        } catch(Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("ลบไฟล์ล้มเหลว: " + e.getMessage());
        }
    }


    // ----------------------------
    // ดึงข้อมูลตาม ID
    // ----------------------------
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        Project project = projectService.getProjectById(id);
        if (project == null)
            return ResponseEntity.status(404).body("ไม่พบโครงงาน");
        return ResponseEntity.ok(project);
    }

    // ----------------------------
    // แก้ไขโครงงาน
    // ----------------------------
    @PutMapping(value = "/edit/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> editProject(
            @PathVariable("id") Long id,
            @RequestParam("title") String title,
            @RequestParam("projectNameTH") String projectNameTH,
            @RequestParam("projectNameEN") String projectNameEN,
            @RequestParam("members") String membersJson,
            @RequestParam("advisor") String advisor,
            @RequestParam("coAdvisors") String coAdvisorsJson,
            @RequestParam(value = "year", required = false) String year,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam("abstractTh") String abstractTh,
            @RequestParam(value = "abstractEn", required = false) String abstractEn,
            @RequestParam(value = "keywordsTH", required = false) String keywordsTH,
            @RequestParam(value = "keywordsEN", required = false) String keywordsEN,
            @RequestParam(value = "github", required = false) String github,
            @RequestPart(value = "file", required = false) MultipartFile file,
            @RequestPart(value = "slideFile", required = false) MultipartFile slideFile,
            @RequestPart(value = "zipFile", required = false) MultipartFile zipFile) {
        try {
            Project project = projectService.getProjectById(id);
            if (project == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("ไม่พบโครงงานที่ต้องการแก้ไข");
            }

            // Update basic info
            project.setTitleTh(projectNameTH);
            project.setTitleEn(projectNameEN);
            project.setAbstractTh(abstractTh);
            project.setAbstractEn(abstractEn != null ? abstractEn : project.getAbstractEn());
            project.setKeywordTh(keywordsTH);
            project.setKeywordEn(keywordsEN);
            project.setAdvisor(advisor);
            project.setGithub(github);
            project.setCategory(category != null ? category : project.getCategory());

            // แปลง year String → Integer
            if (year != null && !year.isEmpty()) {
                project.setYear(Integer.parseInt(year));
            }

            // Update members
            if (membersJson != null && !membersJson.isEmpty()) {
                List<String> memberList = new ObjectMapper().readValue(membersJson, List.class);
                project.setMember(String.join(", ", memberList));
            }

            // Update co-advisors
            if (coAdvisorsJson != null && !coAdvisorsJson.isEmpty()) {
                List<String> coList = new ObjectMapper().readValue(coAdvisorsJson, List.class);
                project.setCoAdvisor(String.join(", ", coList));
            }

            // File saving section
            String uploadDir = "upload";
            Path uploadPath = Paths.get(uploadDir).toAbsolutePath();
            Files.createDirectories(uploadPath);

            if (file != null) {
                if (project.getFile() != null)
                    Files.deleteIfExists(Paths.get(uploadDir, project.getFile()));

                String filePath = uploadDir + "/" + file.getOriginalFilename();
                file.transferTo(Paths.get(filePath));
                project.setFile(file.getOriginalFilename());
            }

            if (slideFile != null) {
                if (project.getSlideFile() != null)
                    Files.deleteIfExists(Paths.get(uploadDir, project.getSlideFile()));

                String slidePath = uploadDir + "/" + slideFile.getOriginalFilename();
                slideFile.transferTo(Paths.get(slidePath));
                project.setSlideFile(slideFile.getOriginalFilename());
            }

            if (zipFile != null) {
                if (project.getZipFile() != null)
                    Files.deleteIfExists(Paths.get(uploadDir, project.getZipFile()));

                String zipPath = uploadDir + "/" + zipFile.getOriginalFilename();
                zipFile.transferTo(Paths.get(zipPath));
                project.setZipFile(zipFile.getOriginalFilename());
            }

            Project updated = projectService.saveProject(project);
            return ResponseEntity.ok(updated);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("ไม่สามารถแก้ไขโครงงานได้: " + e.getMessage());
        }
    }

}
