package th.ac.tu.cs.projectportal.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import th.ac.tu.cs.projectportal.entity.History;
import th.ac.tu.cs.projectportal.entity.HistoryId;
import th.ac.tu.cs.projectportal.entity.Project;
import th.ac.tu.cs.projectportal.entity.User;
import th.ac.tu.cs.projectportal.repository.HistoryRepository;
import th.ac.tu.cs.projectportal.repository.UserRepository;
import th.ac.tu.cs.projectportal.repository.ProjectRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}, allowCredentials = "true")
public class HistoryController {

    @Autowired
    private HistoryRepository historyRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectRepository projectRepository;

    // บันทึกประวัติการเข้าชมโครงการ
    @PostMapping("/history/{projectId}")
    public ResponseEntity<?> addHistory(@PathVariable Long projectId) {
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

        // สร้าง HistoryId
        HistoryId historyId = new HistoryId(user.getUserId(), project.getProjectID());

        // ดึง History ถ้ามีอยู่แล้ว หรือสร้างใหม่
        History history = historyRepository.findById(historyId)
                .orElseGet(() -> {
                    History h = new History();
                    h.setId(historyId);
                    h.setUser(user);
                    h.setProject(project);
                    return h;
                });

        // อัปเดตเวลาเข้าชมล่าสุด
        history.setViewDateTime(LocalDateTime.now());

        // บันทึก
        historyRepository.save(history);

        return ResponseEntity.ok("✅ บันทึกประวัติการเข้าชมเรียบร้อยแล้ว");
    }

    // ดึงประวัติการเข้าชมของผู้ใช้
    @GetMapping("/history")
    public ResponseEntity<?> getUserHistory() {
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

        List<History> histories = historyRepository.findByUserUserIdOrderByViewDateTimeDesc(user.getUserId());

        // ส่ง projectIds กลับ (Long)
        List<Long> projectIds = histories.stream()
                .map(h -> h.getProject().getProjectID())
                .toList();

        return ResponseEntity.ok(projectIds);
    }
}
