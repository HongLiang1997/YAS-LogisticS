package sg.edu.singaporetech.yaswebapi.services;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;
import sg.edu.singaporetech.yaswebapi.entities.Item;
import sg.edu.singaporetech.yaswebapi.entities.Tray;
import sg.edu.singaporetech.yaswebapi.repositories.TrayRepository;

import java.util.List;
import java.util.Optional;

@Service
public class EditTrayService {
    private final TrayRepository trayRepository;

    public EditTrayService(TrayRepository trayRepository) {
        this.trayRepository = trayRepository;
    }

    @Transactional
    public Boolean updateTray(Long trayID, List<String> itemNames) {
        Optional<Tray> result = trayRepository.findById(trayID);
        if (result.isEmpty()) {
            return false;
        }

        Tray tray = result.get();
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
}
