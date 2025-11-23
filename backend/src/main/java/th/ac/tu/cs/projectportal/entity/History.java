package th.ac.tu.cs.projectportal.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "viewhistory")
public class History {

    @EmbeddedId
    private HistoryId id;  // Composite key

    @ManyToOne
    @MapsId("userId")     // ชี้ไปที่ field userId ใน HistoryId
    @JoinColumn(name = "UserID")
    private User user;

    @ManyToOne
    @MapsId("projectId")  // ชี้ไปที่ field projectId ใน HistoryId
    @JoinColumn(name = "ProjectID")
    private Project project;

    @Column(name = "ViewDateTime")
    private LocalDateTime viewDateTime;

    // --- Constructors ---
    public History() {}

    public History(HistoryId id, User user, Project project, LocalDateTime viewDateTime) {
        this.id = id;
        this.user = user;
        this.project = project;
        this.viewDateTime = viewDateTime;
    }

    // --- Getter / Setter ---
    public HistoryId getId() { return id; }
    public void setId(HistoryId id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Project getProject() { return project; }
    public void setProject(Project project) { this.project = project; }

    public LocalDateTime getViewDateTime() { return viewDateTime; }
    public void setViewDateTime(LocalDateTime viewDateTime) { this.viewDateTime = viewDateTime; }
}
