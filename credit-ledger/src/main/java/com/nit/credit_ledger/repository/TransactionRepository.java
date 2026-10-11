package com.nit.credit_ledger.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nit.credit_ledger.entity.Transaction;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByCustomerId(Long customerId);
}