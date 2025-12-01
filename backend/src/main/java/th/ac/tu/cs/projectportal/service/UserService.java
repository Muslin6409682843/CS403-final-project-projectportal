package th.ac.tu.cs.projectportal.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import th.ac.tu.cs.projectportal.entity.User;
import th.ac.tu.cs.projectportal.repository.UserRepository;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // ตรวจสอบรหัสผ่านปัจจุบัน
    public boolean checkCurrentPassword(User user, String currentPassword) {
        return passwordEncoder.matches(currentPassword, user.getPassword());
    }

    // เปลี่ยนรหัสผ่านใหม่
    public User changePassword(User user, String newPassword) {
        user.setPassword(passwordEncoder.encode(newPassword));
        return userRepository.save(user);
    }

    // ค้นหาผู้ใช้ตามชื่อผู้ใช้
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }
}
