package sg.edu.singaporetech.yaswebapi.dto;

import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ClassroomDTO {
    @NonNull
    private Long id;
    @NonNull
    private String name;
    @NonNull
    private String status;
    @NonNull
    private List<BayDTO> bays;
    @NonNull
    private List<TrayDTO> trays;

    public ClassroomDTO(
            @NonNull Long id,
            @NonNull String name,
            @NonNull String status,
            @NonNull List<BayDTO> bays,
            @NonNull List<TrayDTO> trays
    ) {
        this.id = id;
        this.name = name;
        this.status = status;
        this.bays = bays;
        this.trays = trays;
    }
}
