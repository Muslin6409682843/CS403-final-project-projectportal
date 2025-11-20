package th.ac.tu.cs.projectportal.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import th.ac.tu.cs.projectportal.entity.Project;
import th.ac.tu.cs.projectportal.repository.ProjectRepository;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;

    // บันทึกหรืออัปเดตโครงงาน
    public Project saveProject(Project project) {
        return projectRepository.save(project);
    }

    // ดึงโครงงานทั้งหมด
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    // ตรวจสอบว่าโครงงานมีอยู่ไหม
    public boolean existsById(Long id) {
        return projectRepository.existsById(id);
    }

    // ลบโครงงาน
    public void deleteProjectById(Long id) {
        projectRepository.deleteById(id);
    }

    // ดึงโครงงานโดยใช้ ID
    public Project getProjectById(Long id) {
        return projectRepository.findById(id).orElse(null);
    }

    public List<Project> searchProjects(String q) {
        return projectRepository.searchProjects(q.toLowerCase());
    }

}
