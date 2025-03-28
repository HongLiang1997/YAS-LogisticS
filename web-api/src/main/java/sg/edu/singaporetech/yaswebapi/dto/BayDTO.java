package sg.edu.singaporetech.yaswebapi.dto;

import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;

@Getter
@Setter
public class BayDTO {
    @NonNull
    private Long id;
    private TrayDTO tray;

    public BayDTO(
            @NonNull Long id,
            TrayDTO tray
    ) {
        this.id = id;
        this.tray = tray;
    }
}
