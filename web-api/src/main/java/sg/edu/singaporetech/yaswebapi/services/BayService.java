package sg.edu.singaporetech.yaswebapi.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sg.edu.singaporetech.yaswebapi.entities.Bay;
import sg.edu.singaporetech.yaswebapi.entities.Item;
import sg.edu.singaporetech.yaswebapi.entities.LoanLog;
import sg.edu.singaporetech.yaswebapi.entities.Tray;
import sg.edu.singaporetech.yaswebapi.enums.ClassroomStatus;
import sg.edu.singaporetech.yaswebapi.enums.TrayStatus;
import sg.edu.singaporetech.yaswebapi.repositories.BayRepository;
import sg.edu.singaporetech.yaswebapi.repositories.LoanLogRepository;
import sg.edu.singaporetech.yaswebapi.repositories.TrayRepository;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class BayService {
    private static final Logger logger = LoggerFactory.getLogger(BayService.class);

    private final TrayRepository trayRepository;
    private final BayRepository bayRepository;
    private final LoanLogRepository loanLogRepository;

    public BayService(TrayRepository trayRepository, BayRepository bayRepository, LoanLogRepository loanLogRepository) {
        this.trayRepository = trayRepository;
        this.bayRepository = bayRepository;
        this.loanLogRepository = loanLogRepository;
    }

    @Transactional
    public boolean takeTrayOut(Long bayID) {
        Bay bay = bayRepository.findById(bayID).orElse(null);
        if (bay == null) {
            logger.warn("Attempted to loan tray from bay {}, but bay does not exists!", bayID);
            return false;
        }

        if (bay.getTray() == null) {
            logger.warn("Attempted to loan tray from bay {}, but no tray found.", bayID);
            return false;
        }

        // NOTE: Just a warn system if classroom is closed but tray is taken
        if (bay.getClassroom().getStatus() == ClassroomStatus.CLOSED) {
            logger.warn("Tray was taken from bay {} at classroom {}, but classroom is closed!", bayID, bay.getClassroom().getId());
        }

        Tray targetTray = bay.getTray();

        bay.setTray(null);
        bayRepository.save(bay);

        logger.debug("Tray {} set to loaned.", targetTray.getId());
        targetTray.setStatus(TrayStatus.LOANED);
        targetTray.setBay(null);
        trayRepository.save(targetTray);
        return true;
    }

    @Transactional
    public boolean returnTray(Long bayID, List<String> detectedItems) {
        Bay bay = bayRepository.findById(bayID).orElse(null);
        if (bay == null) {
            logger.warn("Attempted to return tray at bay {}, but bay does not exists!", bayID);
            return false;
        }

        if (bay.getTray() != null) {
            logger.warn("Attempted to return tray at bay {}, but bay already has a tray!", bayID);
            return false;
        }

        Optional<Tray> result = findMatchingLoanedTray(detectedItems);
        if (result.isEmpty()) {
            logger.warn("Attempted to return tray at bay {} with items of {}, but no matching tray found.", bayID, detectedItems);
            return false;
        }

        Tray tray = result.get();
        tray.setStatus(TrayStatus.IN_BAY);
        tray.setBay(bay);
        trayRepository.save(tray);

        insertLoanLog(bay, tray);
        return true;
    }

    private void insertLoanLog(Bay bay, Tray tray) {
        LoanLog loanLog = new LoanLog();
        loanLog.setClassroomName(bay.getClassroom().getName());
        loanLog.setItemNames(tray.getItems().stream().map(Item::getName).toList());

        loanLogRepository.save(loanLog);
    }

    private Optional<Tray> findMatchingLoanedTray(List<String> detectedItems) {
        List<Tray> loanedTrays = trayRepository.findByStatus(TrayStatus.LOANED);

        for (Tray tray : loanedTrays) {
            Set<String> trayItemNames = tray.getItems().stream()
                    .map(Item::getName)
                    .collect(Collectors.toSet());

            if (trayItemNames.size() == detectedItems.size() && trayItemNames.containsAll(detectedItems)) {
                return Optional.of(tray);
            }
        }

        return Optional.empty();
    }
}
