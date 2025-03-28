package sg.edu.singaporetech.yaswebapi.services;

import org.springframework.stereotype.Service;
import sg.edu.singaporetech.yaswebapi.dto.BayDTO;
import sg.edu.singaporetech.yaswebapi.dto.ClassroomDTO;
import sg.edu.singaporetech.yaswebapi.dto.ItemDTO;
import sg.edu.singaporetech.yaswebapi.dto.TrayDTO;
import sg.edu.singaporetech.yaswebapi.entities.Classroom;
import sg.edu.singaporetech.yaswebapi.entities.Tray;
import sg.edu.singaporetech.yaswebapi.repositories.ClassroomRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClassroomLogisticService {

    private final ClassroomRepository classroomRepository;

    public ClassroomLogisticService(ClassroomRepository classroomRepository) {
        this.classroomRepository = classroomRepository;
    }

    public List<ClassroomDTO> getAllClassrooms() {
        List<Classroom> classrooms = classroomRepository.findAll();
        return classrooms.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private ClassroomDTO mapToDTO(Classroom classroom) {
        List<BayDTO> bayDTOs = classroom.getBays().stream()
                .map(bay -> new BayDTO(bay.getId(), bay.getTray() != null ? mapToDTO(bay.getTray()) : null))
                .collect(Collectors.toList());

        List<TrayDTO> trayDTOs = classroom.getTrays().stream()
                .map(this::mapToDTO)
                .toList();

        return new ClassroomDTO(classroom.getId(), classroom.getName(), classroom.getStatus().toString(), bayDTOs, trayDTOs);
    }

    private TrayDTO mapToDTO(Tray tray) {
        List<ItemDTO> itemDTOs = tray.getItems().stream()
                .map(item -> new ItemDTO(item.getId(), item.getName()))
                .collect(Collectors.toList());

        Long bayID = tray.getBay() != null ? tray.getBay().getId() : null;
        Classroom classroom = tray.getClassroom();
        return new TrayDTO(tray.getId(), itemDTOs, classroom.getId(), classroom.getName(), bayID);
    }
}