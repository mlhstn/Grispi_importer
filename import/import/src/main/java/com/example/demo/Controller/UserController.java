package com.example.demo.Controller;

import com.example.demo.DTO.UserImportResponse;
import com.example.demo.Entity.User;
import com.example.demo.Service.UserService;
import com.example.demo.Validation.UserValidationResult;
import com.example.demo.Validation.UserValidator;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserValidator userValidator;
    private final UserService userService;


    public UserController(UserValidator userValidator, UserService userService) {
        this.userValidator = userValidator;
        this.userService = userService;
    }

    @PostMapping("/validate")
    public ResponseEntity<UserValidationResult> validateUser(@RequestBody User user) {
        UserValidationResult result = userValidator.validate(user);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/import")
    public ResponseEntity<UserImportResponse> importUsers(@RequestBody List<User> users) {
        UserImportResponse response = new UserImportResponse();

        for (User user : users) {
            UserValidationResult validationResult = userValidator.validate(user);

            if (validationResult.isValid()) {
                userService.saveUser(user); // Geçerli kullanıcıyı kaydet
                response.getSavedUsers().add(user.getExternalId());
            } else {
                // Hatalı kullanıcı için kimliğini setle
                validationResult.setUserIdentifier(user.getExternalId());

                // Hatalı kullanıcıyı ekle
                response.getFailedUsers().add(validationResult);
            }
        }

        return ResponseEntity.ok(response);
    }

}
