package sg.edu.singaporetech.yaswebapi.models;

import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ReturnTrayModel {
    @NonNull
    private Long bayID;
    @NonNull
    private List<String> itemNames;
}
