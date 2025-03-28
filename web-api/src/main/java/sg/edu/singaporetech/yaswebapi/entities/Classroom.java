package sg.edu.singaporetech.yaswebapi.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import sg.edu.singaporetech.yaswebapi.converters.ClassroomStatusConverter;
import sg.edu.singaporetech.yaswebapi.enums.ClassroomStatus;

import java.util.List;

@Entity
@Getter
@Setter
public class Classroom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255, unique = true)
    private String name;

    @Convert(converter = ClassroomStatusConverter.class)
    @Column(nullable = false, length = 20)
    private ClassroomStatus status;

    @OneToMany(mappedBy = "classroom", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Bay> bays;

    @OneToMany(mappedBy = "classroom", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Tray> trays;
}