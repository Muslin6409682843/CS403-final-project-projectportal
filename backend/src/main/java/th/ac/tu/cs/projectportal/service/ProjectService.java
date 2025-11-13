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

    public Project saveProject(Project project) {
        return projectRepository.save(project);
    }

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public Project getProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));
    }   


    public Project updateProject(Long id, Project newData) {
        return projectRepository.findById(id)
                .map(existing -> {
                    existing.setTitleTh(newData.getTitleTh());
                    existing.setTitleEn(newData.getTitleEn());
                    existing.setAbstractTh(newData.getAbstractTh());
                    existing.setAbstractEn(newData.getAbstractEn());
                    existing.setKeywordTh(newData.getKeywordTh());
                    existing.setKeywordEn(newData.getKeywordEn());
                    existing.setAdvisor(newData.getAdvisor());
                    existing.setCoAdvisor(newData.getCoAdvisor());
                    existing.setCategory(newData.getCategory());
                    return projectRepository.save(existing);
                })
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));
    }

    public void deleteProject(Long id) {
    projectRepository.deleteById(id);
    }

}
