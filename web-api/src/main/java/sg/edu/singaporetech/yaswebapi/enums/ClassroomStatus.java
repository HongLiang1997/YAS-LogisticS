package sg.edu.singaporetech.yaswebapi.enums;

public enum ClassroomStatus {
    OPEN("Open"),
    CLOSED("Closed");

    private final String text;

    ClassroomStatus(final String text) {
        this.text = text;
    }

    @Override
    public String toString() {
        return text;
    }
}
