package th.ac.tu.cs.projectportal.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import th.ac.tu.cs.projectportal.entity.Project;
import th.ac.tu.cs.projectportal.service.ProjectService;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true") // ปรับตาม frontend
public class PublicProjectController {

    private final ProjectService projectService;

    // ----------------------------
    // ดึงโครงงานทั้งหมดแบบ public
    // ----------------------------
    @GetMapping
    public ResponseEntity<List<Project>> getAllProjectsPublic() {
        List<Project> projects = projectService.getAllProjects();
        return ResponseEntity.ok(projects);
    }

    // ----------------------------
    // ดึงโครงงานตาม ID แบบ public
    // ----------------------------
    @GetMapping("/{id}")
    public ResponseEntity<?> getProjectByIdPublic(@PathVariable Long id) {
        Project project = projectService.getProjectById(id);
        if (project == null) {
            return ResponseEntity.status(404).body("ไม่พบโครงงาน");
        }
        return ResponseEntity.ok(project);
    }
}
