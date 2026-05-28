package com.bank.model;

import java.util.ArrayList;
import java.util.List;

public class BankAccount {
    private String customerName;
    private String accountNumber;
    private double balance;
    private int pin;
    private List<String> transactionHistory;

    public BankAccount() {
        this.transactionHistory = new ArrayList<>();
    }

    public BankAccount(String customerName, String accountNumber, double balance, int pin) {
        this.customerName = customerName;
        this.accountNumber = accountNumber;
        this.balance = balance;
        this.pin = pin;
        this.transactionHistory = new ArrayList<>();
        this.transactionHistory.add("Account active. Balance: $" + balance);
    }

    // Getters and Setters
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public String getAccountNumber() { return accountNumber; }
    public void setAccountNumber(String accountNumber) { this.accountNumber = accountNumber; }
    public double getBalance() { return balance; }
    public void setBalance(double balance) { this.balance = balance; }
    public int getPin() { return pin; }
    public void setPin(int pin) { this.pin = pin; }
    public List<String> getTransactionHistory() { return transactionHistory; }
    public void setTransactionHistory(List<String> transactionHistory) { this.transactionHistory = transactionHistory; }

    public void logTransaction(String detail) {
        if (this.transactionHistory.size() >= 10) {
            this.transactionHistory.remove(0);
        }
        this.transactionHistory.add(detail);
    }
}