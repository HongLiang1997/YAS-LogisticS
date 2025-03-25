package sg.edu.singaporetech.yaswebapi.services;

import org.springframework.stereotype.Service;
import sg.edu.singaporetech.yaswebapi.entities.Classroom;
import sg.edu.singaporetech.yaswebapi.enums.ClassroomStatus;
import sg.edu.singaporetech.yaswebapi.repositories.ClassroomRepository;

import java.util.Optional;

@Service
public class EditClassroomService {
    private final ClassroomRepository classroomRepository;

    public EditClassroomService(ClassroomRepository classroomRepository) {
        this.classroomRepository = classroomRepository;
    }

    public Boolean updateClassroom(Long classroomID, String name, ClassroomStatus status) {
        Optional<Classroom> result = classroomRepository.findById(classroomID);
        if (result.isEmpty()) {
            return false;
        }

        Classroom classroom = result.get();
        classroom.setName(name);
        classroom.setStatus(status);
        classroomRepository.save(classroom);
        return true;
    }

    public Long createClassroom(String name) {
        Classroom classroom = new Classroom();
        classroom.setName(name);
        classroom.setStatus(ClassroomStatus.CLOSED);

        Classroom resultClassroom = classroomRepository.save(classroom);
        return resultClassroom.getId();
    }

    public void deleteClassroom(Long classroomID) {
        classroomRepository.deleteById(classroomID);
    }
}
