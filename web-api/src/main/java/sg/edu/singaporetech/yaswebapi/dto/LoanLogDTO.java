package sg.edu.singaporetech.yaswebapi.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class LoanLogDTO {
    private String classroomName;
    private List<String> itemNames;
    private String loanDateString;

    public LoanLogDTO(
            String classroomName,
            List<String> itemNames,
            String loanDateString
    ) {
        this.classroomName = classroomName;
        this.itemNames = itemNames;
        this.loanDateString = loanDateString;
    }
}