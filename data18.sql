-- SQLite
CREATE TABLE mahasiswa(
nim varchar(3)PRIMARY key NOT NULL,
nama varchar(25)NOT NULL,
alamat varchar(20) NOT NULL,
jurusan varchar(1) NOT NULL
);

INSERT INTO mahasiswa(nim,nama,alamat,jurusan)
VALUES('0080676','toni','jakarta','001'),
      ('0880677','fahmi','bandung','002')

CREATE TABLE username(
nama varchar(15)PRIMARY KEY NOT NULL,
password varchar(8)NOT NULL,
level varchar(5)NOT NULL
);
 
 INSERT INTO username(nama,password,level)
 VALUES('rubi','123','ADMIN'),
       ('daffa','65','ADMIN')
DROP TABLE Dosen;

CREATE TABLE jurusan(
id_jurusan varchar(3)PRIMARY KEY NOT NULL,
nama_jurusan varchar(25)NOT NULL
);

INSERT INTO jurusan(id_jurusan,nama_jurusan)
VALUES('001','Teknik Informatika'),
      ('002','Teknik mesin')



CREATE TABLE Dosen(
nip varchar(3)PRIMARY KEY NOT NULL,
nama varchar(10)NOT NULL
);

INSERT INTO Dosen(nip,nama)
VALUES('123','rubi'),
      ('124','reky')





CREATE TABLE MataKuliah(
code_matkul varchar(3)PRIMARY KEY NOT NULL,
Nama_Matkul varchar(15)NOT NULL,
sks varchar(5)NOT NULL
);
INSERT INTO MataKuliah(code_matkul,Nama_Matkul,sks)
VALUES('001','Matematika','2'),
      ('002','kewirusahaan','3'),
      ('003','kejuruan','4'),
      ('004','data mining','3')


CREATE TABLE kontrak(
    nim varchar(3)NOT NULL,
    nama varchar(25) NOT NULL,
    id_jurusan varchar(3)NOT NULL,
    code_matkul varchar(3)NOT NULL,
    nip varchar(3)NOT NULL,
    nilai varchar(1)NOT NULL,
    sks varchar(1) NOT NULL,
    FOREIGN KEY (nim) REFERENCES mahasiswa(nim),
    FOREIGN KEY (id_jurusan) REFERENCES jurusan(id_jurusan),
    FOREIGN KEY (code_matkul) REFERENCES MataKuliah(code_matkul),
    FOREIGN KEY (nip) REFERENCES Dosen(nip)
    );
    

    INSERT INTO kontrak(nim,nama,id_jurusan,code_matkul,nip,nilai,sks)
    VALUES('001','Daffa Muhammad Firdaus','001','004','003','A','3'),
          ('002','khabib jafar','002','002','002','E','3'),
          ('003','rezi ferdiyansyah','001','004','003','A','3'),
          ('004',' putra satria ','001','001','001','A','2'),
          ('005','muhammad himilton','002','003','004','D','4'),
          ('001','Daffa Muhammad Firdaus','001','002','002','B','3'),
          ('005','muhammad himilton','002','001','001','B','2'),
          ('001','Daffa Muhammad Firdaus','001','003','004','A','4'),
          ('001','Daffa Muhammad Firdaus','001','001','001','A','2')
          
DELETE FROM username;

    




