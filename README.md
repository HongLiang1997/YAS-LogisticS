# YAS-LogisticS
## Problem Statement
The process of renting equipment, such as IoT technologies like Raspberry Pi, can be cumbersome and requires significant manual intervention. The current procedure for renting a Raspberry Pi at SiT involves the following steps:

1. A staff member brings the equipment into the lab room where students are present.
2. Staff members set up laptops with Excel spreadsheets to log student credentials and the loaned equipment.
3. Students queue up to manually input their credentials and the requested equipment into the spreadsheet.
4. Staff members validate the input details and hand over the equipment.
5. Students later need to arrange a meeting with the staff member to return the loaned equipment.

### Issues with the Current Process
#### Human Error
- Students may input their credentials incorrectly.
- Staff members may incorrectly validate the input or hand over the wrong equipment.

#### Technical Error
- The Excel spreadsheet may become corrupted or lost due to technical issues, leading to a loss of tracking for loaned equipment.

#### Malicious Intent
- Students may purposely delete rows from the Excel spreadsheet or input fake credentials while a staff member is distracted.
- Students may return a defective or inferior clone of the equipment.

## Proposed Solution
To address these issues, we propose the development of an **automated equipment rental system**. This system will utilize modern technologies to streamline the rental process, reduce human error, and enhance security.

### Key Features
#### Automated Check-In/Check-Out
- Implement an on-site web-based application where students can log in using their student card (RFID) to request and return equipment.

#### Equipment Condition Verification
- Students loaning equipment will be required to take pictures of the loaned equipment before and after rental.
- Utilize machine learning to identify equipment and verify that its condition remains the same before and after loaning.

#### Real-Time Tracking
- Integrate a database to track the status of each piece of equipment in real-time, ensuring accurate inventory management.
- Provide staff with a dashboard to monitor equipment availability and rental history.

#### Error Reduction
- Automate the validation process to minimize human error in credential input and equipment allocation.
- Implement data validation checks to ensure the accuracy of student and equipment information.
