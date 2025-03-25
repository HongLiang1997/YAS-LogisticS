package sg.edu.singaporetech.yaswebapi.models;

import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;

@Getter
@Setter
public class EditClassroomModel {
    @NonNull
    private Long id;

    @NonNull
    private String name;

    @NonNull
    private String status;
}
