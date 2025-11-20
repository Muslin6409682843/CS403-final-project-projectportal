package th.ac.tu.cs.projectportal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import th.ac.tu.cs.projectportal.entity.Project;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    @Query("""
    SELECT p FROM Project p 
    WHERE 
      LOWER(p.titleTh) LIKE %:q% OR
      LOWER(p.titleEn) LIKE %:q% OR
      LOWER(p.abstractTh) LIKE %:q% OR
      LOWER(p.abstractEn) LIKE %:q% OR
      LOWER(p.keywordTh) LIKE %:q% OR
      LOWER(p.keywordEn) LIKE %:q% OR
      LOWER(p.member) LIKE %:q% OR
      LOWER(p.advisor) LIKE %:q% OR
      LOWER(p.coAdvisor) LIKE %:q% OR
      LOWER(p.category) LIKE %:q% OR
      CAST(p.year AS string) LIKE %:q%
""")
    List<Project> searchProjects(@Param("q") String q);

}

