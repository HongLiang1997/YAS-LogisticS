package sg.edu.singaporetech.yaswebapi.controllers;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sg.edu.singaporetech.yaswebapi.dto.ClassroomDTO;
import sg.edu.singaporetech.yaswebapi.dto.LoanLogDTO;
import sg.edu.singaporetech.yaswebapi.enums.ClassroomStatus;
import sg.edu.singaporetech.yaswebapi.models.CreateClassroomModel;
import sg.edu.singaporetech.yaswebapi.models.CreateTrayModel;
import sg.edu.singaporetech.yaswebapi.models.EditClassroomModel;
import sg.edu.singaporetech.yaswebapi.models.EditTrayModel;
import sg.edu.singaporetech.yaswebapi.responses.ClassroomLogisticResponse;
import sg.edu.singaporetech.yaswebapi.services.*;

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
    private final StatisticService statisticService;

    public AdminController(AuthenticationService authenticationService,
                           ClassroomLogisticService classroomLogisticService,
                           EditTrayService editTrayService,
                           EditClassroomService editClassroomService,
                           StatisticService statisticService
    ) {
        this.authenticationService = authenticationService;
        this.classroomLogisticService = classroomLogisticService;
        this.editTrayService = editTrayService;
        this.editClassroomService = editClassroomService;
        this.statisticService = statisticService;
    }

    @GetMapping("/classroom")
    public ResponseEntity<ClassroomLogisticResponse> getClassroomLogistics(@RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader) {
        if (!isValidAuthHeader(authorizationHeader)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        List<ClassroomDTO> classroomsData = classroomLogisticService.getAllClassrooms();

        return ResponseEntity.ok(new ClassroomLogisticResponse(true, classroomsData));
    }

    @PutMapping("/edit/tray")
    public ResponseEntity<Boolean> editTray(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader,
            @RequestBody EditTrayModel editTrayModel
    ) {
        if (!isValidAuthHeader(authorizationHeader)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        if (editTrayModel.getItemNames().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(false);
        }

        return ResponseEntity.ok(editTrayService.updateTray(editTrayModel.getId(), editTrayModel.getItemNames()));
    }

    @PutMapping("/edit/classroom")
    public ResponseEntity<Boolean> editClassroom(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader,
            @RequestBody EditClassroomModel editClassroomModel
    ) {
        if (!isValidAuthHeader(authorizationHeader)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
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
        if (!isValidAuthHeader(authorizationHeader)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        editClassroomService.deleteClassroom(classroomID);
        return ResponseEntity.ok(true);
    }

    @DeleteMapping("/tray/{trayID}")
    public ResponseEntity<Boolean> deleteTray(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader,
            @PathVariable Long trayID
    ) {
        if (!isValidAuthHeader(authorizationHeader)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        return ResponseEntity.ok(editTrayService.deleteTray(trayID));
    }

    @PostMapping("/tray/create")
    public ResponseEntity<Long> createTray(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader,
            @RequestBody CreateTrayModel createTrayModel
    ) {
        if (!isValidAuthHeader(authorizationHeader)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        Optional<Long> result = editTrayService.createTray(createTrayModel.getClassroomID());
        return result
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null));
    }

    @PostMapping("/classroom/create")
    public ResponseEntity<Long> createClassroom(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader,
            @RequestBody CreateClassroomModel createClassroomModel
    ) {
        if (!isValidAuthHeader(authorizationHeader)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        Long newClassroomID = editClassroomService.createClassroom(createClassroomModel.getName());
        return ResponseEntity.ok(newClassroomID);
    }

    @GetMapping("/statistics")
    public ResponseEntity<List<LoanLogDTO>> getLoanLogs(@RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader) {
        if (!isValidAuthHeader(authorizationHeader)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        List<LoanLogDTO> loanLogs = statisticService.getLatestLoanLogs(100);
        return ResponseEntity.ok(loanLogs);
    }

    @GetMapping("/classroom/statistics/{classroomName}")
    public ResponseEntity<List<LoanLogDTO>> getLoanLogsByClassroom(@RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader, @PathVariable String classroomName) {
        if (!isValidAuthHeader(authorizationHeader)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        List<LoanLogDTO> loanLogs = statisticService.getLatestLoanLogsByClassroom(classroomName, 100);
        return ResponseEntity.ok(loanLogs);
    }


    private Boolean isValidAuthHeader(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return false;
        }

        String token = authorizationHeader.substring(7);
        return authenticationService.isValidSession(UUID.fromString(token));
    }
}
