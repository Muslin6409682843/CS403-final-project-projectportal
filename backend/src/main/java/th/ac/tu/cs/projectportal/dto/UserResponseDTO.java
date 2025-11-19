package th.ac.tu.cs.projectportal.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import th.ac.tu.cs.projectportal.entity.Role;
import th.ac.tu.cs.projectportal.entity.Gender;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserResponseDTO {
    private Integer userId;
    private String userCode;
    private String username;
    private String nameTh;
    private String nameEn;
    private Gender gender;
    private String tel;
    private String email;
    private String faculty;
    private String department;
    private String institute;
    private Role role;
    private Boolean approved;
    private LocalDateTime approvalExpireAt;
    private LocalDateTime guestExpireAt;
}
