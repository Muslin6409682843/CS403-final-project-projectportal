package th.ac.tu.cs.projectportal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import th.ac.tu.cs.projectportal.entity.History;
import th.ac.tu.cs.projectportal.entity.HistoryId;

import java.util.List;

public interface HistoryRepository extends JpaRepository<History, HistoryId> {
    List<History> findByUserUserIdOrderByViewDateTimeDesc(Integer userId);

}
