package sg.edu.singaporetech.yaswebapi.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import sg.edu.singaporetech.yaswebapi.entities.Tray;

public interface TrayRepository extends JpaRepository<Tray, Long> {
}