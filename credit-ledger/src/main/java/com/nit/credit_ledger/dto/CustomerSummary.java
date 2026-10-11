package com.nit.credit_ledger.dto;

import java.math.BigDecimal;

import com.nit.credit_ledger.dto.CustomerSummary;

public record CustomerSummary(
        Long id,
        String name,
        String mobile,
        String location,
        BigDecimal pendingAmount) {  
}

