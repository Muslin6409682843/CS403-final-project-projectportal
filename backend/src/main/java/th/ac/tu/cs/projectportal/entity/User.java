package th.ac.tu.cs.projectportal.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "user")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "UserID")
    private Integer userId;

    @Column(name = "UserCode")
    private String userCode;

    @Column(name = "Username", nullable = false, unique = true)
    private String username;

    @Column(name = "Password", nullable = false)
    private String password;

    @Column(name = "Name_th", nullable = false)
    private String nameTh;

    @Column(name = "Name_en", nullable = false)
    private String nameEn;

    @Enumerated(EnumType.STRING)
    @Column(name = "Gender")
    private Gender gender;

    @Column(name = "Tel")
    private String tel;

    @Column(name = "Email", unique = true)
    private String email;

    @Column(name = "Faculty")
    private String faculty;

    @Column(name = "Department")
    private String department;

    @Column(name = "Institute")
    private String institute;

    @Enumerated(EnumType.STRING)
    @Column(name = "Role")
    private Role role;

    @Column(name = "Approved")
    private Boolean approved = false;

    @Column(name = "guest_expire_at")
    private LocalDateTime guestExpireAt;

    @Column(name = "approval_expire_at")
    private LocalDateTime approvalExpireAt;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // --- Constructors ---
    public User() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.role = Role.Student; // Default role
    }

    // --- Getters & Setters ---
    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getUserCode() {
        return userCode;
    }

    public void setUserCode(String userCode) {
        this.userCode = userCode;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getNameTh() {
        return nameTh;
    }

    public void setNameTh(String nameTh) {
        this.nameTh = nameTh;
    }

    public String getNameEn() {
        return nameEn;
    }

    public void setNameEn(String nameEn) {
        this.nameEn = nameEn;
    }

    public Gender getGender() {
        return gender;
    }

    public void setGender(Gender gender) {
        this.gender = gender;
    }

    public String getTel() {
        return tel;
    }

    public void setTel(String tel) {
        this.tel = tel;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFaculty() {
        return faculty;
    }

    public void setFaculty(String faculty) {
        this.faculty = faculty;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public LocalDateTime getGuestExpireAt() {
        return guestExpireAt;
    }

    public void setGuestExpireAt(LocalDateTime guestExpireAt) {
        this.guestExpireAt = guestExpireAt;
    }

    public String getInstitute() {
        return institute;
    }

    public void setInstitute(String institute) {
        this.institute = institute;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Boolean getApproved() {
        return approved;
    }

    public void setApproved(Boolean approved) {
        this.approved = approved;
    }

    public LocalDateTime getApprovalExpireAt() {
        return approvalExpireAt;
    }

    public void setApprovalExpireAt(LocalDateTime approvalExpireAt) {
        this.approvalExpireAt = approvalExpireAt;
    }
}