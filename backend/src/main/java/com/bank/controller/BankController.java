package com.bank.controller;

import com.bank.model.BankAccount;
import com.bank.service.BankService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bank")
@CrossOrigin(origins = "*")
public class BankController {

    @Autowired
    private BankService bankService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        BankAccount acc = bankService.findAccount(credentials.get("accountNumber"));
        if (acc != null && acc.getPin() == Integer.parseInt(credentials.get("pin"))) {
            return ResponseEntity.ok(acc);
        }
        return ResponseEntity.status(401).body("Invalid credentials");
    }

    @GetMapping("/accounts")
    public List<BankAccount> getAllAccounts() {
        return bankService.getAllAccounts();
    }

    @PostMapping("/account")
    public ResponseEntity<?> createAccount(@RequestBody BankAccount account) {
        BankAccount created = bankService.createAccount(account);
        if (created != null) return ResponseEntity.ok(created);
        return ResponseEntity.badRequest().body("Account already exists.");
    }

    @PostMapping("/deposit")
    public ResponseEntity<?> deposit(@RequestBody Map<String, Object> req) {
        boolean success = bankService.deposit((String) req.get("accountNumber"), Double.parseDouble(req.get("amount").toString()));
        return success ? ResponseEntity.ok("Success") : ResponseEntity.badRequest().body("Failed");
    }

    @PostMapping("/withdraw")
    public ResponseEntity<?> withdraw(@RequestBody Map<String, Object> req) {
        boolean success = bankService.withdraw((String) req.get("accountNumber"), Double.parseDouble(req.get("amount").toString()));
        return success ? ResponseEntity.ok("Success") : ResponseEntity.badRequest().body("Insufficient funds/Error");
    }

    @PostMapping("/interest")
    public ResponseEntity<?> applyInterest() {
        bankService.applyMassInterest();
        return ResponseEntity.ok("Interest Processed");
    }
}