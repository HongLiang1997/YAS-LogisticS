package sg.edu.singaporetech.yaswebapi.converter;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import sg.edu.singaporetech.yaswebapi.enums.TrayStatus;

@Converter
public class TrayStatusConverter implements AttributeConverter<TrayStatus, String> {

    @Override
    public String convertToDatabaseColumn(TrayStatus attribute) {
        return attribute != null ? attribute.toString() : null;
    }

    @Override
    public TrayStatus convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        for (TrayStatus status : TrayStatus.values()) {
            if (status.toString().equals(dbData)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Unknown database value: " + dbData);
    }
}
