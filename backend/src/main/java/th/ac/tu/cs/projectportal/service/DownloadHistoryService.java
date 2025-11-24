package th.ac.tu.cs.projectportal.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import th.ac.tu.cs.projectportal.entity.DownloadHistory;
import th.ac.tu.cs.projectportal.entity.Project;
import th.ac.tu.cs.projectportal.entity.User;
import th.ac.tu.cs.projectportal.repository.DownloadHistoryRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DownloadHistoryService {

    private final DownloadHistoryRepository repository;

    // บันทึกดาวน์โหลด
    public DownloadHistory saveDownload(User user, Project project) {
        LocalDateTime now = LocalDateTime.now();
        DownloadHistory history = new DownloadHistory(user, project);
        history.setDownloadDateTime(now);
        return repository.save(history);
    }

    // ดึงทั้งหมด พร้อม project + user
    public List<DownloadHistory> getAll() {
        return repository.findAllWithProjectAndUser();
    }

    public List<DownloadHistory> getByProjectId(Long projectId) {
        return getAll().stream()
                .filter(h -> h.getProject().getProjectID().equals(projectId))
                .toList();
    }

    public List<DownloadHistory> getByUserId(Integer userId) {
        return getAll().stream()
                .filter(h -> h.getUser().getUserId().equals(userId))
                .toList();
    }
}
