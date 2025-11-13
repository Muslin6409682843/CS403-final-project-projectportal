package th.ac.tu.cs.projectportal.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

import java.util.List;

@Configuration
public class ProjectConfig {  // เปลี่ยนชื่อคลาส

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // เปิด CORS
            .cors().and()
            // ปิด CSRF สำหรับ dev / testing
            .csrf().disable()
            // กำหนดสิทธิ์
            .authorizeHttpRequests()
                .requestMatchers("/api/admin/projects/**").permitAll()
                .anyRequest().authenticated();

        return http.build();
    }

    // ตั้งค่า CORS
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173")); // frontend
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true); // สำคัญ ถ้า fetch มี credentials

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}


//รอแก้ไข