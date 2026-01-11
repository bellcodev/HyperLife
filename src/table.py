import sqlite3 as sql

conn = sql.connect("c:/programacion/lifemap/src/data.db")
cursor = conn.cursor()
cursor.execute("")
conn.commit()
conn.close()
