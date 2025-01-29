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

---

## Item Detection Model
### Description
This code trains a **Convolutional Neural Network (CNN)** to detect different rental items, specifically `raspberrypi4` and `raspberrypi4charger`. The model is trained using TensorFlow and Keras on a dataset of categorized images. 

### How It Works
1. **Data Preprocessing**
   - Loads training and validation images from directories.
   - Applies data augmentation (rotation, shifting, flipping) to improve generalization.
   - Rescales images to a normalized pixel range of `[0,1]`.

2. **Model Architecture**
   - Three convolutional layers extract important features.
   - Each layer is followed by max pooling to reduce dimensionality.
   - The extracted features are flattened and passed through a fully connected layer.
   - Dropout is used to prevent overfitting.
   - The final softmax layer outputs predictions for two classes (`raspberrypi4`, `raspberrypi4charger`).

3. **Training Process**
   - The model is compiled using Adam optimizer and categorical cross-entropy loss.
   - It is trained over `50 epochs` using the prepared training and validation datasets.
   - The trained model is saved as `item_detection_model.h5`.

### Simple Flow
```
Load dataset -> Apply preprocessing -> Build CNN model -> Train model -> Save trained model
```
