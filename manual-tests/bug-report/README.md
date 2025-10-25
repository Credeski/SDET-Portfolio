# Summary

This section contains manually logged bug reports for the **OrangeHRM** application.  
All bugs are documented with detailed steps, expected vs actual results, proof, and severity, and are maintained in a shared Google Sheet.

---

## Bug Reports

| Bug ID | Environment | Preconditions | Steps to Reproduce the Bug | Expected Result | Actual Result | Proof | Severity |
|--------|------------|---------------|---------------------------|----------------|---------------|-------|----------|
| B001 | Live | User logged in as Admin | 1. Navigate to the OrangeHRM login URL<br>2. Enter valid credentials (Admin/admin123)<br>3. Click Login<br>4. Click “Logout” from profile menu<br>5. Click the browser Back button | System redirects to login page; dashboard not accessible | User can still access dashboard after logout | [Loom Recording](https://www.loom.com/share/9ac36f715fde45c38397b87e2a47cbdf) | High | 
| B002 | Live | Job title assigned to employee | 1. Assign a job title to an employee<br>2. Select the assigned job title<br>3. Click Delete | Error message displayed: “Cannot delete job title assigned to employees”; record not deleted | Job title deleted without error message | [Loom Recording](https://www.loom.com/share/5c6fb6868de648daabccce5e4e31d962) | High |
| B003 | Live | User on Add Employee page | 1. Place focus in First Name field<br>2. Press Tab key through all fields | Focus moves sequentially through all input fields, including save button | Save button skipped when tabbing | [Loom Recording](https://www.loom.com/share/5f79750a50514d47b68ace24944947f3) | Low |

---

## Full Test Cases & Bug Details

For the complete set of **test cases and additional bug reports**, please refer to the [Google Sheet here](https://docs.google.com/spreadsheets/d/16JuPt0tDUb2lA9L_bB5jgedTAlfEBRJbkwSMVhMgdCs/edit?gid=271145319#gid=271145319).  

