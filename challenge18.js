const readline = require('readline');
const db = require('./config');
const Table = require('cli-table');
let table = null;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

mainLogin();
function mainLogin() {
    console.log(`==============================================
Welcome to Universitas Pendidikan Indonesia
        Jl Setiabudhi No. 255
==============================================`);
    askUsername();
}

function askUsername() {
    rl.question('username:', (username) => {
        db.all(`select * from username where nama = $username`, {
            $username: username
        }, (err, rows) => {
            if (err) {
                console.error(err);
                process.exit(1);
            }
            if (rows.length > 0) {
                console.log(`\n======================================`)
                askPassword(rows[0]);
            } else {
                console.log(`username tidak ada`);
                askUsername();
            }


        })

    });
}

function askPassword(user) {
    rl.question('password:', (password) => {
        if (password == user.password) {
            console.log(`\nSelamat datang, ${user.nama} akses mu adalah ${user.level.toUpperCase()}`);
            mainMenu();
        } else {
            console.log(`\npassword salah silahkan coba lagi`);
            askPassword(user)
        }
    });
}

function mainMenu() {
    console.log(
        `==============================================
silahkan pilih opsi di bawah ini :
[1]. Mahasiswa
[2]. Jurusan
[3]. dosen
[4]. mata kuliah
[5]. kontrak
[6]. keluar
==============================================`
    );
    rl.question('masukkan salah satu no. dari opsi di atas:', (answer) => {
        switch (answer) {
            case '1':
                mahasiswa();
                break;
            case '2':
                jurusan();
                break;
            case '3':
                dosen();
                break;
            case '4':
                Matakuliah();
                break;
            case '5':
                kontrak();
                break;
            case '6':
                console.log('selesai, anda berhasil keluar');
                process.exit(0);
            default:
                console.log('anda salah memasukkan no. menu');
                break;
        }
    });
}
function mahasiswa() {
    console.log(`
==============================================
silahkan pilih opsi di bawah ini
[1]. daftar mahasiswa
[2]. cari mahasiswa
[3]. tambah mahasiswa
[4]. hapus mahasiswa
[5]. kembali`);
    rl.question('\nmasukkan salah satu no. dari opsi di atas:', (answer) => {
        switch (answer) {
            case '1':
                daftarMurid();
                break;
            case '2':
                cariMurid();
                break;
            case '3':
                tambahMurid();
                break;
            case '4':
                hapusMurid();
                break;
            case '5':
                mainMenu();
                break;
            default:
                console.log('anda salah memasukkan no. menu');
                mahasiswa();
                break;
        }
    });
}

function daftarMurid() {
    db.all(`select * from mahasiswa`, {
    }, (err, rows) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        table = new Table({
            head: ['NIM', 'Nama', 'alamat', 'jurusan'],
            colWidths: [15, 20, 15, 10]
        });
        rows.forEach((item) => {
            table.push([item.nim, item.nama, item.alamat, item.jurusan]);
        })
        console.log(table.toString());
        mahasiswa()
    })
}

function cariMurid() {
    rl.question('Masukkan NIM:', (nim) => {
        db.all(`select mahasiswa.nim, mahasiswa.nama, mahasiswa.alamat, jurusan.nama_jurusan from mahasiswa, jurusan where jurusan.id_jurusan = mahasiswa.jurusan and mahasiswa.nim = $nim`, {
            $nim: nim
        }, (err, rows) => {
            console.log(rows[0]);
            if (err) {
                console.error(err);
                process.exit(1);
            }
            if (rows.length > 0) {
                //console.log(rows[0]);
                console.log(`
==============================================
DETAILS MAHASISWA
==============================================
NIM         : ${rows[0].nim}
Nama        : ${rows[0].nama}
Alamat      : ${rows[0].alamat}
Jurusan     : ${rows[0].nama_jurusan}
==============================================
            `);
                mahasiswa();
            } else {
                console.log(`mahasiswa dengan nim ${nim} tidak terdaftar`);
                cariMurid();
            }

        });
    });
}
function tambahMurid() {
    rl.question('NIM: ', (nim) => {
        rl.question('Nama : ', (nama) => {
            rl.question('alamat : ', (alamat) => {
                rl.question('jurusan : ', (jurusan) => {
                    const query = `INSERT INTO mahasiswa (nim, nama, alamat, jurusan) VALUES ('${nim}','${nama}', '${alamat}', '${jurusan}')`;
                    db.run(query, (err) => {
                        if (err) throw err;
                        console.log("berhasil di buat");
                        mahasiswa();
                    });

                });
            });
        });
    });
};
function hapusMurid() {
    rl.question('masukkan nim mahasiswa yang akan dihapus:', (nim) => {
        db.all(`select * from mahasiswa where mahasiswa.nim = $nim`, {
            $nim: nim
        }, (err, rows) => {
            if (err) {
                console.error(err);
                process.exit(1);
            }
            if (rows.length > 0) {
                db.run(`delete from mahasiswa where mahasiswa.nim = '${nim}'`, (err) => {
                    if (err) throw err;
                    console.log("berhasil di hapus");
                    mahasiswa();
                })
            } else {
                console.log(`mahasiswa dengan NIM ${nim} tidak terdaftar`);
                hapusMurid();
            }
        });
    });
}

function jurusan() {
    console.log(`
==============================================
silahkan pilih opsi di bawah ini
[1]. daftar jurusan
[2]. cari jurusan
[3]. tambah jurusan
[4]. hapus jurusan
[5]. kembali`);
    rl.question('masukkan salah satu no. dari opsi di atas:', (answer) => {
        switch (answer) {
            case '1':
                daftarjurusan();
                break;
            case '2':
                carijurusan();
                break;
            case '3':
                tambahjurusan();
                break;
            case '4':
                hapusjurusan();
                break;
            case '5':
                mainMenu();
                break;
            default:
                console.log('anda salah memasukkan no. menu');
                jurusan()
                break;
        }
    });
}

function daftarjurusan() {
    db.all(`select * from jurusan`, {
    }, (err, rows) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        table = new Table({
            head: ['idjurusan', 'NamaJurusan'],
            colWidths: [5, 20,]
        });
        rows.forEach((item) => {
            table.push([item.id_jurusan, item.nama_jurusan]);
        })
        console.log(table.toString());
        jurusan()
    })
}

function carijurusan() {
    rl.question('Masukkan Idjurusan:', (id_jurusan) => {
        db.all(`select * from jurusan where jurusan.id_jurusan = $Idjurusan`, {
            $Idjurusan: id_jurusan
        }, (err, rows) => {
            console.log(rows[0]);
            if (err) {
                console.error(err);
                process.exit(1);
            }
            if (rows.length > 0) {
                //console.log(rows[0]);
                console.log(`
==============================================
DETAILS JURUSAN
==============================================
Idjurusan         : ${rows[0].id_jurusan}
NamaJurusan       : ${rows[0].nama_jurusan}
==============================================
        `);
                jurusan();
            } else {
                console.log(`mahasiswa dengan Idjurusan ${id_jurusan} tidak terdaftar`);
                carijurusan();
            }

        });
    });
}
function tambahjurusan() {
    rl.question('Idjurusan: ', (id_jurusan) => {
        rl.question('Nama_jurusan : ', (nama_jurusan) => {
            const query = `INSERT INTO jurusan (id_jurusan, nama_jurusan) VALUES ('${id_jurusan}','${nama_jurusan}')`;
            db.run(query, (err) => {
                if (err) throw err;
                console.log("berhasil di buat");
                jurusan();
            });
        });
    });
};
function hapusjurusan() {
    rl.question('masukkan nim jurusan yang akan dihapus:', (id_jurusan) => {
        db.all(`select * from jurusan where jurusan.id_jurusan = $Idjurusan`, {
            $Idjurusan: id_jurusan
        }, (err, rows) => {
            if (err) {
                console.error(err);
                process.exit(1);
            } if (rows.length > 0) {
                db.run(`delete from jurusan where jurusan.id_jurusan = '${id_jurusan}'`, (err) => {
                    if (err) throw err;
                    console.log("berhasil di hapus");
                    jurusan();
                })
            } else {
                console.log(`mahasiswa dengan IdJurusan ${id_jurusan} tidak terdaftar`);
                hapusjurusan();
            }
        }
        )
    }
    )
}
function dosen() {
    console.log(`
==============================================
    silahkan pilih opsi di bawah ini
    [1]. daftar dosen
    [2]. cari dosen
    [3]. tambah dosen
    [4]. hapus dosen
    [5]. kembali`);
    rl.question('masukkan salah satu no. dari opsi di atas:', (answer) => {
        switch (answer) {
            case '1':
                daftardosen()
                break;
            case '2':
                caridosen();
                break;
            case '3':
                tambahdosen();
                break;
            case '4':
                hapusdosen();
                break;
            case '5':
                mainMenu();
                break;
            default:
                console.log('anda salah memasukkan no. menu');
                Dosen();
                break;
        }
    });
}
function daftardosen() {
    db.all(`select *from Dosen`, {
    }, (err, rows) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        table = new Table({
            head: ['nip', 'NamaDosen'],
            colWidths: [15, 15]
        });

        rows.forEach((item) => {
            table.push([item.nip, item.nama]);
        })
        console.log(table.toString());
        dosen()
    })
}
function caridosen() {
    rl.question('Masukkan nip:', (nip) => {
        db.all(`select  * from Dosen where Dosen.nip = $NIP`, {
            $NIP: nip
        }, (err, rows) => {
            if (err) {
                console.error(err);
                process.exit(1);
            }
            if (rows.length > 0) {
                console.log(`
==============================================
              DETAILS DOSEN
==============================================
NIP      : ${rows[0].nip}
NAMA     : ${rows[0].nama}
==============================================
                        `);
                dosen();
            } else {
                console.log(`dosen dengan NIP ${nip} tidak terdaftar`);
                caridosen();
            }

        });
    });
}         
function tambahdosen() {
    rl.question('NIP: ', (nip) => {
        rl.question('Nama : ', (nama) => {
            const query = `INSERT INTO Dosen (NIP, Nama) VALUES ('${nip}','${nama}')`;
            db.run(query, (err) => {
                if (err) throw err;
                console.log("berhasil di buat");
                dosen();
            });
        });
       
    });
};
function hapusdosen() {
    rl.question('masukkan kode dosen yang akan dihapus:', (nip) => {
        db.all(`select * from Dosen where Dosen.nip = $NIP`, {
            $NIP: nip
        }, (err, rows) => {
            if (err) {
                console.error(err);
                process.exit(1);
            }
            if (rows.length > 0) {
                db.run(`delete from Dosen where Dosen.nip = '${nip}'`, (err) => {
                    if (err) throw err;
                    console.log("berhasil di hapus");
                    dosen();
                })
            } else {
                console.log(`dosen dengan NIP ${nip} tidak terdaftar`);
                hapusdosen();
            }
        });
    });
}
function Matakuliah() {
    console.log(`
==============================================
silahkan pilih opsi di bawah ini
[1]. daftar Matakuliah
[2]. cari Matakuliah
[3]. tambah Matakuliah
[4]. hapus Matakuliah
[5]. kembali`);
    rl.question('masukkan salah satu no. dari opsi di atas:', (answer) => {
        switch (answer) {
            case '1':
                daftarMatakuliah()                  
                break;
            case '2':
                cariMatakuliah();
                break;
            case '3':
                tambahMatakuliah();
                break;
            case '4':
                hapusMatakuliah();
                break;
            case '5':
                mainMenu();
                break;
            default:
                console.log('anda salah memasukkan no. menu');
                Matakuliah();
                break;
        }
    });
}
function daftarMatakuliah() {
    db.all(`select * from MataKuliah`, (err, rows) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        table = new Table({
            head: ['IDMK', 'NamaMK', 'SKS'],
            colWidths: [15, 30, 10]
        });
        rows.forEach((item) => {
            table.push([item.code_matkul, item.Nama_Matkul, item.sks]);
        })
        console.log(table.toString());
        Matakuliah();
    });
}
function cariMatakuliah() {
    rl.question('Masukkan  code_mataKuliah:', (code_matkul) => {
        db.all(`select * from MataKuliah where MataKuliah.code_matkul = $codematkul`, {
            $codematkul: code_matkul
        }, (err, rows) => {
            if (err) {
                console.error(err);
                process.exit(1);
            }
            if (rows.length > 0) {
                console.log(`
==============================================
DETAILS MATA KULIAH
==============================================
Kode Matakuliah    : ${rows[0].code_matkul}
Nama Matakuliah    : ${rows[0].Nama_Matkul}
SKS                : ${rows[0].sks}
==============================================
            `);
                Matakuliah();
            } else {
                console.log(`matakuliah dengan code_matkul ${code_matkul} tidak terdaftar`);
                cariMatakuliah();
            }

        });
    });
}
function tambahMatakuliah() {
    rl.question('KODEMK: ', (code_matkul) => {
        rl.question('NamaMK : ', (Nama_Matkul) => {
            rl.question('SKS : ', (sks) => {
                const query = `INSERT INTO MataKuliah (code_matkul, Nama_Matkul, sks) VALUES ('${code_matkul}','${Nama_Matkul}','${sks}')`;
                db.run(query, (err) => {
                    if (err) throw err;
                    console.log("berhasil di buat");
                    Matakuliah();
                });
            });
        });
    });
}
function hapusMatakuliah() {
    rl.question('masukkan code_matkul yang akan dihapus:', (code_matkul) => {
        db.all(`select * from MataKuliah where MataKuliah.code_matkul = $code_matkul`, {
            $code_matkul: code_matkul
        }, (err, rows) => {
            if (err) {
                console.error(err);
                process.exit(1);
            }
            if (rows.length > 0) {
                db.run(`delete from MataKuliah where MataKuliah.code_matkul = '${code_matkul}'`, (err) => {
                    if (err) throw err;
                    console.log("berhasil di hapus");
                    Matakuliah();
                })
            } else {
                console.log(`dosen dengan codeMatul ${code_matkul} tidak terdaftar`);
                hapusMatakuliah();
            }
        });
    });

}
function kontrak() {
    console.log(`
==============================================
silahkan pilih opsi di bawah ini
[1]. daftar kontrak
[2]. cari kontrak
[3]. tambah kontrak
[4]. hapus kontrak
[5]. kembali`);
    rl.question('masukkan salah satu no. dari opsi di atas:', (answer) => {
        switch (answer) {
            case '1':
                daftarKontrak();
                break;
            case '2':
                cariKontrak();
                break;
            case '3':
                tambahKontrak();
                break;
            case '4':
                hapusKontrak();
                break;
            case '5':
                mainMenu();
                break;
            default:
                console.log('anda salah memasukkan no. menu');
                kontrak();
                break;
        }
    });
}
function daftarKontrak() {
    db.all(`select * from kontrak`, (err, rows) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        table = new Table({
            head: ['NIM','NAMA', 'Idjurusan', 'codeMatkul','NIP', 'Nilai','SKS'],
            colWidths: [5, 25, 25, 25 , 8 , 8 , 5],
        });
        rows.forEach((item) => {
            table.push([item.nim, item.nama, item.id_jurusan, item.code_matkul,item.nip,item.nilai,item.sks]);
        })
        console.log(table.toString());
        kontrak();
    });
}
function cariKontrak() {
    rl.question('Masukkan ID kontrak:', (nim) => {
        db.all(`select * from kontrak where kontrak.nim = $nim`, {
            $nim: nim
        }, (err, rows) => {
            if (err) {
                console.error(err);
                process.exit(1);
            }
            if (rows.length > 0) {
                console.log(`
==============================================
DETAILS MATA KULIAH
==============================================
NIM          : ${rows[0].nim}
NAMA         : ${rows[0].nama}
Id Jurusan   : ${rows[0].id_jurusan}
Code Matkul  : ${rows[0].code_matkul}
NIP          : ${rows[0].nip}
NILAI        : ${rows[0].nilai}
SKS          : ${rows[0].sks}


==============================================
            `);
                kontrak();
            } else {
                console.log(`kontrak dengan NIM ${nim} tidak terdaftar`);
                cariKontrak();
            }

        });
    });
}

function tambahKontrak() {
   
    rl.question('NIM: ', (nim) => {
        rl.question('NAMA: ', (nama) => {
            rl.question('IDjurusan : ', (id_jurusan) => {
                rl.question('CodeMatkul : ', (code_matkul) => {
                    rl.question('NIP : ', (nip) => {
                        rl.question('Nilai : ', (nilai) => {
                            rl.question('SKS : ', (sks) => {
                            const query = `INSERT INTO kontrak (nim,nama,id_jurusan,code_matkul,nip,nilai,sks) VALUES ('${nim}','${nama}','${id_jurusan}','${code_matkul}','${nip}','${nilai}','${sks}')`;
                            db.run(query, (err) => {
                                if (err) throw err;
                                console.log("berhasil di buat");
                                kontrak();
                            })
                            });
                        });
                    });
                });
            });
        });
    });
    }

    function hapusKontrak() {
        rl.question('masukkan NIM kontrak yang akan dihapus:', (nim) => {
            db.all(`select * from kontrak where kontrak.nim = $nim`, {
                $nim: nim
            }, (err, rows) => {
                if (err) {
                    console.error(err);
                    process.exit(1);
                }
                if (rows.length > 0) {
                    db.run(`delete from kontrak where kontrak.nim = '${nim}'`, (err) => {
                        if (err) throw err;
                        console.log("berhasil di hapus");
                        kontrak();
                    })
                } else {
                    console.log(`kontrak dengan ID ${nim} tidak terdaftar`);
                    hapusKontrak();
                }
            });
        });
    
    }