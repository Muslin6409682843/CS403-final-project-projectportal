package th.ac.tu.cs.projectportal.entity;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Objects;

@Embeddable
public class DownloadHistoryId implements Serializable {

    private Integer userId;
    private Long projectId;
    private LocalDateTime downloadDateTime;

    public DownloadHistoryId() {}

    public DownloadHistoryId(Integer userId, Long projectId, LocalDateTime downloadDateTime) {
        this.userId = userId;
        this.projectId = projectId;
        this.downloadDateTime = downloadDateTime;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        DownloadHistoryId that = (DownloadHistoryId) o;
        return Objects.equals(userId, that.userId) &&
            Objects.equals(projectId, that.projectId) &&
            Objects.equals(downloadDateTime, that.downloadDateTime);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, projectId, downloadDateTime);
    }


    // --- Getters & Setters ---
    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public LocalDateTime getDownloadDateTime() {
        return downloadDateTime;
    }

    public void setDownloadDateTime(LocalDateTime downloadDateTime) {
        this.downloadDateTime = downloadDateTime;
    }
}
