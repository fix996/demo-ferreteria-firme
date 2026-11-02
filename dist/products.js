const categories = [
  { id: "herramientas", name: "Herramientas", detail: "Para medir, ajustar y construir", number: "01" },
  { id: "fijaciones", name: "Fijaciones", detail: "Tornillos, clavos y más", number: "02" },
  { id: "electricidad", name: "Electricidad", detail: "Elementos de instalación", number: "03" },
  { id: "plomeria", name: "Plomería", detail: "Conexiones y grifería", number: "04" },
  { id: "pintura", name: "Pintura", detail: "Preparar, cubrir y renovar", number: "05" },
  { id: "seguridad", name: "Seguridad", detail: "Protección para trabajar", number: "06" }
];

const products = [
  {
    id: "HER-001", name: "Taladro inalámbrico", category: "herramientas", image: "assets/taladro.jpg",
    description: "Una herramienta versátil para trabajos de montaje y mantenimiento.",
    details: ["Uso general", "Modelo ilustrativo", "Características sujetas a confirmación"]
  },
  {
    id: "HER-002", name: "Martillo carpintero", category: "herramientas", image: "assets/martillo.jpg",
    description: "Un básico firme para tener siempre a mano.",
    details: ["Mango de madera ilustrativo", "Uso general", "Medidas sujetas a confirmación"]
  },
  {
    id: "HER-003", name: "Cinta métrica", category: "herramientas", image: "assets/cinta.jpg",
    description: "Mediciones rápidas para planificar cada proyecto.",
    details: ["Formato retráctil", "Medida ilustrativa: 5 m", "Características sujetas a confirmación"]
  },
  {
    id: "FIJ-001", name: "Tornillos multipropósito", category: "fijaciones", image: "assets/tornillos.jpg",
    description: "Fijaciones para armado, reparación e instalación.",
    details: ["Varias medidas posibles", "Presentación ilustrativa", "Cantidad sujeta a consulta"]
  },
  {
    id: "FIJ-002", name: "Clavos comunes", category: "fijaciones", image: "assets/clavos.jpg",
    description: "Un esencial para tareas de carpintería y obra.",
    details: ["Varias medidas posibles", "Presentación ilustrativa", "Cantidad sujeta a consulta"]
  },
  {
    id: "ELE-001", name: "Kit de instalación", category: "electricidad", image: "assets/kit-electrico.jpg",
    description: "Elementos básicos para planificar instalaciones eléctricas.",
    details: ["Componentes ilustrativos", "Instalación por personal calificado", "Contenido sujeto a confirmación"]
  },
  {
    id: "PLO-001", name: "Conexiones de PVC", category: "plomeria", image: "assets/canos.jpg",
    description: "Piezas de unión para distintas necesidades de plomería.",
    details: ["Diámetros a consultar", "Presentación ilustrativa", "Compatibilidad sujeta a confirmación"]
  },
  {
    id: "PLO-002", name: "Grifería de cocina", category: "plomeria", image: "assets/griferia.jpg",
    description: "Líneas simples para actualizar un espacio de uso diario.",
    details: ["Modelo ilustrativo", "Terminación cromada", "Compatibilidad sujeta a confirmación"]
  },
  {
    id: "PIN-001", name: "Rodillo de pintura", category: "pintura", image: "assets/rodillo.jpg",
    description: "Un aliado para cubrir superficies con prolijidad.",
    details: ["Tamaño ilustrativo", "Uso interior", "Características sujetas a confirmación"]
  },
  {
    id: "PIN-002", name: "Pintura interior", category: "pintura", image: "assets/pintura.jpg",
    description: "La base para renovar ambientes y darles otro aire.",
    details: ["Presentación ilustrativa", "Color y rendimiento a consultar", "Disponibilidad sujeta a confirmación"]
  },
  {
    id: "SEG-001", name: "Guantes de trabajo", category: "seguridad", image: "assets/guantes.jpg",
    description: "Protección cómoda para tareas de taller y obra.",
    details: ["Talles a consultar", "Modelo ilustrativo", "Uso según tarea"]
  },
  {
    id: "SEG-002", name: "Gafas de seguridad", category: "seguridad", image: "assets/gafas.jpg",
    description: "Protección visual para trabajar con más cuidado.",
    details: ["Modelo ilustrativo", "Uso según tarea", "Especificaciones sujetas a confirmación"]
  }
];
