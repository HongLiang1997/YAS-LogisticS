package sg.edu.singaporetech.yaswebapi.components;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class PasswordMatcher {

    private final PasswordEncoder passwordEncoder;

    public PasswordMatcher(PasswordEncoderBean passwordEncoderBean) {
        this.passwordEncoder = passwordEncoderBean.passwordEncoder();
    }

    public boolean matches(CharSequence rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }
}
