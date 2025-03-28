package sg.edu.singaporetech.yaswebapi.services;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;
import sg.edu.singaporetech.yaswebapi.entities.Bay;
import sg.edu.singaporetech.yaswebapi.entities.Classroom;
import sg.edu.singaporetech.yaswebapi.entities.Item;
import sg.edu.singaporetech.yaswebapi.entities.Tray;
import sg.edu.singaporetech.yaswebapi.enums.TrayStatus;
import sg.edu.singaporetech.yaswebapi.repositories.BayRepository;
import sg.edu.singaporetech.yaswebapi.repositories.ClassroomRepository;
import sg.edu.singaporetech.yaswebapi.repositories.TrayRepository;

import java.util.List;
import java.util.Optional;

@Service
public class EditTrayService {
    private final TrayRepository trayRepository;
    private final ClassroomRepository classroomRepository;
    private final BayRepository bayRepository;

    public EditTrayService(
            TrayRepository trayRepository,
            ClassroomRepository classroomRepository,
            BayRepository bayRepository
    ) {
        this.trayRepository = trayRepository;
        this.classroomRepository = classroomRepository;
        this.bayRepository = bayRepository;
    }

    @Transactional
    public Boolean updateTray(Long trayID, List<String> itemNames) {
        Optional<Tray> result = trayRepository.findById(trayID);
        if (result.isEmpty()) {
            return false;
        }

        Tray tray = result.get();
        if (tray.getStatus() != TrayStatus.IN_BAY) {
            return false;
        }

        tray.getItems().clear();
        tray.getItems().addAll(itemNames.stream().map(itemName -> {
            Item newItem = new Item();
            newItem.setName(itemName);
            newItem.setTray(tray);
            return newItem;
        }).toList());
        trayRepository.save(tray);
        return true;
    }

    @Transactional
    public Optional<Long> createTray(Long classroomID) {
        Optional<Classroom> result = classroomRepository.findById(classroomID);
        if (result.isEmpty()) {
            return Optional.empty();
        }

        Classroom classroom = result.get();

        Bay bay = new Bay();
        bay.setClassroom(classroom);
        classroom.getBays().add(bay);

        Tray tray = new Tray();
        tray.setBay(bay);
        tray.setStatus(TrayStatus.IN_BAY);
        tray.setClassroom(classroom);
        bay.setTray(tray);

        Tray savedTray = trayRepository.save(tray);
        return Optional.of(savedTray.getId());
    }

    @Transactional
    public Boolean deleteTray(Long trayID) {
        Optional<Tray> result = trayRepository.findById(trayID);
        if (result.isEmpty()) {
            return false;
        }

        Tray tray = result.get();
        if (tray.getStatus() != TrayStatus.IN_BAY || tray.getBay() == null) {
            return false;
        }

        Bay bay = tray.getBay();
        bayRepository.delete(bay);
        trayRepository.delete(tray);
        return true;
    }
}
