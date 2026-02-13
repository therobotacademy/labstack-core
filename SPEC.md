¡Perfecto! Con estos puntos claros, he diseñado un prompt optimizado para que **Antigravity** genere una arquitectura limpia, funcional y con una interfaz profesional de corte científico.

Aquí tienes el prompt que debes copiar y pegar:

---

## Prompt para Antigravity

**Contexto del Proyecto:**
Crea una aplicación web full-stack para la gestión de experimentos científicos.

* **Frontend:** React (usando Vite, Tailwind CSS y Shadcn/ui para una estética de "Dashboard Científico" limpia y moderna).
* **Backend:** Node.js con Express.
* **Base de Datos:** SQLite (almacenada en un archivo local `database.sqlite`) usando Prisma o Sequelize como ORM.

**Estructura de Usuarios y Permisos:**

1. **Administrador:** Acceso a un panel global para gestionar usuarios (crear/eliminar investigadores) y visualizar estadísticas generales.
2. **Investigador:** Espacio de trabajo privado. Puede crear, leer, actualizar y borrar (CRUD) sus propios experimentos. No puede ver los experimentos de otros investigadores.

**Modelo de Datos (Experimento):**

* ID, Título, Descripción, Categoría, Fecha de creación y Relación (FK) con el autor.

**Requisitos Funcionales:**

1. **Autenticación:** Sistema de Login basado en JWT.
2. **Dashboard Investigador:** Vista de lista y buscador de experimentos propios. Formulario para añadir nuevos experimentos.
3. **Dashboard Admin:** Tabla de gestión de usuarios y contador total de experimentos en el sistema.
4. **UI/UX:** Diseño minimalista, uso de tonos azules fríos y grises claros, con estados de carga y notificaciones (Toasts).

**Entregables:**

* Estructura de carpetas completa (Client/Server).
* Scripts de migración para la base de datos SQLite.
* Configuración de variables de entorno.
