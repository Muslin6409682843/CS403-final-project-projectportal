package th.ac.tu.cs.projectportal.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import th.ac.tu.cs.projectportal.entity.DownloadHistory;
import th.ac.tu.cs.projectportal.entity.DownloadHistoryId;
import th.ac.tu.cs.projectportal.entity.Project;
import th.ac.tu.cs.projectportal.entity.User;
import th.ac.tu.cs.projectportal.repository.DownloadHistoryRepository;
import th.ac.tu.cs.projectportal.repository.UserRepository;
import th.ac.tu.cs.projectportal.service.DownloadHistoryService;
import th.ac.tu.cs.projectportal.repository.ProjectRepository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.List;

@RestController
@RequestMapping("/api/download-history")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}, allowCredentials = "true")
public class PublicDownloadHistory {

    @Autowired
    private DownloadHistoryRepository downloadHistoryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private DownloadHistoryService service;


    // บันทึกประวัติการดาวน์โหลดโครงการ
    @PostMapping("/{projectId}")
    public ResponseEntity<?> addDownloadHistory(@PathVariable Long projectId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || "anonymousUser".equals(auth.getPrincipal())) {
            return ResponseEntity.status(401).body("❌ คุณยังไม่ได้ login");
        }

        String username = auth.getPrincipal().toString();
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body("❌ ผู้ใช้ไม่พบในระบบ");
        }
        User user = userOpt.get();

        // ตรวจสอบ Project
        Optional<Project> projectOpt = projectRepository.findById(projectId);
        if (projectOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("❌ โครงการไม่พบ");
        }
        Project project = projectOpt.get();

        // สร้าง DownloadHistoryId
        DownloadHistoryId historyId = new DownloadHistoryId(user.getUserId(), project.getProjectID(), LocalDateTime.now());

        // สร้าง DownloadHistory
        DownloadHistory history = new DownloadHistory();
        history.setId(historyId);
        history.setUser(user);
        history.setProject(project);
        history.setDownloadDateTime(LocalDateTime.now());

        // บันทึก
        downloadHistoryRepository.save(history);

        return ResponseEntity.ok("✅ บันทึกประวัติการดาวน์โหลดเรียบร้อยแล้ว");
    }

    // ----------------------------
    // ดึงประวัติการดาวน์โหลดทั้งหมด
    // ----------------------------
    @GetMapping
    public ResponseEntity<?> getAll() {
        try {
            // รับประกันว่า user และ project ถูกโหลดด้วย EAGER fetch
            List<DownloadHistory> histories = service.getAll();
            return ResponseEntity.ok(histories);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    // ----------------------------
    // ดึงประวัติตาม Project
    // ----------------------------
    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<DownloadHistory>> getByProject(@PathVariable Long projectId) {
        List<DownloadHistory> histories = service.getByProjectId(projectId);
        return ResponseEntity.ok(histories);
    }

    // ----------------------------
    // ดึงประวัติตาม User
    // ----------------------------
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<DownloadHistory>> getByUser(@PathVariable Integer userId) {
        List<DownloadHistory> histories = service.getByUserId(userId);
        return ResponseEntity.ok(histories);
    }


}
