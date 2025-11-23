package th.ac.tu.cs.projectportal.entity;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class HistoryId implements Serializable {

    private Integer userId;  // ตรงกับ User.userId
    private Long projectId;   // ตรงกับ Project.projectID

    public HistoryId() {}

    public HistoryId(Integer userId, Long projectId) {
        this.userId = userId;
        this.projectId = projectId;
    }

    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }

    public Long getProjectId() { return projectId; }
    public void setProjectId(Long projectId) { this.projectId = projectId; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof HistoryId)) return false;
        HistoryId that = (HistoryId) o;
        return Objects.equals(userId, that.userId) &&
               Objects.equals(projectId, that.projectId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, projectId);
    }
}
