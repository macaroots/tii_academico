CREATE TABLE papeis (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(45)
);

CREATE TABLE estudantes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(45),
    nota1 FLOAT,
    nota2 FLOAT,
    senha VARCHAR(45),
    id_papel INT,
    FOREIGN KEY (id_papel) REFERENCES papeis(id)
);