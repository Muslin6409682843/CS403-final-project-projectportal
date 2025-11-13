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


}
