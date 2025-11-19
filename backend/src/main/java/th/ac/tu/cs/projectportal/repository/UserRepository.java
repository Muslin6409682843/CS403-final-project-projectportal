package th.ac.tu.cs.projectportal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import th.ac.tu.cs.projectportal.entity.User;
import th.ac.tu.cs.projectportal.entity.Role;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.List;

public interface UserRepository extends JpaRepository<User, Integer> {
    // ใช้ใน login/register
    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    Optional<User> findByUserCode(String userCode);

    // สำหรับลบผู้ใช้ที่ยังไม่อนุมัติและหมดอายุ
    List<User> findByApprovedFalseAndApprovalExpireAtBefore(LocalDateTime dateTime);

    // สำหรับลบ Guest ที่อนุมัติแล้ว และหมดอายุการใช้งาน
    List<User> findByRoleAndApprovedTrueAndGuestExpireAtBefore(Role role, LocalDateTime dateTime);

    List<User> findByApprovedFalse();

    List<User> findByApprovedTrue();

}