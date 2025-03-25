package sg.edu.singaporetech.yaswebapi.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import sg.edu.singaporetech.yaswebapi.entities.Tray;
import sg.edu.singaporetech.yaswebapi.enums.TrayStatus;

import java.util.List;

public interface TrayRepository extends JpaRepository<Tray, Long> {
    List<Tray> getTrayById(Long id);

    List<Tray> findByStatus(TrayStatus status);
}