package com.nit.credit_ledger.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nit.credit_ledger.entity.Customer;

public interface CustomerRepository extends JpaRepository<Customer, Long> {

}