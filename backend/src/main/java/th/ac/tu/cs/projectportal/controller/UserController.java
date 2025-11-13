package th.ac.tu.cs.projectportal.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import jakarta.servlet.http.HttpSession;
import th.ac.tu.cs.projectportal.repository.UserRepository;

import java.util.Optional;
import java.time.LocalDateTime;

import th.ac.tu.cs.projectportal.entity.Role;
import th.ac.tu.cs.projectportal.entity.User;

import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5173" }, allowCredentials = "true")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User newUser) {
        Optional<User> existingUsername = userRepository.findByUsername(newUser.getUsername());
        Optional<User> existingEmail = userRepository.findByEmail(newUser.getEmail());

        if (existingUsername.isPresent()) {
            return ResponseEntity.badRequest().body("❌ Username นี้ถูกใช้แล้ว");
        }

        if (existingEmail.isPresent()) {
            return ResponseEntity.badRequest().body("❌ Email นี้ถูกใช้แล้ว");
        }

        // กำหนด role default เป็น Student หรือ Staff
        if (newUser.getRole() == null) {
            newUser.setRole(Role.Student);
        }

        // บันทึกวันหมดอายุอนุมัติ 5 วันนับจากปัจจุบัน
        newUser.setApprovalExpireAt(LocalDateTime.now().plusDays(5));
        newUser.setApproved(false); // ยังไม่อนุมัติ

        newUser.setPassword(passwordEncoder.encode(newUser.getPassword()));

        userRepository.save(newUser);

        return ResponseEntity.ok("✅ สมัครสมาชิกสำเร็จ! รอแอดมินอนุมัติภายใน 5 วัน");
    }

    @PostMapping("/users/register-guest")
    public ResponseEntity<?> registerGuest(@RequestBody User newGuest) {
        System.out.println("registerGuest endpoint hit! Username: " + newGuest.getUsername());
        Optional<User> existingUsername = userRepository.findByUsername(newGuest.getUsername());
        Optional<User> existingEmail = userRepository.findByEmail(newGuest.getEmail());

        if (existingUsername.isPresent()) {
            return ResponseEntity.badRequest().body("❌ Username นี้ถูกใช้แล้ว");
        }

        if (existingEmail.isPresent()) {
            return ResponseEntity.badRequest().body("❌ Email นี้ถูกใช้แล้ว");
        }

        // ✅ บังคับ role เป็น Guest เสมอ
        newGuest.setRole(Role.Guest);
        newGuest.setApproved(false); // ยังไม่อนุมัติ

        // ✅ ตั้งวันหมดอายุการรออนุมัติภายใน 5 วัน
        newGuest.setApprovalExpireAt(LocalDateTime.now().plusDays(5));

        newGuest.setPassword(passwordEncoder.encode(newGuest.getPassword()));

        userRepository.save(newGuest);

        return ResponseEntity.ok("✅ สมัครสมาชิก Guest สำเร็จ! กรุณารอแอดมินอนุมัติภายใน 5 วัน");
    }

    @PutMapping("/users/approve/{id}")
    public ResponseEntity<?> approveUser(@PathVariable Integer id) {
        var user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body("❌ ไม่พบผู้ใช้");
        }

        user.setApproved(true);

        // ถ้าเป็น Guest ให้ตั้งวันหมดอายุหลังอนุมัติ 7 วัน
        if (user.getRole() == Role.Guest) {
            user.setGuestExpireAt(LocalDateTime.now().plusDays(7));
        }

        userRepository.save(user);
        return ResponseEntity.ok("✅ อนุมัติผู้ใช้เรียบร้อยแล้ว");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginUser, HttpSession session) {
        Optional<User> optionalUser = userRepository.findByUsername(loginUser.getUsername());

        Map<String, Object> resp = new HashMap<>();

        if (optionalUser.isEmpty()) {
            resp.put("status", false);
            resp.put("error", "ยังไม่ได้สมัครสมาชิก");
            return ResponseEntity.status(401).body(resp);
        }

        User user = optionalUser.get();

        // ตรวจสอบรหัสผ่าน
        if (!passwordEncoder.matches(loginUser.getPassword(), user.getPassword())) {
            resp.put("status", false);
            resp.put("error", "Username หรือ Password ไม่ถูกต้อง");
            return ResponseEntity.status(401).body(resp);
        }

        // เงื่อนไขเฉพาะ Guest
        if (user.getRole() == Role.Guest) {
            resp.put("status", false);
            resp.put("error", "บัญชีนี้เป็น Guest โปรดสมัครผ่านหน้า Guest");
            return ResponseEntity.status(401).body(resp);
        }

        // ตรวจสอบการอนุมัติ Student/Staff
        if ((user.getRole() == Role.Student || user.getRole() == Role.Staff) && !user.getApproved()) {
            resp.put("status", true);
            resp.put("redirect", "/pending-approval");
            return ResponseEntity.ok(resp);
        }

        // ✅ สร้าง authentication object ให้ Spring Security
        List<SimpleGrantedAuthority> authorities = List.of(
                new SimpleGrantedAuthority("ROLE_" + user.getRole()));
        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                user.getUsername(), null, authorities);
        SecurityContextHolder.getContext().setAuthentication(auth);
        session.setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());

        // ส่ง response กลับ frontend
        resp.put("status", true);
        resp.put("role", user.getRole());

        switch (user.getRole()) {
            case Admin -> {
                // Admin ใช้เหมือนเดิม
                resp.put("redirect", "/admin");
            }
            case Student, Staff -> {
                // Student/Staff login สำเร็จ → redirect ไปหน้า Home
                resp.put("redirect", "/");
            }
            default -> resp.put("redirect", "/"); // fallback
        }

        return ResponseEntity.ok(resp);
    }

    @PostMapping("/guest-login")
    public ResponseEntity<?> guestLogin(@RequestBody User loginUser, HttpSession session) {
        Map<String, Object> resp = new HashMap<>();

        Optional<User> optionalUser = userRepository.findByUsername(loginUser.getUsername());

        if (optionalUser.isEmpty()) {
            resp.put("status", false);
            resp.put("error", "ยังไม่ได้สมัครสมาชิก");
            return ResponseEntity.status(401).body(resp);
        }

        User user = optionalUser.get();

        if (!passwordEncoder.matches(loginUser.getPassword(), user.getPassword())) {
            resp.put("status", false);
            resp.put("error", "Username หรือ Password ไม่ถูกต้อง");
            return ResponseEntity.status(401).body(resp);
        }

        if (user.getRole() != Role.Guest) {
            resp.put("status", false);
            resp.put("error", "บัญชีนี้ไม่ใช่ Guest โปรดสมัครผ่านหน้า นักศึกษา/บุคลากร");
            return ResponseEntity.status(401).body(resp);
        }

        if (!user.getApproved()) {
            resp.put("status", true);
            resp.put("redirect", "/pending-approval");
            return ResponseEntity.ok(resp);
        }

        // login สำเร็จ
        List<SimpleGrantedAuthority> authorities = List.of(
                new SimpleGrantedAuthority("ROLE_" + user.getRole()));
        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(user.getUsername(), null,
                authorities);
        SecurityContextHolder.getContext().setAuthentication(auth);
        session.setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());

        resp.put("status", true);
        resp.put("role", user.getRole());
        resp.put("redirect", "/");

        resp.put("guestExpireAt", user.getGuestExpireAt());
        return ResponseEntity.ok(resp);
    }

    @GetMapping("/users/pending")
    public ResponseEntity<?> getPendingUsers() {
        List<Map<String, Object>> pendingUsers = userRepository.findAll().stream()
                .filter(u -> !u.getApproved() && u.getApprovalExpireAt().isAfter(LocalDateTime.now()))
                .map(u -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", u.getUserId());
                    map.put("username", u.getUsername());
                    map.put("nameTh", u.getNameTh());
                    map.put("nameEn", u.getNameEn());
                    map.put("gender", u.getGender() != null ? u.getGender().toString() : "-");
                    map.put("tel", u.getTel());
                    map.put("email", u.getEmail());
                    map.put("faculty", u.getFaculty());
                    map.put("department", u.getDepartment());
                    map.put("institute", u.getInstitute());
                    map.put("role", u.getRole());
                    map.put("approved", u.getApproved());
                    map.put("approvalExpireAt", u.getApprovalExpireAt());
                    map.put("guestExpireAt", u.getGuestExpireAt());
                    return map;
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(pendingUsers);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Integer id) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("❌ ไม่พบผู้ใช้");
        }
        userRepository.deleteById(id);
        return ResponseEntity.ok("✅ ลบผู้ใช้เรียบร้อยแล้ว");
    }

    @PutMapping("/users/reset-password/{id}")
    public ResponseEntity<?> resetPassword(@PathVariable Integer id) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("❌ ไม่พบผู้ใช้");
        }
        User user = userOpt.get();
        user.setPassword(passwordEncoder.encode("123456")); // ตั้งรหัสผ่านใหม่เป็น 123456
        userRepository.save(user);
        return ResponseEntity.ok("✅ ตั้งรหัสผ่านใหม่เรียบร้อยแล้ว");
    }

    @GetMapping("/check-session")
    public ResponseEntity<Map<String, Object>> checkSession(HttpSession session) {
        Map<String, Object> response = new HashMap<>();

        // ดึง authentication context ที่ Spring Security เก็บไว้ใน session
        var context = session.getAttribute("SPRING_SECURITY_CONTEXT");

        if (context != null) {
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            if (principal != null && !"anonymousUser".equals(principal)) {
                String username = principal.toString();

                // หาข้อมูล user จาก database
                var userOpt = userRepository.findByUsername(username);
                if (userOpt.isPresent()) {
                    User user = userOpt.get();

                    response.put("status", true);
                    response.put("username", user.getUsername());
                    response.put("role", user.getRole());
                    if (user.getRole() == Role.Guest) {
                        response.put("guestExpireAt", user.getGuestExpireAt()); // ✅ เพิ่ม
                    }
                    return ResponseEntity.ok(response);
                }
            }
        }

        response.put("status", false);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        try {
            session.invalidate(); // ลบ session ทิ้ง
            SecurityContextHolder.clearContext(); // ล้าง context ของ Spring Security
            return ResponseEntity.ok(Map.of("status", true, "message", "Logout สำเร็จ"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("status", false, "message", "Logout ล้มเหลว"));
        }
    }

}