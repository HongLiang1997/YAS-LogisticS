package sg.edu.singaporetech.yaswebapi.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ItemDTO {
    private String id;
    private String name;

    public ItemDTO(String id, String name) {
        this.id = id;
        this.name = name;
    }
}