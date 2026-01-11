import sqlite3 as sql

conn = sql.connect("c:/programacion/lifemap/src/data.db")
cursor = conn.cursor()
cursor.execute("INSERT INTO relevante (day, hecho) VALUES (9, 'fviv'), (10, 'khvbfhvb')")
cursor.execute("SELECT day, hecho FROM relevante")
data = cursor.fetchall()
print(data)
