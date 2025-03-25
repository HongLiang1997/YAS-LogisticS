package sg.edu.singaporetech.yaswebapi.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
public class LoanLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String classroomName;

    @ElementCollection
    @CollectionTable(name = "loan_items_log", joinColumns = @JoinColumn(name = "loan_log_id"))
    @Column(name = "item_name")
    private List<String> itemNames;

    @Column(name = "loaned_at", updatable = false, nullable = false)
    private LocalDateTime loanDate;

    @PrePersist
    protected void onCreate() {
        if (loanDate == null) {
            loanDate = LocalDateTime.now();
        }
    }
}
