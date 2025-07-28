package com.example.demo.Controller;

import com.example.demo.DTO.UserImportRequest;
import com.example.demo.DTO.UserImportResponse;
import com.example.demo.Entity.User;
import com.example.demo.Mapper.UserMapper;
import com.example.demo.Service.UserService;
import com.example.demo.Validation.UserValidationResult;
import com.example.demo.Validation.UserValidator;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserValidator userValidator;
    private final UserService userService;
    private final UserMapper userMapper;


    public UserController(UserValidator userValidator, UserService userService, UserMapper userMapper) {
        this.userValidator = userValidator;
        this.userService = userService;
        this.userMapper = userMapper;
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
    @PostMapping("/import-mapped")
    public ResponseEntity<UserImportResponse> importMappedUsers(@RequestBody UserImportRequest request) {
        UserImportResponse response = new UserImportResponse();

        for (Map<String, Object> row : request.getData()) {
            User user = userMapper.mapWithMapping(row, request.getColumnMappings());
            UserValidationResult validationResult = userValidator.validate(user);

            if (validationResult.isValid()) {
                userService.saveUser(user);
                response.getSavedUsers().add(user.getExternalId());
            } else {
                validationResult.setUserIdentifier(user.getExternalId());
                response.getFailedUsers().add(validationResult);
            }
        }

        return ResponseEntity.ok(response);
    }


}
