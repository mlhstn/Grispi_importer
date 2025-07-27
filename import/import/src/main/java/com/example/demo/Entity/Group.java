package com.example.demo.Entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "groups")
public class Group {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    // İlişkiler için örnek:
    // CustomField ile ManyToMany ilişkisi zaten CustomField'da tanımlı, burada karşılıklı tanım opsiyonel.
    // Eğer User ile ilişki olursa şöyle ekleyebilirsin:
    /*
    @ManyToMany(mappedBy = "groups")
    private List<User> users;
    */

}
