package sg.edu.singaporetech.yaswebapi.converter;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import sg.edu.singaporetech.yaswebapi.enums.ClassroomStatus;

@Converter
public class ClassroomStatusConverter implements AttributeConverter<ClassroomStatus, String> {

    @Override
    public String convertToDatabaseColumn(ClassroomStatus attribute) {
        return attribute != null ? attribute.toString() : null;
    }

    @Override
    public ClassroomStatus convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        for (ClassroomStatus status : ClassroomStatus.values()) {
            if (status.toString().equals(dbData)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Unknown database value: " + dbData);
    }
}
