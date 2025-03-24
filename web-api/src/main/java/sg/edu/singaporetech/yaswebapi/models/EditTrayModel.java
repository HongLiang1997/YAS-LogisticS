package sg.edu.singaporetech.yaswebapi.models;

import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class EditTrayModel {
    @NonNull
    private String id;

    @NonNull
    private List<String> itemNames;
}
