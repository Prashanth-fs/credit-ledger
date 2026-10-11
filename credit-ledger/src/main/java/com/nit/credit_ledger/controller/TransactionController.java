package com.nit.credit_ledger.controller;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nit.credit_ledger.entity.Transaction;
import com.nit.credit_ledger.service.TransactionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/customers/{customerId}")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping("/transactions")
    public Transaction addTransaction(@PathVariable Long customerId,
                                      @RequestBody Transaction transaction) {
        return transactionService.addTransaction(customerId, transaction);
    }

    @GetMapping("/transactions")
    public List<Transaction> getTransactions(@PathVariable Long customerId) {
        return transactionService.getTransactionsByCustomer(customerId);
    }

    @GetMapping("/pending")
    public BigDecimal getPendingAmount(@PathVariable Long customerId) {
        return transactionService.getPendingAmount(customerId);
    }
}