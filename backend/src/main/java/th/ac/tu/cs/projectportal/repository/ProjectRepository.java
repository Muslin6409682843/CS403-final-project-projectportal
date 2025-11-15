package th.ac.tu.cs.projectportal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import th.ac.tu.cs.projectportal.entity.Project;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    
}
