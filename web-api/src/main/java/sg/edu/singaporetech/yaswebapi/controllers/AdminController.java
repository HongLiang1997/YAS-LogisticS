package sg.edu.singaporetech.yaswebapi.controllers;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sg.edu.singaporetech.yaswebapi.dto.ClassroomDTO;
import sg.edu.singaporetech.yaswebapi.models.AccountLoginModel;
import sg.edu.singaporetech.yaswebapi.responses.AccountLoginResponse;
import sg.edu.singaporetech.yaswebapi.responses.ClassroomLogisticResponse;
import sg.edu.singaporetech.yaswebapi.services.AuthenticationService;
import sg.edu.singaporetech.yaswebapi.services.ClassroomLogisticService;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AuthenticationService authenticationService;
    private final ClassroomLogisticService classroomLogisticService;

    public AdminController(AuthenticationService authenticationService, ClassroomLogisticService classroomLogisticService) {
        this.authenticationService = authenticationService;
        this.classroomLogisticService = classroomLogisticService;
    }

    @GetMapping("/classroom")
    public ResponseEntity<ClassroomLogisticResponse> getClassroomLogistics(@RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ClassroomLogisticResponse(false, null));
        }

        String token = authorizationHeader.substring(7);
        if (!authenticationService.isValidSession(UUID.fromString(token))) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ClassroomLogisticResponse(false, null));
        }

        List<ClassroomDTO> classroomsData = classroomLogisticService.getAllClassrooms();

        return ResponseEntity.ok(new ClassroomLogisticResponse(true, classroomsData));
    }

}
