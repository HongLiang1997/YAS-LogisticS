package sg.edu.singaporetech.yaswebapi.models;

import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;

@Getter
@Setter
public class AccountLoginModel {
    @NonNull
    private String username;

    @NonNull
    private String password;
}
