package th.ac.tu.cs.projectportal.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import th.ac.tu.cs.projectportal.entity.Project;
import th.ac.tu.cs.projectportal.service.ProjectService;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

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

    @GetMapping("/keywords/popular")
    public ResponseEntity<List<String>> getPopularKeywordsPublic() {
        List<Project> allProjects = projectService.getAllProjects();

        Map<String, Integer> freqMap = new HashMap<>();

        for (Project p : allProjects) {
            if (p.getKeywordTh() != null && !p.getKeywordTh().isEmpty()) {
                String[] kws = p.getKeywordTh().split(",");
                for (String kw : kws) {
                    String t = kw.trim();
                    if (!t.isEmpty() && !t.equals("-")) {
                        freqMap.put(t, freqMap.getOrDefault(t, 0) + 1);
                    }
                }

            }
        }

        // sort by frequency
        List<String> sorted = freqMap.entrySet().stream()
                .sorted((a, b) -> b.getValue() - a.getValue())
                .map(Map.Entry::getKey)
                .toList();

        // เลือก 8 คำแรก
        List<String> selected = new ArrayList<>();
        for (int i = 0; i < Math.min(8, sorted.size()); i++)
            selected.add(sorted.get(i));

        return ResponseEntity.ok(selected);
    }

}
