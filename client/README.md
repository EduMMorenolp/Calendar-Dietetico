# NutriControl - Implementación Frontend

Este `README.md` se enfoca en los detalles técnicos y la estructura de la implementación del frontend de **NutriControl**. Para una visión general del proyecto, sus características y cómo usarlo.

## 💻 Resumen Técnico

El frontend de **NutriControl** es una Aplicación de Una Sola Página (SPA) construida con **React** y **TypeScript**, diseñada para una experiencia de usuario fluida y robusta. Aprovecha los hooks modernos de React para la gestión del estado y el ciclo de vida de los componentes, asegurando una base de código altamente interactiva y mantenible.

## ⚙️ Tecnologías y Librerías Centrales

- **React**: La librería fundamental de JavaScript para construir la interfaz de usuario.
- **TypeScript**: Proporciona tipado estático en todo el código base, mejorando significativamente la calidad, legibilidad y mantenibilidad del código, especialmente para estructuras de datos complejas.
- **HTML2Canvas-Pro**: Utilizado para renderizar contenido HTML en el lado del cliente en un elemento `<canvas>`. Esto es crucial para capturar la vista del calendario de la semana actual para la generación de PDF.
  - **Uso clave**: Captura el elemento DOM referenciado por `pdfRef` para producir una imagen de alta resolución del calendario.
- **jsPDF**: Una potente librería del lado del cliente para generar documentos PDF.
  - **Uso clave**: Toma los datos de imagen de `html2canvas-pro` y construye un PDF de varias páginas, manejando la paginación para contenido más largo.
- **Tailwind CSS**: Un framework CSS "utility-first" para un estilado rápido y consistente. Promueve diseños altamente personalizables directamente en tu JSX.
- **React Hooks**:
  - `useState`: Gestiona el estado local de la aplicación, incluyendo los datos de `currentWeek` y cualquier estado transitorio de la UI.
  - `useCallback`: Memoriza las funciones de manejo de eventos (`handleImageChange`, `handleTextChange`, `removeImage`, `generarPDF`) para prevenir renderizados innecesarios de los componentes hijos. Las dependencias se gestionan cuidadosamente para asegurar cierres actualizados.
  - `useMemo`: Optimiza cálculos computacionalmente costosos memorizando sus resultados. (Actualmente no se usa explícitamente para `currentWeek` ya que es un estado directo).
  - `useRef`: Proporciona una forma de acceder al nodo DOM (`pdfRef`) para que `html2canvas-pro` lo capture.

## 📂 Puntos Destacados de la Estructura del Proyecto

El proyecto sigue una arquitectura basada en componentes, promoviendo la modularidad y la reusabilidad:

```bash
nutricontrol/
├── public/
├── src/
│   ├── components/
│   │   ├── AuthModal.tsx
│   │   ├── CalendarTable.tsx
│   │   ├── Header.tsx
│   │   ├── PrivateRoute.tsx
│   │   ├── ProgressTracker.tsx
│   │   ├── SubmitButton.tsx
│   │   └── WeekNavigator.tsx
│   ├── constants/
│   │   └── data.ts
│   ├── context/
│   │   └── AuthContext.tsx
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   └── DashboardPro.tsx
│   ├── types/
│   │   └── calendar.ts
│   ├── App.tsx
│   └── main.tsx
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## 💡 Detalles Clave de Implementación

- **Gestión del Estado (`Dashboard.tsx`)**:
  - El estado `currentWeek` contiene la estructura de datos completa de la semana mostrada (`CellData[][]`).
  - Todas las modificaciones a `currentWeek` se manejan de forma **inmutable** utilizando copias profundas (`JSON.parse(JSON.stringify())`) para asegurar que React detecte los cambios de estado correctamente y active los re-renderizados.
- **Manejo de Imágenes (`handleImageChange`)**:
  - Las imágenes se procesan en el lado del cliente. Un `FileReader` lee el archivo seleccionado y un objeto `Image` se usa para cargarlo.
  - Se crea un elemento `canvas` para **redimensionar** y comprimir la imagen (`MAX_DIMENSION = 800px`) antes de actualizar el estado.
  - Las imágenes se almacenan como **Object URLs temporales (`blob:`)** en el estado `currentWeek` para su visualización. Estas URLs se revocan activamente (`URL.revokeObjectURL`) cuando una imagen es reemplazada o eliminada para prevenir fugas de memoria durante la sesión.
- **Generación de PDF (`generarPDF`)**:
  - El `pdfRef` permite a `html2canvas-pro` renderizar el contenido visible del contenedor principal de `Dashboard`.
  - La imagen resultante del `canvas` se convierte a una URL de datos (`image/png`) y luego se añade a una instancia de `jsPDF`.
  - Se implementa el manejo de PDFs de **múltiples páginas** para asegurar que todo el contenido se ajuste, dividiendo la imagen en varias páginas según sea necesario.
- **Tipado Estricto**: Las interfaces de `TypeScript` (`WeekData`, `CellData`, `Category`) se aplican estrictamente, proporcionando seguridad de tipo para los datos que fluyen entre los componentes y dentro de las actualizaciones de estado.

## 🚀 Configuración del Entorno de Desarrollo Local

Para poner en marcha el entorno de desarrollo del frontend:

1.  **Clona el repositorio:**

    ```bash
    git clone https://github.com/EduMMorenolp/NutriControl.git
    cd NutriControl
    ```

2.  **Instala las dependencias:**

    ```bash
    npm install
    ```

3.  **Inicia el servidor de desarrollo:**
    ```bash
    npm run dev
    ```