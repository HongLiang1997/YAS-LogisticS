package sg.edu.singaporetech.yaswebapi.dto;


import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class TrayDTO {
    private String id;
    private List<ItemDTO> items;

    public TrayDTO(String id, List<ItemDTO> items) {
        this.id = id;
        this.items = items;
    }
}