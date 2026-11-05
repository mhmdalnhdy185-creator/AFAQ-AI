import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).parent / "afaq.db"


def get_connection():
    return sqlite3.connect(DB_PATH)


def initialize_database():
    with get_connection() as conn:
        cursor = conn.cursor()

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS students (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE,
                country TEXT,
                education_level TEXT
            )
        """)

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS opportunities (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                category TEXT,
                description TEXT,
                link TEXT
            )
        """)

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS saved_opportunities (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                student_id INTEGER,
                opportunity_id INTEGER,
                FOREIGN KEY(student_id) REFERENCES students(id),
                FOREIGN KEY(opportunity_id) REFERENCES opportunities(id)
            )
        """)

        conn.commit()


def add_student(name, email=None, country=None, education_level=None):
    with get_connection() as conn:
        conn.execute("""
            INSERT INTO students (name, email, country, education_level)
            VALUES (?, ?, ?, ?)
        """, (name, email, country, education_level))
        conn.commit()


def get_students():
    with get_connection() as conn:
        return conn.execute(
            "SELECT * FROM students"
        ).fetchall()


def add_opportunity(title, category, description, link):
    with get_connection() as conn:
        conn.execute("""
            INSERT INTO opportunities
            (title, category, description, link)
            VALUES (?, ?, ?, ?)
        """, (title, category, description, link))
        conn.commit()


def get_opportunities():
    with get_connection() as conn:
        return conn.execute(
            "SELECT * FROM opportunities ORDER BY id DESC"
        ).fetchall()


if __name__ == "__main__":
    initialize_database()
    print("AFAQ AI Database initialized successfully!")