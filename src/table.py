import sqlite3 as sql

conn = sql.connect("c:/programacion/programas/lifemap/src/data.db")
cursor = conn.cursor()
cursor.execute("DELETE FROM logros")
conn.commit()
conn.close()
