package com.nit.credit_ledger.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.nit.credit_ledger.entity.Customer;
import com.nit.credit_ledger.exception.ResourceNotFoundException;
import com.nit.credit_ledger.repository.CustomerRepository;
import com.nit.credit_ledger.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final TransactionRepository transactionRepository;

    private final CustomerRepository customerRepository;

    public Customer addCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    public Customer getCustomerById(Long id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));
    }

        public Customer updateCustomer(Long id, Customer newData) {
        Customer existing = getCustomerById(id);
        existing.setName(newData.getName());
        existing.setMobile(newData.getMobile());
        existing.setLocation(newData.getLocation());
        return customerRepository.save(existing);
    }

       public void deleteCustomer(Long id) {
            getCustomerById(id);
            if (!transactionRepository.findByCustomerId(id).isEmpty()) {
                throw new RuntimeException("Cannot delete a customer who has transactions");
            }
            customerRepository.deleteById(id);
        }
}