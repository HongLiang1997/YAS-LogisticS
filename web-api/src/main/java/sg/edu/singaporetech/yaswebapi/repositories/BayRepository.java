package sg.edu.singaporetech.yaswebapi.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import sg.edu.singaporetech.yaswebapi.entities.Bay;

import java.util.Optional;

public interface BayRepository extends JpaRepository<Bay, Long> {
}