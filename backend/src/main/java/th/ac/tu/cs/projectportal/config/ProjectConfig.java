package th.ac.tu.cs.projectportal.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class ProjectConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // ให้ /upload/** ชี้ไปที่โฟลเดอร์ upload ใน project root
        registry.addResourceHandler("/upload/**")
                .addResourceLocations("file:upload/");
    }
}
