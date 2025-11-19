package th.ac.tu.cs.projectportal.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import th.ac.tu.cs.projectportal.entity.User;
import th.ac.tu.cs.projectportal.entity.Role;
import th.ac.tu.cs.projectportal.repository.UserRepository;
import th.ac.tu.cs.projectportal.dto.UserResponseDTO;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    // ✅ 1. ดึงรายชื่อผู้ใช้ที่ยังไม่ approve
    @GetMapping("/pending-users")
    public List<UserResponseDTO> getPendingUsers() {
        List<User> pendingList = userRepository.findByApprovedFalse();
        System.out.println("Pending users count: " + pendingList.size());

        return pendingList.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ✅ 2. ดึงรายชื่อผู้ใช้ที่อนุมัติแล้ว
    @GetMapping("/approved-users")
    public List<UserResponseDTO> getApprovedUsers() {
        return userRepository.findByApprovedTrue()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ✅ 3. กดอนุมัติ (approve) ผู้ใช้
    @PutMapping("/approve/{id}")
    public UserResponseDTO approveUser(@PathVariable Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setApproved(true);

        // สำหรับ Guest ตั้ง guestExpireAt
        if (user.getRole() == Role.Guest) {
            user.setGuestExpireAt(LocalDateTime.now().plusDays(7));
        }

        userRepository.save(user);

        return mapToDTO(user);
    }

    // ✅ 4. ปฏิเสธ (ลบผู้ใช้)
    @DeleteMapping("/reject/{id}")
    public ResponseEntity<Void> rejectUser(@PathVariable Integer id) {
        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // ✅ 5. ลบ user ที่อนุมัติแล้ว
    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteApprovedUser(@PathVariable Integer id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // 🧩 Helper: แปลง User → DTO
    private UserResponseDTO mapToDTO(User user) {
        UserResponseDTO dto = new UserResponseDTO();
        dto.setUserId(user.getUserId());
        dto.setUserCode(user.getUserCode());
        dto.setUsername(user.getUsername());
        dto.setNameTh(user.getNameTh());
        dto.setNameEn(user.getNameEn());
        dto.setGender(user.getGender());
        dto.setTel(user.getTel());
        dto.setEmail(user.getEmail());
        dto.setFaculty(user.getFaculty());
        dto.setDepartment(user.getDepartment());
        dto.setInstitute(user.getInstitute());
        dto.setRole(user.getRole());
        dto.setApproved(user.getApproved());
        dto.setApprovalExpireAt(user.getApprovalExpireAt());
        dto.setGuestExpireAt(user.getGuestExpireAt());
        return dto;
    }
}
