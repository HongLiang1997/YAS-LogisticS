package sg.edu.singaporetech.yaswebapi.services;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import sg.edu.singaporetech.yaswebapi.dto.LoanLogDTO;
import sg.edu.singaporetech.yaswebapi.entities.LoanLog;
import sg.edu.singaporetech.yaswebapi.repositories.LoanLogRepository;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class StatisticService {
    private final LoanLogRepository loanLogRepository;

    public StatisticService(LoanLogRepository loanLogRepository) {
        this.loanLogRepository = loanLogRepository;
    }

    public List<LoanLogDTO> getLatestLoanLogs(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        List<LoanLog> loanLogs = loanLogRepository.findLatestLoanLogs(pageable);
        return mapToDTOs(loanLogs);
    }

    public List<LoanLogDTO> getLatestLoanLogsByClassroom(String classroomName, int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        List<LoanLog> loanLogs = loanLogRepository.findLatestLoanLogsByClassroom(classroomName, pageable);
        return mapToDTOs(loanLogs);
    }

    private List<LoanLogDTO> mapToDTOs(List<LoanLog> loanLogs) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        return loanLogs.stream()
                .map(loanLog -> new LoanLogDTO(
                        loanLog.getClassroomName(),
                        loanLog.getItemNames(),
                        loanLog.getLoanDate().format(formatter)
                ))
                .collect(Collectors.toList());
    }
}
