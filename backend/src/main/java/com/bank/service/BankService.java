package com.bank.service;

import com.bank.model.BankAccount;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import java.io.*;
import java.util.ArrayList;
import java.util.List;

@Service
public class BankService {
    private static final String FILE_NAME = "BankDatabase.xlsx";
    private final List<BankAccount> accountsList = new ArrayList<>();
    private static final double ANNUAL_INTEREST_RATE = 0.045;

    @PostConstruct
    public void init() {
        loadAccountsFromExcel();
    }

    @PreDestroy
    public void shutdown() {
        saveAccountsToExcel();
    }

    public List<BankAccount> getAllAccounts() {
        return accountsList;
    }

    public BankAccount findAccount(String accNum) {
        return accountsList.stream()
                .filter(acc -> acc.getAccountNumber().equalsIgnoreCase(accNum))
                .findFirst()
                .orElse(null);
    }

    public BankAccount createAccount(BankAccount account) {
        if (findAccount(account.getAccountNumber()) != null) return null;
        BankAccount newAccount = new BankAccount(account.getCustomerName(), account.getAccountNumber(), account.getBalance(), account.getPin());
        accountsList.add(newAccount);
        saveAccountsToExcel();
        return newAccount;
    }

    public boolean deposit(String accNum, double amount) {
        BankAccount acc = findAccount(accNum);
        if (acc != null && amount > 0) {
            acc.setBalance(acc.getBalance() + amount);
            acc.logTransaction("Deposited: $" + amount);
            saveAccountsToExcel();
            return true;
        }
        return false;
    }

    public boolean withdraw(String accNum, double amount) {
        BankAccount acc = findAccount(accNum);
        if (acc != null && amount > 0 && acc.getBalance() >= amount) {
            acc.setBalance(acc.getBalance() - amount);
            acc.logTransaction("Withdrew: $" + amount);
            saveAccountsToExcel();
            return true;
        }
        return false;
    }

    public void applyMassInterest() {
        for (BankAccount acc : accountsList) {
            double interest = (acc.getBalance() * ANNUAL_INTEREST_RATE) / 12;
            acc.setBalance(acc.getBalance() + interest);
            acc.logTransaction(String.format("Interest earned: $%.2f", interest));
        }
        saveAccountsToExcel();
    }

    public synchronized void loadAccountsFromExcel() {
        File file = new File(FILE_NAME);
        if (!file.exists()) {
            accountsList.add(new BankAccount("John Doe", "12345", 1000.0, 1111));
            return;
        }
        try (FileInputStream fileIn = new FileInputStream(file);
             Workbook workbook = new XSSFWorkbook(fileIn)) {
            Sheet sheet = workbook.getSheet("Accounts");
            if (sheet == null) return;
            accountsList.clear();
            boolean isHeader = true;
            for (Row row : sheet) {
                if (isHeader) { isHeader = false; continue; }
                String accNum = row.getCell(0).getStringCellValue();
                String name = row.getCell(1).getStringCellValue();
                double balance = row.getCell(2).getNumericCellValue();
                int pin = (int) row.getCell(3).getNumericCellValue();
                accountsList.add(new BankAccount(name, accNum, balance, pin));
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public synchronized void saveAccountsToExcel() {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Accounts");
            Row headerRow = sheet.createRow(0);
            headerRow.createCell(0).setCellValue("Account Number");
            headerRow.createCell(1).setCellValue("Account Holder");
            headerRow.createCell(2).setCellValue("Balance");
            headerRow.createCell(3).setCellValue("PIN");

            int rowIdx = 1;
            for (BankAccount acc : accountsList) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(acc.getAccountNumber());
                row.createCell(1).setCellValue(acc.getCustomerName());
                row.createCell(2).setCellValue(acc.getBalance());
                row.createCell(3).setCellValue(acc.getPin());
            }
            try (FileOutputStream fileOut = new FileOutputStream(FILE_NAME)) {
                workbook.write(fileOut);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}