package th.ac.tu.cs.projectportal.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import th.ac.tu.cs.projectportal.entity.Bookmark;
import th.ac.tu.cs.projectportal.entity.BookmarkId;
import th.ac.tu.cs.projectportal.entity.User;
import th.ac.tu.cs.projectportal.entity.Project;
import th.ac.tu.cs.projectportal.entity.Role;
import th.ac.tu.cs.projectportal.repository.BookmarkRepository;
import th.ac.tu.cs.projectportal.repository.UserRepository;
import th.ac.tu.cs.projectportal.repository.ProjectRepository;

import java.util.Optional;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}, allowCredentials = "true")
public class BookmarkController {

    @Autowired
    private BookmarkRepository bookmarkRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @PostMapping("/bookmark/{projectId}")
    public ResponseEntity<?> addBookmark(@PathVariable Long projectId) {
        // ดึง username จาก session ของ Spring Security
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || "anonymousUser".equals(auth.getPrincipal())) {
            return ResponseEntity.status(401).body("❌ คุณยังไม่ได้ login");
        }

        String username = auth.getPrincipal().toString();
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body("❌ ผู้ใช้ไม่พบในระบบ");
        }

        User user = userOpt.get();

        // ตรวจสอบ role
        if (user.getRole() == Role.Admin) {
            return ResponseEntity.status(403).body("❌ ผู้ดูแลระบบไม่สามารถ bookmark ได้");
        }

        // ตรวจสอบ Project
        Optional<Project> projectOpt = projectRepository.findById(projectId);
        if (projectOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("❌ โครงการไม่พบ");
        }

        Project project = projectOpt.get();

        // สร้าง Bookmark
        BookmarkId bookmarkId = new BookmarkId(user.getUserId(), project.getProjectID());
        if (bookmarkRepository.existsById(bookmarkId)) {
            return ResponseEntity.badRequest().body("❌ คุณได้บันทึกโครงการนี้แล้ว");
        }

        Bookmark bookmark = new Bookmark();
        bookmark.setId(bookmarkId);
        bookmark.setUser(user);
        bookmark.setProject(project);

        bookmarkRepository.save(bookmark);

        return ResponseEntity.ok("✅ บันทึกโครงการใน Favorites เรียบร้อยแล้ว");
    }

    @DeleteMapping("/bookmark/{projectId}")
    public ResponseEntity<?> removeBookmark(@PathVariable Long projectId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || "anonymousUser".equals(auth.getPrincipal())) {
            return ResponseEntity.status(401).body("❌ คุณยังไม่ได้ login");
        }

        String username = auth.getPrincipal().toString();
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body("❌ ผู้ใช้ไม่พบในระบบ");
        }

        User user = userOpt.get();

        BookmarkId bookmarkId = new BookmarkId(user.getUserId(), projectId);
        if (!bookmarkRepository.existsById(bookmarkId)) {
            return ResponseEntity.badRequest().body("❌ โครงการนี้ยังไม่ได้บันทึกใน Favorites");
        }

        bookmarkRepository.deleteById(bookmarkId);
        return ResponseEntity.ok("✅ ลบโครงการออกจาก Favorites เรียบร้อยแล้ว");
    }

    @GetMapping("/bookmark")
    public ResponseEntity<?> getUserBookmarks() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    if (auth == null || "anonymousUser".equals(auth.getPrincipal())) {
        return ResponseEntity.status(401).body("❌ คุณยังไม่ได้ login");
    }

    String username = auth.getPrincipal().toString();
    Optional<User> userOpt = userRepository.findByUsername(username);
    if (userOpt.isEmpty()) {
        return ResponseEntity.status(401).body("❌ ผู้ใช้ไม่พบในระบบ");
    }

    User user = userOpt.get();
    List<Bookmark> bookmarks = bookmarkRepository.findByUserUserId(user.getUserId());

    // return list of project IDs
    List<Long> projectIds = bookmarks.stream()
            .map(b -> b.getProject().getProjectID())
            .toList();

    return ResponseEntity.ok(projectIds);
}

}
