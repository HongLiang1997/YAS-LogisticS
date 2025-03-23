package sg.edu.singaporetech.yaswebapi.responses;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AccountLoginResponse extends AppApiResponse {
    private String token = null;

    public AccountLoginResponse(Boolean isSuccess, String token) {
        super(isSuccess);
        this.token = token;
    }
}
