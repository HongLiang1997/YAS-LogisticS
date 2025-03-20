package sg.edu.singaporetech.yaswebapi.enums;

public enum TrayStatus {
    IN_BAY("In Bay"),
    LOANED("Loaned");

    private final String text;

    TrayStatus(final String text) {
        this.text = text;
    }

    @Override
    public String toString() {
        return text;
    }
}
