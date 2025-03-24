package sg.edu.singaporetech.yaswebapi.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import sg.edu.singaporetech.yaswebapi.models.AccountLoginModel;
import sg.edu.singaporetech.yaswebapi.responses.AccountLoginResponse;
import sg.edu.singaporetech.yaswebapi.services.AuthenticationService;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/account")
public class AccountController {

    private final AuthenticationService authenticationService;

    public AccountController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    @PostMapping("/login")
    public ResponseEntity<AccountLoginResponse> login(@RequestBody AccountLoginModel accountLoginModel) {
        Optional<UUID> authResult = authenticationService.authenticate(accountLoginModel.getUsername(), accountLoginModel.getPassword());
        AccountLoginResponse response = authResult
                .map(uuid -> new AccountLoginResponse(true, uuid.toString()))
                .orElseGet(() -> new AccountLoginResponse(false, null));

        return authResult
                .map(_ -> ResponseEntity.ok(response))
                .orElse(ResponseEntity.status(401).body(response));
    }
}
