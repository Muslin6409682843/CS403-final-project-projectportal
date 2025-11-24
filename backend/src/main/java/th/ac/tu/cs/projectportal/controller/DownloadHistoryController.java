package th.ac.tu.cs.projectportal.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import th.ac.tu.cs.projectportal.entity.DownloadHistory;
import th.ac.tu.cs.projectportal.service.DownloadHistoryService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/download-history")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"}, allowCredentials = "true")
public class DownloadHistoryController {

    private final DownloadHistoryService service;

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
