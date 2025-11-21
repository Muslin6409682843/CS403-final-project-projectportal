package th.ac.tu.cs.projectportal.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookmark")
public class Bookmark {

    @EmbeddedId
    private BookmarkId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("userId")
    @JoinColumn(name = "UserID")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("projectId")
    @JoinColumn(name = "ProjectID")
    private Project project;

    @Column(name = "BookmarkDate")
    private LocalDateTime bookmarkDate;

    public Bookmark() {
        this.bookmarkDate = LocalDateTime.now();
    }

    public Bookmark(User user, Project project) {
        this.user = user;
        this.project = project;
        this.id = new BookmarkId(user.getUserId(), project.getProjectID());
        this.bookmarkDate = LocalDateTime.now();
    }

    // --- Getters & Setters ---
    public BookmarkId getId() {
        return id;
    }

    public void setId(BookmarkId id) {
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

    public LocalDateTime getBookmarkDate() {
        return bookmarkDate;
    }

    public void setBookmarkDate(LocalDateTime bookmarkDate) {
        this.bookmarkDate = bookmarkDate;
    }
}