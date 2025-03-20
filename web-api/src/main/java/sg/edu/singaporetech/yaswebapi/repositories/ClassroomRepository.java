package sg.edu.singaporetech.yaswebapi.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import sg.edu.singaporetech.yaswebapi.entities.Classroom;

public interface ClassroomRepository extends JpaRepository<Classroom, Long> {
}