package com.example.demo.DTO;

import com.example.demo.Validation.UserValidationResult;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;


public class UserImportResponse {

    private List<String> savedUsers = new ArrayList<>();
    private List<UserValidationResult> failedUsers = new ArrayList<>();

    public UserImportResponse() {

    }

    public UserImportResponse(List<String> savedUsers, List<UserValidationResult> failedUsers) {
        this.savedUsers = savedUsers;
        this.failedUsers = failedUsers;
    }

    public List<String> getSavedUsers() {
        return savedUsers;
    }

    public void setSavedUsers(List<String> savedUsers) {
        this.savedUsers = savedUsers;
    }

    public List<UserValidationResult> getFailedUsers() {
        return failedUsers;
    }

    public void setFailedUsers(List<UserValidationResult> failedUsers) {
        this.failedUsers = failedUsers;
    }


}
