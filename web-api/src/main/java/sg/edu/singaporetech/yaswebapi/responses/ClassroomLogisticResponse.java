package sg.edu.singaporetech.yaswebapi.responses;

import lombok.Getter;
import lombok.Setter;
import sg.edu.singaporetech.yaswebapi.dto.ClassroomDTO;

import java.util.List;

@Getter
@Setter
public class ClassroomLogisticResponse extends AppApiResponse {

    private List<ClassroomDTO> classrooms;

    public ClassroomLogisticResponse(Boolean isSuccess, List<ClassroomDTO> classrooms) {
        super(isSuccess);
        this.classrooms = classrooms;
    }
}
