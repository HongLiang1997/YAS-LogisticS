package sg.edu.singaporetech.yaswebapi.services;

import org.springframework.stereotype.Service;
import sg.edu.singaporetech.yaswebapi.components.PasswordMatcher;
import sg.edu.singaporetech.yaswebapi.entities.Account;
import sg.edu.singaporetech.yaswebapi.entities.AccountSession;
import sg.edu.singaporetech.yaswebapi.repositories.AccountRepository;
import sg.edu.singaporetech.yaswebapi.repositories.AccountSessionRepository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthenticationService {

    private final PasswordMatcher passwordMatcher;
    private final AccountRepository accountRepository;
    private final AccountSessionRepository accountSessionRepository;

    public AuthenticationService(
            PasswordMatcher passwordMatcher,
            AccountRepository accountRepository,
            AccountSessionRepository accountSessionRepository
    ) {
        this.passwordMatcher = passwordMatcher;
        this.accountRepository = accountRepository;
        this.accountSessionRepository = accountSessionRepository;
    }

    /**
     * Attempted to authenticate an admin based on provided username/password.
     * @param username
     * @param password
     * @return Empty optional if bad username or password; Session Token otherwise
     */
    public Optional<UUID> authenticate(
            String username,
            String password
    ) {
        Optional<Account> result = accountRepository.findByName(username);
        if (result.isEmpty()) {
            return Optional.empty();
        }

        String hashedPassword = result.get().getHashed_password();
        boolean isCorrectPassword = passwordMatcher.matches(password, hashedPassword);
        if (!isCorrectPassword) {
            return Optional.empty();
        }

        UUID token = createAccountSession(result.get());
        return Optional.of(token);
    }

    private UUID createAccountSession(Account account) {
        AccountSession accountSession = new AccountSession();
        accountSession.setAccount(account);
        accountSession.setCreatedAt(LocalDateTime.now());
        accountSession.setExpire_at(LocalDateTime.now().plusDays(7));

        AccountSession savedSession = accountSessionRepository.save(accountSession);
        return savedSession.getId();
    }

    public boolean isValidSession(UUID sessionId) {
        Optional<AccountSession> result = accountSessionRepository.findById(sessionId);
        if (result.isEmpty()) {
            return false;
        }

        LocalDateTime expireAt = result.get().getExpire_at();
        return LocalDateTime.now().isBefore(expireAt);
    }
}
