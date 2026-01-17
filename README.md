# LifeMap

**HyperLife** es una **Web-App local** diseñada para mejorar tu rendimiento, disciplina y productividad diaria.  
Con ella podrás registrar hechos relevantes, establecer metas diarias, visualizar tu progreso, ganar insignias y mantener un control claro de tu desempeño mensual.

---

## 📊 Badges

![License](https://img.shields.io/github/license/bellcodev/HyperLife?style=for-the-badge&logo=github)
![Stars](https://img.shields.io/github/stars/bellcodev/HyperLife?style=for-the-badge&logo=github)
![Forks](https://img.shields.io/github/forks/bellcodev/HyperLife?style=for-the-badge&logo=github)
![Issues](https://img.shields.io/github/issues/bellcodev/HyperLife?style=for-the-badge&logo=github)
![Pull Requests](https://img.shields.io/github/issues-pr/bellcodev/HyperLife?style=for-the-badge&logo=github)
![Last Commit](https://img.shields.io/github/last-commit/bellcodev/HyperLife?style=for-the-badge&logo=git)
![Repo Size](https://img.shields.io/github/repo-size/bellcodev/HyperLife?style=for-the-badge&logo=github)
![Code Size](https://img.shields.io/github/languages/code-size/bellcodev/HyperLife?style=for-the-badge&logo=github)

![Top Language](https://img.shields.io/github/languages/top/bellcodev/HyperLife?style=for-the-badge&logo=javascript)
![Languages Count](https://img.shields.io/github/languages/count/bellcodev/HyperLife?style=for-the-badge&logo=code)

![Docs](https://img.shields.io/badge/docs-available-brightgreen?style=for-the-badge&logo=readthedocs)
![Wiki](https://img.shields.io/badge/wiki-enabled-blue?style=for-the-badge&logo=github)

![Status](https://img.shields.io/badge/status-active-success?style=for-the-badge&logo=github)
![Made With Love](https://img.shields.io/badge/made%20with-%E2%9D%A4-red?style=for-the-badge)

---

## ✨ Funcionalidades principales

### 🔹 Hechos relevantes
| <img width="1347" height="687" alt="image" src="https://github.com/user-attachments/assets/b191dbc7-481e-494a-8978-fd0278d7db21" /> |
|---|
Registra lo más destacado de tu día, edita el día actual y consulta/borrar días anteriores.

### 🔹 Metas diarias
| <img width="1360" height="548" alt="image" src="https://github.com/user-attachments/assets/bbcef636-d14e-4274-85d7-78269b75e7c4" /> |
|---|
Define hasta **5 metas diarias** que te gustaría cumplir.

| <img width="1358" height="381" alt="image" src="https://github.com/user-attachments/assets/c26824a2-1352-429a-8cce-a495de355dd9" /> |
|---|
Marca las metas cumplidas cada día.

| <img width="1353" height="147" alt="image" src="https://github.com/user-attachments/assets/24e8f506-825f-4bb9-b956-f0643cf54df7" /> |
|---|
Visualiza tu progreso en una **gráfica interactiva**.

### 🔹 Gráfica de rendimiento
| <img width="1353" height="674" alt="image" src="https://github.com/user-attachments/assets/a79d09c6-d485-4e50-80e6-902da5cd4917" /> |
|---|
Consulta tu rendimiento mensual en una tabla clara e interactiva.

### 🔹Sistema de Insignias
| <img width="1357" height="307" alt="image" src="https://github.com/user-attachments/assets/884dfa28-c3cd-49be-8c63-066d0577e81e" /> |
|---|
La **Web** cuenta con un **Sistema de Insignias** basico que motiva a las personas a seguir y conseguir mas metas diarias
Cuenta con las insignias:
- Bronce (Se consigue a los 100 puntos)
- Plata (Se consigue a los 300 puntos)
- Oro (Se consigue a los 500 puntos)
- Diamante (Se consigue a los 1000 puntos)
**Nota:** Cada meta diaria cumplida da 5 puntos

---

## 🎛 Funciones adicionales

**Conexión a Internet**  
| <img width="78" height="72" alt="image" src="https://github.com/user-attachments/assets/61b1b8a6-fe49-49a6-9c6e-a057d94d99f7" /> | <img width="61" height="59" alt="image" src="https://github.com/user-attachments/assets/d0a79753-8586-4b5c-8785-dee1a7047cbb" /> |
|---|---|
La app detecta si tienes conexión y muestra un indicador visual.

**Silenciar sonidos**  
| <img width="79" height="53" alt="image" src="https://github.com/user-attachments/assets/8321a419-d930-4a0b-94d7-83372e3a9e66" /> | <img width="75" height="55" alt="image" src="https://github.com/user-attachments/assets/2db41cd1-61d4-446f-8f12-ad9dce5102cb" /> |
|---|---|
Permite activar/desactivar alertas y errores con un botón de campana que guarda tu preferencia.

---

## 🎨 Interfaz

La web tiene una interfaz clara con colores azules/morados y tonos blancos/grises, con botones estilizados al estilo de la aplicación.

---

## 🛠 Tecnologías utilizadas

![Python](https://img.shields.io/badge/Python-3.7+-blue?logo=python&logoColor=white&style=for-the-badge)
![FastAPI](https://img.shields.io/badge/FastAPI-0.95.2-red?logo=fastapi&logoColor=white&style=for-the-badge)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow?logo=javascript&logoColor=white&style=for-the-badge)
![SQLite3](https://img.shields.io/badge/SQLite3-Database-cyan?logo=sqlite&logoColor=white&style=for-the-badge)
![Requests](https://img.shields.io/badge/Requests-HTTP-green?logo=requests&logoColor=white&style=for-the-badge)
![Uvicorn](https://img.shields.io/badge/Uvicorn-Server-pink?logo=uvicorn&logoColor=white&style=for-the-badge)

---

## ⚙️ Instalación y uso

```bash
# Clonar el repositorio
git clone https://github.com/bellcodev/LifeMap.git

# Entrar al directorio
cd LifeMap

# Instalar dependencias
pip install -r requirements.txt

# Ejecutar el servidor
uvicorn main:app --reload
