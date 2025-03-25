package sg.edu.singaporetech.yaswebapi.models;

import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;

@Getter
@Setter
public class CreateClassroomModel {
    @NonNull
    private String name;
}

