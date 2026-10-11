package com.nit.credit_ledger.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.nit.credit_ledger.dto.CustomerSummary;
import com.nit.credit_ledger.entity.Customer;
import com.nit.credit_ledger.entity.Transaction;
import com.nit.credit_ledger.entity.TransactionType;
import com.nit.credit_ledger.repository.TransactionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final CustomerService customerService;

    public Transaction addTransaction(Long customerId, Transaction transaction) {
        if (transaction.getAmount() == null
                || transaction.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Amount must be greater than 0");
        }
        if (transaction.getType() == null) {
            throw new RuntimeException("Type must be CREDIT or PAYMENT");
        }
        Customer customer = customerService.getCustomerById(customerId);
        transaction.setCustomer(customer);
        return transactionRepository.save(transaction);
    }

    public List<Transaction> getTransactionsByCustomer(Long customerId) {
        customerService.getCustomerById(customerId);
        return transactionRepository.findByCustomerId(customerId);
    }

    public BigDecimal getPendingAmount(Long customerId) {
        List<Transaction> list = getTransactionsByCustomer(customerId);
        BigDecimal pending = BigDecimal.ZERO;

        for (Transaction t : list) {
            if (t.getType() == TransactionType.CREDIT) {
                pending = pending.add(t.getAmount());
            } else {
                pending = pending.subtract(t.getAmount());
            }
        }
        return pending;
    }

        public List<CustomerSummary> getCustomerSummaries() {
        List<CustomerSummary> result = new ArrayList<>();

        for (Customer c : customerService.getAllCustomers()) {
            BigDecimal pending = getPendingAmount(c.getId());
            result.add(new CustomerSummary(
                    c.getId(), c.getName(), c.getMobile(), c.getLocation(), pending));
        }
        return result;
    }
}