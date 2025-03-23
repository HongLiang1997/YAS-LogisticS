package sg.edu.singaporetech.yaswebapi.responses;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public abstract class AppApiResponse {
    protected Boolean success;

    public AppApiResponse(Boolean isSuccess) {
        this.success = isSuccess;
    }
}
