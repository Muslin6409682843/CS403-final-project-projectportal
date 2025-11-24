package th.ac.tu.cs.projectportal.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "downloadhistory")
public class DownloadHistory {

    @EmbeddedId
    private DownloadHistoryId id;

    @ManyToOne(fetch = FetchType.EAGER)
    @MapsId("userId")
    @JoinColumn(name = "UserID")
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @MapsId("projectId")
    @JoinColumn(name = "ProjectID")
    private Project project;

    @Column(name = "DownloadDateTime", insertable = false, updatable = false)
    private LocalDateTime downloadDateTime;

    public DownloadHistory() {}

    public DownloadHistory(User user, Project project) {
        this.user = user;
        this.project = project;

        LocalDateTime now = LocalDateTime.now();
        this.id = new DownloadHistoryId(user.getUserId(), project.getProjectID(), now);

        this.downloadDateTime = now;
    }

    // --- Getters & Setters ---
    public DownloadHistoryId getId() {
        return id;
    }

    public void setId(DownloadHistoryId id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public LocalDateTime getDownloadDateTime() {
        return downloadDateTime;
    }

    public void setDownloadDateTime(LocalDateTime downloadDateTime) {
        this.downloadDateTime = downloadDateTime;
    }
}
