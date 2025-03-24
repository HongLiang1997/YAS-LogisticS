package sg.edu.singaporetech.yaswebapi.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BayDTO {
    private String id;
    private TrayDTO tray;

    public BayDTO(String id, TrayDTO tray) {
        this.id = id;
        this.tray = tray;
    }
}
