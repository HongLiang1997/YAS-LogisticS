package sg.edu.singaporetech.yaswebapi.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ClassroomDTO {
    private String name;
    private String status;
    private List<BayDTO> bays;

    public ClassroomDTO(String name, String status, List<BayDTO> bays) {
        this.name = name;
        this.status = status;
        this.bays = bays;
    }
}
