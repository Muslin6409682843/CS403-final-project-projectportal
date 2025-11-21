package th.ac.tu.cs.projectportal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import th.ac.tu.cs.projectportal.entity.Bookmark;
import th.ac.tu.cs.projectportal.entity.BookmarkId;

import java.util.List;

@Repository
public interface BookmarkRepository extends JpaRepository<Bookmark, BookmarkId> {
    List<Bookmark> findByUserUserId(Integer userId);

    boolean existsByUserUserIdAndProjectProjectID(Integer userId, Long projectId);

}
