package sg.edu.singaporetech.yaswebapi.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import sg.edu.singaporetech.yaswebapi.entities.Account;

import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Long> {
    Optional<Account> findByName(String name);
}