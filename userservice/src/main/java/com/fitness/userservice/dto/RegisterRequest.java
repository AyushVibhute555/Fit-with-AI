package com.fitness.userservice.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.jspecify.annotations.Nullable;

@Data
public class RegisterRequest {
    @NotBlank(message= "Email is required.")
    @Email(message = "Invalid Email Format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min=6, message="password must have at least of 6 character")
    private String password;

    private String keycloakId;

    private String firstName;
    private String lastName;


}
