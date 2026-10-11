package com.nit.credit_ledger.entity;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "ledger_transactions")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "transaction_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @Column(name = "transaction_date")
    private LocalDate date = LocalDate.now();

    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    private TransactionType type;

    private String note;
}