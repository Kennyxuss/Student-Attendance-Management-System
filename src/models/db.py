"""
models/db.py — Data layer (thin). Only raw persistence, no validation.
Used by thin controllers (Week 5 Task 1).
Swap sqlite for MySQL: change get_db() to mysql.connector.connect.
"""
import os, sqlite3
DB_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "attendance.db")
# For repo drag-drop, place DB at project root. Fallback to src folder if needed.
if not os.path.exists(os.path.dirname(DB_PATH)):
    DB_PATH = os.path.join(os.path.dirname(__file__), "attendance.db")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn

def init_db():
    conn = get_db()
    conn.executescript("""
    CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        course TEXT NOT NULL,
        year_level INTEGER NOT NULL,
        email TEXT,
        contact TEXT
    );
    CREATE TABLE IF NOT EXISTS teachers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employee_id TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        department TEXT NOT NULL,
        email TEXT NOT NULL,
        contact TEXT
    );
    CREATE TABLE IF NOT EXISTS subjects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        subject_code TEXT UNIQUE NOT NULL,
        subject_name TEXT NOT NULL,
        description TEXT,
        schedule TEXT NOT NULL,
        instructor_id INTEGER,
        FOREIGN KEY(instructor_id) REFERENCES teachers(id) ON DELETE SET NULL
    );
    CREATE TABLE IF NOT EXISTS attendance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        class_id INTEGER NOT NULL,
        date TEXT NOT NULL,
        status TEXT NOT NULL,
        remarks TEXT,
        FOREIGN KEY(student_id) REFERENCES students(id) ON DELETE CASCADE,
        FOREIGN KEY(class_id) REFERENCES subjects(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        role TEXT
    );
    """)
    conn.commit()
    if conn.execute("SELECT COUNT(*) FROM users").fetchone()[0]==0:
        conn.execute("INSERT INTO users (username,password,role) VALUES (?,?,?)", ("admin","admin123","Admin"))
        conn.execute("INSERT INTO users (username,password,role) VALUES (?,?,?)", ("teacher1","teacher123","Teacher"))
        conn.execute("INSERT INTO users (username,password,role) VALUES (?,?,?)", ("student1","student123","Student"))
        conn.commit()
    conn.close()

# ----- thin data helpers -----
def save_student(sid, name, course, year_level, email, contact):
    conn=get_db()
    cur=conn.execute("INSERT INTO students (student_id,name,course,year_level,email,contact) VALUES (?,?,?,?,?,?)",(sid,name,course,year_level,email,contact))
    conn.commit(); nid=cur.lastrowid; conn.close(); return nid

def get_student(id): 
    conn=get_db(); r=conn.execute("SELECT * FROM students WHERE id=?",(id,)).fetchone(); conn.close(); return dict(r) if r else None

def list_students():
    conn=get_db(); rows=conn.execute("SELECT * FROM students ORDER BY id DESC").fetchall(); conn.close(); return [dict(r) for r in rows]

def update_student(id, name, course, year_level, email, contact):
    conn=get_db(); conn.execute("UPDATE students SET name=?,course=?,year_level=?,email=?,contact=? WHERE id=?",(name,course,year_level,email,contact,id)); conn.commit(); conn.close()

def delete_student(id):
    conn=get_db(); conn.execute("DELETE FROM students WHERE id=?",(id,)); conn.commit(); conn.close()

def save_teacher(eid,name,dept,email,contact):
    conn=get_db(); cur=conn.execute("INSERT INTO teachers (employee_id,name,department,email,contact) VALUES (?,?,?,?,?)",(eid,name,dept,email,contact)); conn.commit(); nid=cur.lastrowid; conn.close(); return nid

def save_subject(code,sname,desc,sched,instr):
    conn=get_db(); cur=conn.execute("INSERT INTO subjects (subject_code,subject_name,description,schedule,instructor_id) VALUES (?,?,?,?,?)",(code,sname,desc,sched,instr)); conn.commit(); nid=cur.lastrowid; conn.close(); return nid

def save_attendance(sid,cid,date,status,remarks):
    conn=get_db(); cur=conn.execute("INSERT INTO attendance (student_id,class_id,date,status,remarks) VALUES (?,?,?,?,?)",(sid,cid,date,status,remarks)); conn.commit(); nid=cur.lastrowid; conn.close(); return nid

def list_attendance():
    conn=get_db(); rows=conn.execute("SELECT * FROM attendance ORDER BY id DESC").fetchall(); conn.close(); return [dict(r) for r in rows]
