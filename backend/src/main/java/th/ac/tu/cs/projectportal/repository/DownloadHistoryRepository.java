package th.ac.tu.cs.projectportal.repository;

import th.ac.tu.cs.projectportal.entity.DownloadHistory;
import th.ac.tu.cs.projectportal.entity.DownloadHistoryId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface DownloadHistoryRepository extends JpaRepository<DownloadHistory, DownloadHistoryId> {

    // Fetch พร้อม project และ user
    @Query("SELECT d FROM DownloadHistory d " +
           "LEFT JOIN FETCH d.project " +
           "LEFT JOIN FETCH d.user")
    List<DownloadHistory> findAllWithProjectAndUser();

    // Top 5 Projects by download count
    @Query("SELECT d.project, COUNT(d) as cnt " +
           "FROM DownloadHistory d " +
           "GROUP BY d.project " +
           "ORDER BY cnt DESC")
    List<Object[]> findTop5ByDownloadCount();
}
