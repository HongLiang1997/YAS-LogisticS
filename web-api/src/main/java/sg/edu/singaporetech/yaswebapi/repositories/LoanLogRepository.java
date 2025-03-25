package sg.edu.singaporetech.yaswebapi.repositories;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import sg.edu.singaporetech.yaswebapi.entities.LoanLog;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface LoanLogRepository extends JpaRepository<LoanLog, Long> {
    @Query("SELECT ll FROM LoanLog ll ORDER BY ll.loanDate DESC")
    List<LoanLog> findLatestLoanLogs(Pageable pageable);

    @Query("SELECT ll FROM LoanLog ll WHERE ll.classroomName = :classroomName ORDER BY ll.loanDate DESC")
    List<LoanLog> findLatestLoanLogsByClassroom(@Param("classroomName") String classroomName, Pageable pageable);
}
