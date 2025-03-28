package sg.edu.singaporetech.yaswebapi.dto;


import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class TrayDTO {
    @NonNull
    private Long id;
    @NonNull
    private List<ItemDTO> items;
    @NonNull
    private Long classroomID;
    @NonNull
    private String classroomName;
    private Long bayID;

    public TrayDTO(
            @NonNull Long id,
            @NonNull List<ItemDTO> items,
            @NonNull Long classroomID,
            @NonNull String classroomName,
            Long bayID
    ) {
        this.id = id;
        this.items = items;
        this.classroomID = classroomID;
        this.classroomName = classroomName;
        this.bayID = bayID;
    }
}