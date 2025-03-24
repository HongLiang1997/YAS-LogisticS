package sg.edu.singaporetech.yaswebapi.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import sg.edu.singaporetech.yaswebapi.converters.TrayStatusConverter;
import sg.edu.singaporetech.yaswebapi.enums.TrayStatus;

import java.util.List;

@Entity
@Getter
@Setter
public class Tray {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Convert(converter = TrayStatusConverter.class)
    @Column(nullable = false, length = 20)
    private TrayStatus status;

    @OneToOne(optional = true)
    @JoinColumn(name = "bay_id", unique = true)
    private Bay bay;

    @OneToMany(mappedBy = "tray", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Item> items;
}
