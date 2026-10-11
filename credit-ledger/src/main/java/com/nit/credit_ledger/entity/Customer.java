package com.nit.credit_ledger.entity;

import java.time.LocalDate;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import jakarta.validation.constraints.Pattern;

@Data
@Entity
@Table(name = "customers")
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "customer_id")
    private Long id;

    @NotBlank(message = "Name is required")
    @Column(name = "customer_name", nullable = false)
    private String name;

    @Pattern(regexp = "\\d{10}", message = "Mobile must be exactly 10 digits")
    private String mobile;

    private String location;

    @Column(name = "create_date")
    private LocalDate createDate = LocalDate.now();
}