package sg.edu.singaporetech.yaswebapi.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import sg.edu.singaporetech.yaswebapi.entities.AccountSession;

import java.util.UUID;

public interface AccountSessionRepository  extends JpaRepository<AccountSession, UUID> {
}
