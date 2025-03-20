package sg.edu.singaporetech.yaswebapi.initializers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import sg.edu.singaporetech.yaswebapi.components.PasswordEncoderBean;
import sg.edu.singaporetech.yaswebapi.entities.Account;
import sg.edu.singaporetech.yaswebapi.repositories.AccountRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private PasswordEncoderBean passwordEncoderBean;

    @Value("${app.default-admin-username}")
    private String defaultAdminUsername;

    @Value("${app.default-admin-password}")
    private String defaultAdminPassword;

    @Override
    public void run(String... args) {
        if (accountRepository.count() == 0) {
            Account defaultAccount = new Account();
            defaultAccount.setName(defaultAdminUsername);
            defaultAccount.setHashed_password(passwordEncoderBean.encodePassword(defaultAdminPassword));
            accountRepository.save(defaultAccount);
        }
    }
}