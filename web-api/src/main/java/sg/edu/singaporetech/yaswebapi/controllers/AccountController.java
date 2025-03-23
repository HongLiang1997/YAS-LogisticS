package sg.edu.singaporetech.yaswebapi.controllers;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import sg.edu.singaporetech.yaswebapi.models.AccountLoginModel;

public class AccountController {

    @RestController
    @RequestMapping("/api/account")
    public class MyRestController {

        @PostMapping("/login")
        public String login(@RequestBody AccountLoginModel accountLoginModel) {
            return "Hello, World!";
        }
    }
}
