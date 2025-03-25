package sg.edu.singaporetech.yaswebapi.controllers;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sg.edu.singaporetech.yaswebapi.dto.ClassroomDTO;
import sg.edu.singaporetech.yaswebapi.enums.ClassroomStatus;
import sg.edu.singaporetech.yaswebapi.models.EditClassroomModel;
import sg.edu.singaporetech.yaswebapi.models.EditTrayModel;
import sg.edu.singaporetech.yaswebapi.responses.ClassroomLogisticResponse;
import sg.edu.singaporetech.yaswebapi.services.AuthenticationService;
import sg.edu.singaporetech.yaswebapi.services.ClassroomLogisticService;
import sg.edu.singaporetech.yaswebapi.services.EditClassroomService;
import sg.edu.singaporetech.yaswebapi.services.EditTrayService;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AuthenticationService authenticationService;
    private final ClassroomLogisticService classroomLogisticService;
    private final EditTrayService editTrayService;
    private final EditClassroomService editClassroomService;

    public AdminController(AuthenticationService authenticationService,
                           ClassroomLogisticService classroomLogisticService,
                           EditTrayService editTrayService,
                           EditClassroomService editClassroomService
    ) {
        this.authenticationService = authenticationService;
        this.classroomLogisticService = classroomLogisticService;
        this.editTrayService = editTrayService;
        this.editClassroomService = editClassroomService;
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

    @PostMapping("/edit/tray")
    public ResponseEntity<Boolean> editTray(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader,
            @RequestBody EditTrayModel editTrayModel
    ) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(false);
        }

        String token = authorizationHeader.substring(7);
        if (!authenticationService.isValidSession(UUID.fromString(token))) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(false);
        }

        if (editTrayModel.getItemNames().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(false);
        }

        return ResponseEntity.ok(editTrayService.updateTray(editTrayModel.getId(), editTrayModel.getItemNames()));
    }

    @PostMapping("/edit/classroom")
    public ResponseEntity<Boolean> editClassroom(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader,
            @RequestBody EditClassroomModel editClassroomModel
    ) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(false);
        }

        String token = authorizationHeader.substring(7);
        if (!authenticationService.isValidSession(UUID.fromString(token))) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(false);
        }

        if (editClassroomModel.getName().isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(false);
        }

        ClassroomStatus classroomStatus;
        try {
            classroomStatus = ClassroomStatus.valueOf(editClassroomModel.getStatus());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(false);
        }

        return ResponseEntity.ok(editClassroomService.updateClassroom(editClassroomModel.getId(), editClassroomModel.getName(), classroomStatus));
    }

    @DeleteMapping("/classroom/{classroomID}")
    public ResponseEntity<Boolean> deleteClassroom(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader,
            @PathVariable Long classroomID
    ) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(false);
        }

        String token = authorizationHeader.substring(7);
        if (!authenticationService.isValidSession(UUID.fromString(token))) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(false);
        }

        editClassroomService.deleteClassroom(classroomID);
        return ResponseEntity.ok(true);
    }

    @DeleteMapping("/tray/{trayID}")
    public ResponseEntity<Boolean> deleteTray(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader,
            @PathVariable Long trayID
    ) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(false);
        }

        String token = authorizationHeader.substring(7);
        if (!authenticationService.isValidSession(UUID.fromString(token))) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(false);
        }

        return ResponseEntity.ok(editTrayService.deleteTray(trayID));
    }

    @PostMapping("/tray/create")
    public ResponseEntity<Long> createTray(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader,
            @RequestBody Long classroomID
    ) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        String token = authorizationHeader.substring(7);
        if (!authenticationService.isValidSession(UUID.fromString(token))) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        Optional<Long> result = editTrayService.createTray(classroomID);
        return result
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null));
    }

    @PostMapping("/classroom/create")
    public ResponseEntity<Long> createClassroom(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader,
            @RequestBody String classroomName
    ) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        String token = authorizationHeader.substring(7);
        if (!authenticationService.isValidSession(UUID.fromString(token))) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        Long newClassroomID = editClassroomService.createClassroom(classroomName);
        return ResponseEntity.ok(newClassroomID);
    }
}
