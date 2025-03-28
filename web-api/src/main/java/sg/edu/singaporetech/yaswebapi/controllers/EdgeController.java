package sg.edu.singaporetech.yaswebapi.controllers;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sg.edu.singaporetech.yaswebapi.models.LoanTrayModel;
import sg.edu.singaporetech.yaswebapi.models.ReturnTrayModel;
import sg.edu.singaporetech.yaswebapi.services.AuthenticationService;
import sg.edu.singaporetech.yaswebapi.services.BayService;

@RestController
@RequestMapping("/api/edge")
public class EdgeController {

    private final AuthenticationService authenticationService;
    private final BayService bayService;

    public EdgeController(AuthenticationService authenticationService, BayService bayService) {
        this.authenticationService = authenticationService;
        this.bayService = bayService;
    }

    @PutMapping("/tray/return")
    public ResponseEntity<Boolean> returnTray(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader,
            @RequestBody ReturnTrayModel returnTrayModel
    ) {
        if (!isValidAuthHeader(authorizationHeader)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        boolean result = bayService.returnTray(returnTrayModel.getBayID(), returnTrayModel.getItemNames());
        return ResponseEntity.ok(result);
    }

    @PutMapping("/tray/loan")
    public ResponseEntity<Boolean> loanTray(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader,
            @RequestBody LoanTrayModel loanTrayModel
    ) {
        if (!isValidAuthHeader(authorizationHeader)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        boolean result = bayService.takeTrayOut(loanTrayModel.getId());
        return ResponseEntity.ok(result);
    }

    private Boolean isValidAuthHeader(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return false;
        }

        String token = authorizationHeader.substring(7);
        return authenticationService.isValidApiKey(token);
    }
}
