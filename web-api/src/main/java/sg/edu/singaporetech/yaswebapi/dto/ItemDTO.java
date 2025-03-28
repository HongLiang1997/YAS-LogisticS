package sg.edu.singaporetech.yaswebapi.dto;

import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;

@Getter
@Setter
public class ItemDTO {
    @NonNull
    private Long id;
    @NonNull
    private String name;

    public ItemDTO(
            @NonNull Long id,
            @NonNull String name
    ) {
        this.id = id;
        this.name = name;
    }
}