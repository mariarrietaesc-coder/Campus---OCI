
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Card, Badge, Quiz, MinistryLogo } from '../components/UI';
import { Target, Map, Layout, Scale, Users, FileText, Search, X, ChevronDown, CheckCircle, Info, BookOpen, ArrowRight, Grid, ArrowLeft, Clock, Lock, ArrowUpRight, BarChart2, Briefcase, ShieldAlert } from 'lucide-react';
import { QuizState } from '../types';

// --- DATA: Programas y Proyectos ---
const PROGRAMAS_DATA = [
    {id:'agua-vida', nombre:'Agua es Vida', viceministerio:'Pobreza', dependencia:'Acceso Igualitario al Agua', poblacion:'Territorios marginados con baja cobertura de agua', estrategia:'Infraestructura para cerrar brechas', breve:'Acceso igualitario y digno al agua potable mediante soluciones pertinentes territorialmente.', tags:'agua,territorio,inclusion,servicios'}, 
    {id:'hambre-cero', nombre:'Hambre Cero', viceministerio:'Pobreza', dependencia:'Superación de la Pobreza', poblacion:'Hogares en pobreza y extrema pobreza', estrategia:'Condiciones para vida digna', breve:'Asegurar alimentación adecuada y soberanía alimentaria con enfoque territorial.', tags:'alimentacion,pobreza,seguridad-alimentaria'}, 
    {id:'personas-mayores', nombre:'Bienestar para Personas Mayores', viceministerio:'Pobreza', dependencia:'Personas Mayores', poblacion:'Personas mayores en exclusión', estrategia:'Abordaje psicosocial y bienestar', breve:'Cuidados, protección social y participación para un envejecimiento digno.', tags:'personas-mayores,cuidado,proteccion'}, 
    {id:'habitantes-calle', nombre:'Construyendo Dignidad', viceministerio:'Pobreza', dependencia:'Personas en Situación de Calle', poblacion:'Habitantes de calle', estrategia:'Acompañamiento para restablecimiento de derechos', breve:'Abordaje integral y territorial con rutas de restablecimiento de derechos.', tags:'calle,restablecimiento,proteccion'}, 
    {id:'cuidado', nombre:'Sistema de Cuidado en Territorios', viceministerio:'Pobreza', dependencia:'Cuidado', poblacion:'Personas cuidadoras y receptoras de cuidado', estrategia:'Ecosistema institucional del Sector Igualdad', breve:'Implementación territorial del cuidado como derecho y trabajo reconocido.', tags:'cuidado,corresponsabilidad,servicios'}, 
    {id:'migracion', nombre:'Raíces en Movimiento', viceministerio:'Pobreza', dependencia:'Población Migrante', poblacion:'Población migrante, refugiada y retornada', estrategia:'Condiciones para vida digna', breve:'Respuesta humanitaria, integración socioeconómica y cohesión social para población migrante.', tags:'migracion,humanitaria,integracion'}, 
    {id:'casas-dignidad', nombre:'Casas de la Dignidad', viceministerio:'Mujeres', dependencia:'Prevención y Atención de las Violencias', poblacion:'Mujeres víctimas de violencias', estrategia:'Acompañamiento para restablecimiento de derechos', breve:'Espacios seguros de acogida, atención y empoderamiento para mujeres y sus familias.', tags:'violencia-genero,proteccion,refugio'}, 
    {id:'autonomia-eco', nombre:'Mujeres por la Autonomía Económica', viceministerio:'Mujeres', dependencia:'Autonomía Económica', poblacion:'Mujeres en condiciones de vulnerabilidad económica', estrategia:'Iniciativas productivas', breve:'Fomento de emprendimientos y acceso a mercados para la independencia económica de las mujeres.', tags:'emprendimiento,economia,empoderamiento'}, 
    {id:'derechos-sexuales', nombre:'Mis Derechos, Mi Decisión', viceministerio:'Mujeres', dependencia:'Garantía de Derechos', poblacion:'Mujeres, adolescentes y niñas', estrategia:'Cambio cultural', breve:'Promoción y garantía de los derechos sexuales y reproductivos en todo el territorio nacional.', tags:'derechos-reproductivos,salud,pedagogia'}, 
    {id:'masp', nombre:'Reconocimiento y Dignidad (MASP)', viceministerio:'Mujeres', dependencia:'Mujeres en Actividades Sexuales Pagas', poblacion:'Mujeres en actividades sexuales pagas', estrategia:'Condiciones para vida digna', breve:'Garantía de derechos, reducción de estigmas y alternativas de vida digna.', tags:'masp,derechos-humanos,inclusion-social'}, 
    {id:'madres-cabeza', nombre:'Madres que Lideran', viceministerio:'Mujeres', dependencia:'Madres Cabeza de Familia', poblacion:'Madres cabeza de familia', estrategia:'Alianzas público-populares y comunitarias', breve:'Apoyo integral para el bienestar, autonomía y liderazgo de las madres cabeza de familia.', tags:'maternidad,liderazgo,cuidado'}, 
    {id:'jovenes-paz', nombre:'Jóvenes en Paz', viceministerio:'Juventud', dependencia:'Jóvenes en Paz', poblacion:'Jóvenes en riesgo de violencia y exclusión', estrategia:'Acompañamiento para restablecimiento de derechos', breve:'Alternativas de vida y construcción de paz a través de educación, cultura y empleo.', tags:'paz,juventud,oportunidades'}, 
    {id:'barrismo-social', nombre:'Fútbol y Convivencia', viceministerio:'Juventud', dependencia:'Barrismo Social', poblacion:'Jóvenes barristas', estrategia:'Espacios de juntanza', breve:'Transformación de las barras de fútbol en actores de convivencia y paz territorial.', tags:'barrismo,convivencia,deporte'}, 
    {id:'oportunidades-joven', nombre:'Sacúdete por tus Derechos', viceministerio:'Juventud', dependencia:'Goce Efectivo de Derechos y Oportunidades', poblacion:'Jóvenes de 14 a 28 años', estrategia:'Iniciativas productivas', breve:'Plataforma de oportunidades en educación, empleo, emprendimiento y participación juvenil.', tags:'educacion,empleo,participacion'}, 
    {id:'lgbtiq', nombre:'Orgullo Diverso', viceministerio:'Diversidades', dependencia:'Derechos de la Población LGBTIQ+', poblacion:'Población LGBTIQ+', estrategia:'Cambio cultural', breve:'Garantía de derechos, lucha contra la discriminación y visibilización de la diversidad sexual y de género.', tags:'lgbtiq,inclusion,derechos'}, 
    {id:'discapacidad', nombre:'Colombia sin Barreras', viceministerio:'Diversidades', dependencia:'Derechos de Personas con Discapacidad', poblacion:'Personas con discapacidad', estrategia:'Infraestructura para cerrar brechas', breve:'Inclusión social, laboral y educativa a través de la eliminación de barreras físicas y sociales.', tags:'discapacidad,accesibilidad,inclusion'}, 
    {id:'narp', nombre:'Herencia Viva (NARP)', viceministerio:'Étnicos', dependencia:'NARP', poblacion:'Comunidades Negras, Afrocolombianas, Raizales y Palenqueras', estrategia:'Reconocimiento y transmisión de saberes', breve:'Fortalecimiento de la identidad cultural, protección de territorios y lucha contra el racismo.', tags:'etnico,antirracismo,territorio,saberes'}, 
    {id:'indigenas', nombre:'Saberes Ancestrales', viceministerio:'Étnicos', dependencia:'Pueblos Indígenas', poblacion:'Pueblos Indígenas', estrategia:'Reconocimiento y transmisión de saberes', breve:'Protección de la autonomía, la cultura y los derechos territoriales de los pueblos indígenas.', tags:'indigenas,saberes,autonomia'}, 
    {id:'rrom', nombre:'Kumpania en Movimiento', viceministerio:'Étnicos', dependencia:'Pueblo Rrom', poblacion:'Pueblo Rrom (Gitanos)', estrategia:'Reconocimiento y transmisión de saberes', breve:'Preservación de la identidad cultural, nomadismo y garantía de derechos del pueblo Rrom.', tags:'rrom,cultura,derechos,saberes'}, 
    {id:'campesinado', nombre:'Tierra y Territorio Campesino', viceministerio:'Étnicos', dependencia:'Campesinado', poblacion:'Población campesina', estrategia:'Condiciones para vida digna', breve:'Reconocimiento del campesinado como sujeto de derechos, acceso a tierra y producción sostenible.', tags:'campesinado,tierra,soberania-alimentaria'}, 
    {id:'justicia-racial', nombre:'Justicia Étnica y Racial', viceministerio:'Étnicos', dependencia:'NARP', poblacion:'Pueblos y comunidades étnicas', estrategia:'Cambio cultural', breve:'Acciones afirmativas y de reparación histórica para combatir el racismo estructural.', tags:'antirracismo,reparacion,justicia'}, 
    {id:'pactos-territoriales', nombre:'Pactos Territoriales por la Igualdad', viceministerio:'Pobreza', dependencia:'Superación de la Pobreza', poblacion:'Territorios PDET y ZOMAC', estrategia:'Alianzas público-populares y comunitarias', breve:'Articulación de inversiones y acciones para cerrar brechas de desigualdad en territorios excluidos.', tags:'territorio,paz,inversion'}, 
    {id:'datos-igualdad', nombre:'Observatorio de la Igualdad', viceministerio:'Pobreza', dependencia:'Superación de la Pobreza', poblacion:'Academia, sociedad civil, entidades', estrategia:'Gobernanza interna', breve:'Generación y análisis de datos para orientar políticas públicas de igualdad y equidad.', tags:'datos,investigacion,politica-publica'}, 
    {id:'cultura-paz', nombre:'Cultura para la Paz y la No Estigmatización', viceministerio:'Juventud', dependencia:'Jóvenes en Paz', poblacion:'Toda la población colombiana', estrategia:'Cambio cultural', breve:'Estrategias de comunicación y pedagogía para transformar imaginarios que perpetúan la desigualdad.', tags:'cultura,paz,pedagogia'}
];

// --- DATA: Procesos (Detailed Text) ---
const PROCESS_DEFINITIONS = {
    estrategicos: [
        { title: 'Gestión de Saberes y Conocimientos', desc: 'Definir y establecer los lineamientos, metodologías e instrumentos necesarios para orientar la ruta estratégica del Ministerio de la Igualdad y la Equidad, garantizando la creación y ejecución efectiva de políticas públicas que promuevan la equidad y la igualdad, generando así un valor público alineado con los objetivos de gobierno.' },
        { title: 'Gestión Estratégica', desc: 'Liderar la planeación institucional, el seguimiento a metas y la asignación de recursos.' },
        { title: 'Gestión de Proyectos', desc: 'Formular y estructurar los proyectos dirigidos a organismos públicos, privados e internacionales, teniendo en cuenta el ámbito de competencia del Ministerio y, en especial, el enfoque territorial, a través de las metodologías establecidas.' },
        { title: 'Relacionamiento Ciudadano', desc: 'Implementar políticas que fortalezcan la relación entre el Estado y las ciudadanías, a través de un modelo de relacionamiento integral, transparente, participativo e incluyente.' },
        { title: 'Comunicaciones', desc: 'Fortalecer la gestión comunicativa del Ministerio de Igualdad y Equidad mediante la planificación, implementación, seguimiento y mejora continua de lineamientos, estrategias y acciones.' },
        { title: 'Cooperación Internacional', desc: 'Gestionar alianzas estratégicas y convenios con agencias de cooperación, sector privado y organismos internacionales en temas de Igualdad y Equidad.' },
        { title: 'Gestión TICs', desc: 'Gestionar los servicios, información y recursos tecnológicos de forma segura, mediante la formulación, desarrollo y evaluación de políticas, lineamientos, planes, programas y proyectos.' }
    ],
    misionales: [
        // --- TOP (Pink) ---
        { 
            title: 'Formulación de Políticas Públicas, Diseño de Programas y Gestión de Recursos', 
            desc: 'Diseñar e implementar políticas públicas, programas y gestión de recursos con enfoque diferencial e interseccional que contribuyan a reducir las brechas de desigualdad y promuevan la igualdad y equidad en los territorios y poblaciones objetivo del Ministerio.',
            highlight: true 
        },
        // --- MIDDLE (White - Viceministries) ---
        { title: 'Atención a Juventudes', desc: 'Implementar políticas, programas y estrategias transformadoras que promuevan el desarrollo integral, la convivencia pacífica y el cierre de brechas para la juventud.' },
        { title: 'Atención a Mujeres', desc: 'Diseñar e implementar políticas públicas, programas y gestión de recursos con enfoque diferencial e interseccional que contribuyan a reducir las brechas de desigualdad.' },
        { title: 'Poblaciones y Territorios Excluidos', desc: 'Implementar programas, proyectos y estrategias, para impulsar el goce efectivo de los derechos de las poblaciones y territorios marginados y excluidos.' },
        { title: 'Pueblos Étnicos y Campesinos', desc: 'Formular de manera efectiva las intervenciones, proyectos y acciones transformadoras dirigidas a pueblos y comunidades negras, afrodescendientes, raizales, palenqueras, indígenas, Rrom y campesinas.' },
        { title: 'Discapacidad y LGBTIQ+', desc: 'Diseñar, implementar y coordinar políticas, programas y estrategias integrales que garanticen los derechos, promuevan la inclusión plena y aseguren el goce efectivo de derechos.' },
        // --- BOTTOM (Pink) ---
        { 
            title: 'Articulación Intersectorial', 
            desc: 'Establecer y mantener mecanismos efectivos de coordinación, comunicación y colaboración entre el Ministerio de Igualdad y Equidad y las diversas entidades gubernamentales, organizaciones de la sociedad civil y comunidades, para potenciar el impacto de las políticas de igualdad y equidad a nivel nacional y territorial.',
            highlight: true 
        },
        { 
            title: 'Traslado, Seguimiento y Evaluación', 
            desc: 'Gestionar eficientemente el traslado de proyectos, realizar un seguimiento sistemático de la ejecución de programas y recursos, y evaluar el impacto de las acciones transformadoras del Ministerio, para asegurar el cumplimiento de las metas de igualdad y equidad.',
            highlight: true 
        },
        { 
            title: 'Gestión del Conocimiento e Innovación Público Popular', 
            desc: 'Desarrollar, integrar y difundir conocimientos e innovaciones que contribuyan a la identificación y superación de las desigualdades, valorando tanto el saber científico como el popular y ancestral, para informar y mejorar las políticas y programas del Ministerio de Igualdad y Equidad.',
            highlight: true 
        }
    ],
    apoyo: [
        { title: 'Talento Humano', desc: 'Administrar de manera integral el ciclo de vida laboral de las servidoras y servidores públicos del Ministerio, mediante la gestión de los planes, programas, estrategias y acciones que garanticen su vinculación, desarrollo, bienestar, evaluación periódica y retiro.' },
        { title: 'Gestión Contractual', desc: 'Adquirir los bienes, obras y/o servicios requeridos por el Ministerio durante cada vigencia, elaborando, modificando y liquidando los contratos y/o convenios necesarios.' },
        { title: 'Gestión Jurídica', desc: 'Establecer las políticas de gestión sobre las cuales se enmarca la actividad litigiosa y producción normativa, además de representar judicial y extrajudicialmente a la Entidad.' },
        { title: 'Logística y Recursos', desc: 'Gestionar los bienes, obras, locaciones e infraestructura y servicios administrativos, de mantenimiento y asistencia logística necesarios para el funcionamiento adecuado.' },
        { title: 'Gestión Documental', desc: 'Orientar y coordinar los lineamientos administrativos y técnicos relacionados con la planificación, procesamiento, gestión y organización de la documentación.' },
        { title: 'Gestión Financiera', desc: 'Gestionar los recursos públicos asignados al Ministerio, a través del desarrollo de actividades de planificación y control presupuestario, la administración de tesorería y la contabilidad pública.' }
    ],
    evaluacion: [
        { title: 'Control Interno Disciplinario', desc: 'Garantizar el cumplimiento del régimen disciplinario del Ministerio, a través de la determinación de la responsabilidad disciplinaria de personas en el servicio público y exservidores públicos.' },
        { title: 'Aseguramiento del Control Interno', desc: 'Articular la información proveniente de diversas fuentes internas y externas para fomentar el mejoramiento y control de la gestión institucional, asesorando a la alta dirección mediante la aplicación de técnicas modernas de auditoría, seguimiento y evaluación independiente.' }
    ]
};

// --- DATA: Organigrama Detailed ---
interface OrgNode {
    title: string;
    description: string;
    dependencies: { name: string; desc: string }[]; 
}

const ORG_DATA: Record<string, OrgNode> = {
      'entidades': { 
          title: 'Entidades Adscritas y Vinculadas', 
          description: 'Organismos con autonomía administrativa pero vinculados al sector para coordinar políticas públicas específicas.', 
          dependencies: [
              { name: 'Instituto Colombiano de Bienestar Familiar (ICBF)', desc: 'Entidad adscrita encargada de la protección integral de la primera infancia, la niñez, la adolescencia y el bienestar de las familias.' },
              { name: 'Instituto Nacional para Sordos (INSOR)', desc: 'Promueve, desde el sector educación, el desarrollo e inclusión social de la población sorda colombiana.' },
              { name: 'Instituto Nacional para Ciegos (INCI)', desc: 'Trabaja para garantizar los derechos de los colombianos con discapacidad visual en términos de inclusión y accesibilidad.' }
          ] 
      },
      'territoriales': { 
          title: 'Direcciones Territoriales', 
          description: 'Brazos operativos del Ministerio en las regiones (Art. 17, D.1075). Su función es aterrizar la política de igualdad en los territorios.', 
          dependencies: [
              { name: '32 Direcciones Departamentales', desc: 'Una por departamento. Se encargan de la articulación con gobiernos locales, organizaciones sociales y la implementación de la oferta institucional en territorio.' }
          ] 
      },
      'secretaria': { 
          title: 'Secretaría General', 
          description: 'Motor administrativo del Ministerio (Art. 43, D.1075). Gestiona el talento humano, los recursos financieros, físicos y la contratación.', 
          dependencies: [
              { name: 'Subdirección Administrativa y Financiera', desc: 'Art. 44. Administra el presupuesto, la contabilidad, la tesorería y los recursos físicos (bienes, servicios generales) de la entidad.' },
              { name: 'Subdirección de Contratación', desc: 'Art. 45. Lidera los procesos contractuales (licitaciones, convenios) asegurando transparencia y cumplimiento legal en la adquisición de bienes y servicios.' },
              { name: 'Subdirección de Talento Humano', desc: 'Art. 46. Gestiona el bienestar, la nómina, la capacitación y el desarrollo de los servidores públicos del Ministerio.' }
          ] 
      },
      'despacho': { 
          title: 'Despacho de la Ministra', 
          description: 'Cabeza del Sector Administrativo (Art. 6, D.1075). Define las directrices políticas, representa legalmente al Ministerio y lidera el consejo directivo.', 
          dependencies: [
              { name: 'Viceministerios', desc: 'Lideran la formulación técnica de políticas por población.' },
              { name: 'Secretaría General', desc: 'Soporte administrativo y financiero.' },
              { name: 'Oficinas Asesoras', desc: 'Órganos de consejo y control directo.' }
          ] 
      },
      'asesoras': { 
          title: 'Oficinas Asesoras', 
          description: 'Órganos de apoyo directo al Despacho (Arts. 7-16, D.1075) que brindan soporte transversal en temas estratégicos y de control.', 
          dependencies: [
              { name: 'Oficina de Saberes y Conocimientos Estratégicos', desc: 'Art. 7. Gestiona la investigación, innovación y el diálogo de saberes ancestrales y modernos para fundamentar las políticas.' },
              { name: 'Oficina de Proyectos para la Igualdad', desc: 'Art. 8. Estructura y viabiliza los proyectos de inversión del Ministerio para asegurar recursos y ejecución técnica.' },
              { name: 'Oficina de Tecnologías de la Información', desc: 'Art. 9. Lidera la transformación digital, la infraestructura tecnológica y los sistemas de información de la entidad.' },
              { name: 'Oficina Asesora de Comunicaciones', desc: 'Art. 10. Define la estrategia de comunicación pública, prensa y relacionamiento con medios para visibilizar la gestión.' },
              { name: 'Oficina de Control Interno', desc: 'Art. 11. (Nuestra Oficina). Evalúa de forma independiente la gestión y el control interno (3ra Línea de Defensa).' },
              { name: 'Oficina de Control Interno Disciplinario', desc: 'Art. 12. Adelanta procesos disciplinarios contra servidores en primera instancia, garantizando el debido proceso.' },
              { name: 'Oficina Asesora de Planeación', desc: 'Art. 13. Lidera la planeación estratégica, el presupuesto y el seguimiento a metas institucionales.' },
              { name: 'Oficina Jurídica', desc: 'Art. 14. Blinda jurídicamente a la entidad, emite conceptos, revisa actos administrativos y defiende judicialmente al Ministerio.' },
              { name: 'Oficina de Alianzas Estratégicas', desc: 'Art. 15. Gestiona la cooperación internacional y las relaciones con el sector privado para apalancar recursos.' },
              { name: 'Oficina de Relacionamiento con la Ciudadanía', desc: 'Art. 16. Gestiona el servicio al ciudadano, PQRSDF y mecanismos de participación.' }
          ] 
      },
      'vm-mujeres': { 
          title: 'Viceministerio de las Mujeres', 
          description: 'Lidera la política pública de equidad de género y derechos de las mujeres (Art. 18, D.1075).', 
          dependencies: [
              { name: 'Dirección para la Prevención de Violencias', desc: 'Art. 19. Estrategias para erradicar violencias basadas en género.' },
              { name: 'Dirección para la Autonomía Económica', desc: 'Art. 20. Fomento al emprendimiento y empleo digno para mujeres.' },
              { name: 'Dirección para la Garantía de Derechos', desc: 'Art. 21. Transversalización del enfoque de género en el Estado.' },
              { name: 'Dirección para Mujeres en Actividades Sexuales Pagas', desc: 'Art. 22. Garantía de derechos de esta población específica.' },
              { name: 'Dirección para Madres Cabeza de Familia', desc: 'Art. 23. Programas de apoyo social y económico.' }
          ] 
      },
      'vm-juventud': { 
          title: 'Viceministerio de las Juventudes', 
          description: 'Articula el Subsistema de Juventud y programas como Jóvenes en Paz (Art. 24, D.1075).', 
          dependencies: [
              { name: 'Dirección para el Goce Efectivo de los Derechos', desc: 'Art. 25. Ciudadanía juvenil y participación.' },
              { name: 'Dirección de Barrismo Social', desc: 'Art. 26. Convivencia y paz en el fútbol.' },
              { name: 'Dirección de Jóvenes en Paz', desc: 'Art. 27. Programa de transferencias y educación para jóvenes en riesgo.' }
          ] 
      },
      'vm-poblaciones': { 
          title: 'Viceministerio para las Poblaciones y Territorios Excluidos', 
          description: 'Superación de la pobreza y atención a vulnerables (Art. 28, D.1075).', 
          dependencies: [
              { name: 'Dirección para la Superación de la Pobreza', desc: 'Art. 29. Estrategias contra el hambre y la pobreza extrema.' },
              { name: 'Dirección de Cuidado', desc: 'Art. 30. Sistema Nacional de Cuidado.' },
              { name: 'Dirección para la Población Migrante', desc: 'Art. 31. Inclusión de población migrante.' },
              { name: 'Dirección de Acceso Igualitario al Agua', desc: 'Art. 32. Soluciones de agua en territorios marginados.' },
              { name: 'Dirección para Personas en Situación de Calle', desc: 'Art. 33. Dignidad y derechos para habitantes de calle.' },
              { name: 'Dirección para Personas Mayores', desc: 'Art. 34. Protección a la vejez.' }
          ] 
      },
      'vm-diversidades': { 
          title: 'Viceministerio de las Diversidades', 
          description: 'Garantía de derechos de población diversa y con discapacidad (Art. 35, D.1075).', 
          dependencies: [
              { name: 'Dirección para la Garantía de Derechos LGBTIQ+', desc: 'Art. 36. Política pública LGBTIQ+.' },
              { name: 'Dirección para los Derechos de Personas con Discapacidad', desc: 'Art. 37. Inclusión y accesibilidad.' }
          ] 
      },
      'vm-etnicos': { 
          title: 'Viceministerio de Pueblos Étnicos y Campesinos', 
          description: 'Derechos de grupos étnicos y campesinado (Art. 38, D.1075).', 
          dependencies: [
              { name: 'Dirección para Comunidades NARP', desc: 'Art. 39. Negras, Afro, Raizales y Palenqueras.' },
              { name: 'Dirección para Pueblos Indígenas', desc: 'Art. 40. Derechos y territorio indígena.' },
              { name: 'Dirección para el Pueblo Rrom', desc: 'Art. 41. Protección cultural Gitana.' },
              { name: 'Dirección para el Campesinado', desc: 'Art. 42. Derechos del campesinado como sujeto de derechos.' }
          ] 
      }
};

// --- DATA: Timeline ---
const TIMELINE_DATA = [
    { id: 1, title: 'Ley 2281: Creación', year: 'Ene 2023', content: 'La ley crea el Ministerio de Igualdad y Equidad, define su objeto y competencias; es la base legal que luego desarrolla el Gobierno. (Referencia dentro del Decreto 1075, que explicita que actúa “en virtud de las facultades del artículo 189” y la Ley 2294/2023 del PND).' },
    { id: 2, title: 'Ley 2294: PND 2022-26', year: 'May 2023', content: 'El Plan Nacional de Desarrollo “Colombia potencia mundial de la vida” incorpora compromisos y macrometas sectoriales (Jóvenes en Paz, Mujeres autónomas, Una sociedad para el cuidado) que condicionan la planeación sectorial del Ministerio.' },
    { id: 3, title: 'Decreto 1075: Estructura', year: 'Jun 2023', content: 'Define despachos, 5 viceministerios y 20 direcciones, oficinas y Secretaría General, y asigna funciones. El mismo decreto indica la sujeción al PND 2294/2023.' },
    { id: 4, title: 'Decreto 1076: Planta (P1)', year: 'Jun 2023', content: 'Establece los componentes iniciales de la planta de personal del Ministerio. Es uno de los dos decretos de planta expedidos en 2023. (Mencionado en los considerandos de la Resolución 22 de 2023).' },
    { id: 5, title: 'Resolución 003: Manual v1', year: 'Ago 2023', content: 'Adopta la primera versión del Manual Específico de Funciones y Competencias Laborales del Ministerio, sirviendo como antecedente para futuras actualizaciones.' },
    { id: 6, title: 'Resolución 668: Enfoques', year: 'Sep 2024', content: 'Institucionaliza los 8 enfoques (derechos, territorial, diferencial, étnico-racial/antirracista, género, interseccional, justicia ambiental y curso de vida) como el eje articulador de toda la política pública del sector.' },
    { id: 7, title: 'Resolución 669: Estrategias', year: 'Sep 2024', content: 'Establece las 11 estrategias programáticas para materializar los objetivos del Ministerio y medir su impacto (alianzas público-populares, iniciativas productivas, etc.).' },
    { id: 8, title: 'PEI v2: Aprobación', year: 'Oct 2024', content: 'Formaliza la plataforma estratégica (misión, visión, objetivos) y el despliegue estratégico con dos objetivos estratégicos y uno operacional, alineados al PND y a los ODS.' }
];

interface StrategicModuleProps {
    onComplete: (score: number) => void;
    onTimeUpdate: (seconds: number) => void;
    saveProgress: () => void;
    data: QuizState;
}

export const StrategicModule: React.FC<StrategicModuleProps> = ({ onComplete, onTimeUpdate, saveProgress, data }) => {
  const [activeTab, setActiveTab] = useState<'menu' | string>('menu');
  
  // Specific view states
  const [enfoqueSubTab, setEnfoqueSubTab] = useState('enfoques');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Todo');
  const [selectedOrgNode, setSelectedOrgNode] = useState<string | null>(null);
  const [selectedSubNode, setSelectedSubNode] = useState<{name: string, desc: string} | null>(null); 
  const [selectedTimelineItem, setSelectedTimelineItem] = useState<any>(null);
  const [selectedProcess, setSelectedProcess] = useState<{title: string, desc: string} | null>(null);

  // Time tracking logic
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const onTimeUpdateRef = useRef(onTimeUpdate);
  const saveProgressRef = useRef(saveProgress);

  // Update refs when props change to avoid stale closures in the interval
  useEffect(() => {
      onTimeUpdateRef.current = onTimeUpdate;
      saveProgressRef.current = saveProgress;
  }, [onTimeUpdate, saveProgress]);

  // Start/Stop Timer based on visibility/mounting
  useEffect(() => {
      // Function to push time update
      const pushTime = () => {
          const now = Date.now();
          const diffSeconds = Math.floor((now - startTimeRef.current) / 1000);
          if (diffSeconds > 0) {
              onTimeUpdateRef.current(diffSeconds);
              startTimeRef.current = now; // Reset start marker
          }
      };

      // Interval to update UI every second (optional, could update only every 10s)
      timerRef.current = window.setInterval(pushTime, 2000); // Update every 2 seconds

      // Cleanup on unmount or tab switch
      return () => {
          if (timerRef.current) window.clearInterval(timerRef.current);
          pushTime(); // Save remaining time
          saveProgressRef.current(); // Push to DB on unmount
      };
  }, []);

  const filteredPrograms = useMemo(() => {
    let result = PROGRAMAS_DATA;
    if (activeFilter !== 'Todo') {
        if (activeFilter === 'Saberes') result = result.filter(p => p.tags.includes('saberes'));
        else result = result.filter(p => p.viceministerio === activeFilter || (activeFilter === 'Pobreza' && ['Pobreza'].includes(p.viceministerio)));
    }
    if (searchQuery) {
        const q = searchQuery.toLowerCase();
        result = result.filter(p => 
            p.nombre.toLowerCase().includes(q) || 
            p.poblacion.toLowerCase().includes(q) || 
            p.tags.toLowerCase().includes(q)
        );
    }
    return result;
  }, [searchQuery, activeFilter]);

  const sections = [
    { id: 'intro', label: 'Introducción', icon: Target, desc: 'Misión, Visión y Objetivos' },
    { id: 'normative', label: 'Normativa', icon: Scale, desc: 'Leyes y Decretos Clave' },
    { id: 'process', label: 'Procesos', icon: Layout, desc: 'Mapa de Procesos (MIPG)' },
    { id: 'structure', label: 'Estructura', icon: Users, desc: 'Organigrama interactivo' },
    { id: 'approaches', label: 'Enfoques', icon: Map, desc: 'Enfoques Transversales' },
    { id: 'programs', label: 'Programas', icon: FileText, desc: 'Portafolio de 24 Programas' },
    { id: 'quiz', label: 'Evaluación', icon: CheckCircle, desc: 'Valida tus conocimientos' }
  ];

  const currentSectionIndex = sections.findIndex(s => s.id === activeTab);
  
  const handleNext = () => {
      if (currentSectionIndex < sections.length - 1) {
          setActiveTab(sections[currentSectionIndex + 1].id);
          window.scrollTo(0,0);
      }
  };

  const handlePrev = () => {
      if (currentSectionIndex > 0) {
          setActiveTab(sections[currentSectionIndex - 1].id);
          window.scrollTo(0,0);
      }
  };
  
  const progressPercentage = activeTab === 'menu' ? 0 : Math.round(((currentSectionIndex + 1) / sections.length) * 100);

  // Time Calculation
  const timeSpent = data.timeSpentSeconds || 0;
  const minTime = data.minTimeSeconds || 60; // Default 1 min if not set
  const timeLeft = Math.max(0, minTime - timeSpent);
  const isQuizLocked = timeLeft > 0 && !data.completed;

  // --- RENDER MENU GRID ---
  if (activeTab === 'menu') {
      return (
        <div className="space-y-6 animate-fade-in pb-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-6 border-b border-gray-100 dark:border-slate-800">
                <div>
                    <Badge type="brand">Módulo 1</Badge>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mt-2">Plataforma Estratégica</h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 mt-2">Identidad, estructura y portafolio del Ministerio.</p>
                </div>
                <div className="hidden md:flex items-center gap-4">
                    <div className="bg-white dark:bg-slate-800 px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm flex items-center gap-3">
                        <div className={`p-2 rounded-full ${timeLeft > 0 ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}>
                            {timeLeft > 0 ? <Clock size={20} /> : <CheckCircle size={20} />}
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-bold text-slate-400">Tiempo de Estudio</p>
                            <p className="font-mono font-bold text-slate-800 dark:text-white">
                                {Math.floor(timeSpent / 60)}m {timeSpent % 60}s <span className="text-slate-400 text-xs">/ {Math.floor(minTime/60)}m req</span>
                            </p>
                        </div>
                    </div>
                    <MinistryLogo variant="horizontal" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sections.map((section) => {
                    const Icon = section.icon;
                    const isLockedQuiz = section.id === 'quiz' && isQuizLocked;
                    
                    return (
                        <button 
                            key={section.id}
                            onClick={() => !isLockedQuiz && setActiveTab(section.id)}
                            disabled={isLockedQuiz}
                            className={`p-6 rounded-2xl border transition-all text-left group relative overflow-hidden
                                ${isLockedQuiz 
                                    ? 'bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-slate-800 opacity-75 cursor-not-allowed' 
                                    : 'bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 hover:border-brand-300 hover:shadow-lg'
                                }
                            `}
                        >
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform
                                ${isLockedQuiz ? 'bg-gray-200 text-gray-500' : 'bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 group-hover:scale-110'}
                            `}>
                                {isLockedQuiz ? <Lock size={24} /> : <Icon size={24} />}
                            </div>
                            <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-1">{section.label}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{section.desc}</p>
                            
                            {isLockedQuiz && (
                                <div className="absolute inset-0 bg-white/50 dark:bg-black/50 flex items-center justify-center backdrop-blur-[1px]">
                                    <span className="bg-black/70 text-white text-xs font-bold px-3 py-1 rounded-full">
                                        Faltan {Math.ceil(timeLeft / 60)} min
                                    </span>
                                </div>
                            )}
                        </button>
                    )
                })}
            </div>
            
            <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex gap-3 text-blue-800 dark:text-blue-200 text-sm border border-blue-100 dark:border-blue-800">
                <Info className="shrink-0" />
                <p>
                    <b>Nota:</b> Para garantizar la apropiación del conocimiento, el examen final se desbloqueará después de <b>{Math.ceil(minTime/60)} minutos</b> de estudio en este módulo.
                </p>
            </div>
        </div>
      );
  }

  // --- RENDER DETAIL VIEW ---
  const activeSection = sections.find(s => s.id === activeTab);
  
  return (
    <div className="space-y-6 animate-fade-in pb-24">
        {/* Detail Header with Enhanced Navigation */}
        <div className="sticky top-0 bg-gray-50/95 dark:bg-slate-900/95 backdrop-blur z-30 pt-4 pb-2 border-b border-gray-200 dark:border-slate-700 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3 w-full md:w-auto">
                    {/* Back to Menu Button */}
                    <button 
                        onClick={() => setActiveTab('menu')} 
                        className="flex items-center gap-2 p-2 px-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-brand-600 transition-colors shadow-sm"
                        title="Volver al Menú"
                    >
                        <Grid size={18} />
                        <span className="text-sm font-bold hidden sm:inline">Menú</span>
                    </button>

                    {/* Quick Jump Dropdown */}
                    <div className="relative group flex-1 md:flex-none">
                        <select 
                            value={activeTab} 
                            onChange={(e) => {
                                const newVal = e.target.value;
                                if (newVal === 'quiz' && isQuizLocked) {
                                    alert(`Debes estudiar ${Math.ceil(timeLeft/60)} minutos más para habilitar la evaluación.`);
                                    return;
                                }
                                setActiveTab(newVal);
                                window.scrollTo(0,0);
                            }}
                            className="appearance-none w-full md:w-64 pl-9 pr-8 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-sm font-bold text-slate-700 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none cursor-pointer shadow-sm"
                        >
                            {sections.map(s => (
                                <option key={s.id} value={s.id} disabled={s.id === 'quiz' && isQuizLocked}>
                                    {s.label} {s.id === 'quiz' && isQuizLocked ? '(Bloqueado)' : ''}
                                </option>
                            ))}
                        </select>
                        <div className="absolute left-3 top-2.5 text-brand-600 dark:text-brand-400 pointer-events-none">
                            {activeSection?.icon && <activeSection.icon size={16} />}
                        </div>
                        <ChevronDown size={16} className="absolute right-3 top-2.5 text-slate-400 pointer-events-none" />
                    </div>
                </div>
                
                <div className="flex items-center gap-4">
                     <div className="hidden md:block text-xs font-mono bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded">
                        {Math.floor(timeSpent / 60)}:{String(timeSpent % 60).padStart(2, '0')}
                     </div>
                     <div className="hidden md:flex items-center text-xs text-slate-400">
                        Tema {currentSectionIndex + 1} de {sections.length}
                    </div>
                </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full h-1 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-brand-500 transition-all duration-500 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                ></div>
            </div>
        </div>

        {/* Content Area (Full Width) */}
        <div className="min-h-[500px]">
            {/* 1. INTRODUCCIÓN */}
            {activeTab === 'intro' && (
                <div className="grid md:grid-cols-2 gap-6 animate-fade-in">
                        <Card title="¿Qué es el Ministerio?" className="bg-gradient-to-br from-white to-brand-50/50 dark:from-slate-800 dark:to-slate-800">
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                                Entidad del Gobierno nacional encargada de <b>diseñar, formular, adoptar, dirigir, coordinar y ejecutar políticas, planes y programas</b> para eliminar desigualdades, garantizar el derecho a la igualdad y articular la política de Estado en igualdad y equidad.
                            </p>
                            <div className="grid grid-cols-3 gap-2 text-center">
                                <div className="p-3 bg-white dark:bg-slate-700 rounded-xl border border-brand-100 dark:border-brand-900/30 shadow-sm">
                                    <span className="block text-2xl font-extrabold text-brand-600 dark:text-brand-400">5</span>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase">Viceministerios</span>
                                </div>
                                <div className="p-3 bg-white dark:bg-slate-700 rounded-xl border border-brand-100 dark:border-brand-900/30 shadow-sm">
                                    <span className="block text-2xl font-extrabold text-brand-600 dark:text-brand-400">20</span>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase">Direcciones</span>
                                </div>
                                <div className="p-3 bg-white dark:bg-slate-700 rounded-xl border border-brand-100 dark:border-brand-900/30 shadow-sm">
                                    <span className="block text-2xl font-extrabold text-brand-600 dark:text-brand-400">24</span>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase">Programas</span>
                                </div>
                            </div>
                        </Card>
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Target size={80}/></div>
                                <h3 className="text-lg font-bold text-brand-700 dark:text-brand-400 mb-2 relative z-10">Misión</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-300 relative z-10">
                                    Formular, implementar, coordinar y evaluar políticas, planes, programas y proyectos para avanzar en la garantía del derecho a la igualdad y la equidad, con enfoque de derechos, de género, diferencial, étnico-antirracista, interseccional y territorial.
                                </p>
                            </div>
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><BookOpen size={80}/></div>
                                <h3 className="text-lg font-bold text-brand-600 dark:text-brand-400 mb-2 relative z-10">Visión</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-300 relative z-10">
                                    Ser un hito permanente en la historia de Colombia que transforma, de forma concreta, la vida de poblaciones y territorios históricamente excluidos, haciendo tangible la igualdad y la equidad.
                                </p>
                            </div>
                        </div>
                </div>
            )}

            {/* 2. NORMATIVA */}
            {activeTab === 'normative' && (
                <div className="animate-fade-in">
                    <Card title="Línea de Tiempo y Normativa Clave">
                        <p className="text-slate-500 mb-6 text-sm">Hitos normativos que marcan la creación y estructuración del Ministerio. Haz clic para ver detalles.</p>
                        <div className="relative max-w-2xl mx-auto space-y-6 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-brand-200 before:to-transparent">
                            {TIMELINE_DATA.map((item, i) => (
                                <div key={item.id} className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group cursor-pointer`} onClick={() => setSelectedTimelineItem(item)}>
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-brand-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 font-bold text-brand-600 text-xs hover:bg-brand-600 hover:text-white transition-colors">
                                        {i + 1}
                                    </div>
                                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-brand-200 transition-all">
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{item.year}</div>
                                        <h3 className="font-bold text-slate-800 dark:text-white text-sm">{item.title}</h3>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                    {selectedTimelineItem && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedTimelineItem(null)}>
                            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl max-w-lg w-full relative shadow-2xl" onClick={e => e.stopPropagation()}>
                                <button className="absolute top-4 right-4 text-slate-400 hover:text-red-500" onClick={() => setSelectedTimelineItem(null)}><X /></button>
                                <span className="text-xs font-bold bg-brand-100 text-brand-800 px-2 py-1 rounded uppercase">{selectedTimelineItem.year}</span>
                                <h3 className="text-2xl font-bold mt-2 mb-4 text-slate-900 dark:text-white">{selectedTimelineItem.title}</h3>
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{selectedTimelineItem.content}</p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* 3. PROCESOS (UPDATED DESIGN) */}
            {activeTab === 'process' && (
                <div className="animate-fade-in">
                    <Card title="Esquema de Procesos (Interactivo)">
                        <p className="text-sm text-slate-500 mb-6">Explore cómo funciona el Ministerio. Pase el cursor sobre cada componente para ver su función.</p>
                        
                        {/* Enfoques Transversales Bar */}
                        <div className="w-full bg-brand-50 dark:bg-brand-900/30 text-brand-800 dark:text-brand-300 font-bold text-center py-3 rounded-lg mb-6 border border-brand-200 dark:border-brand-800 shadow-sm">
                            Enfoques Transversales
                        </div>

                        {/* 3 Columns Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            
                            {/* Estratégicos */}
                            <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-4 flex flex-col gap-3">
                                <h4 className="font-bold text-slate-800 dark:text-white text-center mb-2">Procesos Estratégicos</h4>
                                {PROCESS_DEFINITIONS.estrategicos.map((p, i) => (
                                    <button 
                                        key={i} 
                                        onClick={() => setSelectedProcess(p)}
                                        className="w-full py-3 px-2 text-center rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700 border border-slate-100 dark:border-slate-600 hover:shadow-md transition-all text-xs font-semibold text-slate-600 dark:text-slate-300"
                                    >
                                        {p.title}
                                    </button>
                                ))}
                            </div>

                            {/* Misionales */}
                            <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-4 flex flex-col gap-3">
                                <h4 className="font-bold text-slate-800 dark:text-white text-center mb-2">Procesos Misionales</h4>
                                {PROCESS_DEFINITIONS.misionales.map((p, i) => {
                                    // Use 'highlight' property to style special processes
                                    const isHighlighted = (p as any).highlight;
                                    return (
                                        <button 
                                            key={i} 
                                            onClick={() => setSelectedProcess(p)}
                                            className={`w-full py-3 px-2 text-center rounded-lg transition-all text-xs font-bold hover:shadow-md border
                                                ${isHighlighted 
                                                    ? 'bg-brand-600 text-white border-brand-600 hover:bg-brand-700 shadow-brand-200' 
                                                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                                                }`}
                                        >
                                            {p.title}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Apoyo */}
                            <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-4 flex flex-col gap-3">
                                <h4 className="font-bold text-slate-800 dark:text-white text-center mb-2">Procesos de Apoyo</h4>
                                {PROCESS_DEFINITIONS.apoyo.map((p, i) => (
                                    <button 
                                        key={i} 
                                        onClick={() => setSelectedProcess(p)}
                                        className="w-full py-3 px-2 text-center rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700 border border-slate-100 dark:border-slate-600 hover:shadow-md transition-all text-xs font-semibold text-slate-600 dark:text-slate-300"
                                    >
                                        {p.title}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Bottom Control Bars (Interactive) */}
                        <div className="flex flex-col gap-3">
                             {PROCESS_DEFINITIONS.evaluacion.map((p, i) => (
                                <button 
                                    key={i}
                                    onClick={() => setSelectedProcess(p)}
                                    className="w-full bg-brand-50 dark:bg-brand-900/30 text-brand-800 dark:text-brand-300 font-bold py-3 rounded-lg border border-brand-200 dark:border-brand-800 hover:bg-brand-100 dark:hover:bg-brand-900/50 transition-colors shadow-sm text-sm"
                                >
                                    {p.title}
                                </button>
                             ))}
                        </div>

                    </Card>

                    {/* PROCESS MODAL */}
                    {selectedProcess && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setSelectedProcess(null)}>
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl max-w-lg w-full relative shadow-2xl border-t-4 border-brand-500" onClick={e => e.stopPropagation()}>
                                <button className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors" onClick={() => setSelectedProcess(null)}>
                                    <X size={24} />
                                </button>
                                
                                <div className="mb-4">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">Detalle del Proceso</span>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-2 leading-tight pr-8">{selectedProcess.title}</h3>
                                </div>
                                
                                <div className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-xl border border-gray-100 dark:border-slate-700">
                                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                        {selectedProcess.desc}
                                    </p>
                                </div>

                                <div className="mt-6 flex justify-end">
                                    <button 
                                        onClick={() => setSelectedProcess(null)}
                                        className="px-4 py-2 bg-slate-800 text-white text-sm font-bold rounded-lg hover:bg-slate-700 transition-colors"
                                    >
                                        Entendido
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* 4. ESTRUCTURA */}
            {activeTab === 'structure' && (
                <div className="animate-fade-in">
                    <Card title="Estructura Orgánica (Decreto 1075)">
                        <p className="text-sm text-slate-500 mb-8">Haga clic en una dependencia para ver sus funciones y componentes.</p>
                        
                        <div className="flex flex-col items-center gap-12">
                            {/* Nivel Superior */}
                            <div className="flex justify-center">
                                <div 
                                    className={`w-64 p-4 rounded-xl text-center font-bold text-sm cursor-pointer transition-all shadow-md border hover:-translate-y-1 ${selectedOrgNode === 'entidades' ? 'bg-slate-800 text-white ring-4 ring-slate-200' : 'bg-slate-200 text-slate-700 border-slate-300'}`} 
                                    onClick={() => setSelectedOrgNode('entidades')}
                                >
                                    Entidades Adscritas
                                </div>
                            </div>

                            {/* Nivel Medio - Ramas y Despacho */}
                            <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-8 relative w-full max-w-4xl">
                                
                                {/* Rama Izquierda */}
                                <div className="flex flex-col gap-4 w-full md:w-1/3 items-center md:items-end">
                                    <div 
                                        className={`w-full max-w-[220px] p-3 rounded-xl text-center font-bold text-xs cursor-pointer transition-all shadow border hover:-translate-y-1 bg-white dark:bg-slate-800 ${selectedOrgNode === 'territoriales' ? 'border-brand-500 ring-2 ring-brand-200' : 'border-gray-200'}`} 
                                        onClick={() => setSelectedOrgNode('territoriales')}
                                    >
                                        Oficinas Territoriales
                                    </div>
                                    <div 
                                        className={`w-full max-w-[220px] p-3 rounded-xl text-center font-bold text-xs cursor-pointer transition-all shadow border hover:-translate-y-1 bg-white dark:bg-slate-800 ${selectedOrgNode === 'secretaria' ? 'border-brand-500 ring-2 ring-brand-200' : 'border-gray-200'}`} 
                                        onClick={() => setSelectedOrgNode('secretaria')}
                                    >
                                        Secretaría General
                                    </div>
                                </div>

                                {/* Centro - Despacho */}
                                <div className="relative z-10">
                                    <div 
                                        className={`w-64 p-6 rounded-xl text-center font-extrabold text-white shadow-xl cursor-pointer transition-all hover:-translate-y-1 border-4 ${selectedOrgNode === 'despacho' ? 'bg-slate-900 border-white ring-4 ring-brand-200' : 'bg-brand-600 border-brand-400'}`} 
                                        onClick={() => setSelectedOrgNode('despacho')}
                                    >
                                        Despacho de la Ministra
                                    </div>
                                </div>

                                {/* Rama Derecha */}
                                <div className="flex flex-col gap-4 w-full md:w-1/3 items-center md:items-start">
                                    <div 
                                        className={`w-full max-w-[220px] p-3 rounded-xl text-center font-bold text-xs cursor-pointer transition-all shadow border hover:-translate-y-1 bg-white dark:bg-slate-800 ${selectedOrgNode === 'asesoras' ? 'border-brand-500 ring-2 ring-brand-200' : 'border-gray-200'}`} 
                                        onClick={() => setSelectedOrgNode('asesoras')}
                                    >
                                        Oficinas Asesoras
                                    </div>
                                </div>
                            </div>

                            {/* Nivel Inferior - Viceministerios */}
                            <div className="w-full">
                                <div className="h-8 w-px bg-slate-300 mx-auto mb-4"></div>
                                <div className="flex flex-wrap justify-center gap-3">
                                    {[
                                        {k: 'vm-mujeres', l: 'Viceministerio de las Mujeres'}, 
                                        {k: 'vm-juventud', l: 'Viceministerio de las Juventudes'}, 
                                        {k: 'vm-poblaciones', l: 'Viceministerio para las Poblaciones y Territorios Excluidos'}, 
                                        {k: 'vm-diversidades', l: 'Viceministerio de las Diversidades'}, 
                                        {k: 'vm-etnicos', l: 'Viceministerio de Pueblos Étnicos y Campesinos'}
                                    ].map(vm => (
                                        <div 
                                            key={vm.k} 
                                            className={`p-3 rounded-lg text-xs font-bold cursor-pointer transition-all border shadow-sm hover:-translate-y-1 ${selectedOrgNode === vm.k ? 'bg-slate-800 text-white' : 'bg-gray-50 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-gray-200'}`} 
                                            onClick={() => setSelectedOrgNode(vm.k)}
                                        >
                                            {vm.l}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* MODAL NIVEL 1: DETALLE DE DEPENDENCIA PRINCIPAL */}
                    {selectedOrgNode && ORG_DATA[selectedOrgNode] && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedOrgNode(null)}>
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl max-w-4xl w-full relative shadow-2xl flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                                <button className="absolute top-4 right-4 text-slate-400 hover:text-red-500" onClick={() => setSelectedOrgNode(null)}><X /></button>
                                
                                <h3 className="text-xl font-bold mb-2 text-brand-700 dark:text-brand-400 border-b pb-2 pr-8 break-words">{ORG_DATA[selectedOrgNode].title}</h3>
                                <div className="overflow-y-auto pr-2 custom-scrollbar">
                                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">{ORG_DATA[selectedOrgNode].description}</p>
                                    
                                    {ORG_DATA[selectedOrgNode].dependencies && (
                                        <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-xl">
                                            <h4 className="text-xs font-bold uppercase text-slate-500 mb-3 flex items-center gap-2">
                                                <Grid size={14}/> Componentes / Dependencias
                                            </h4>
                                            <p className="text-[10px] text-slate-400 mb-3 italic">Haga clic en una dependencia para ver sus funciones específicas.</p>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {ORG_DATA[selectedOrgNode].dependencies.map((dep, idx) => (
                                                    <button 
                                                        key={idx} 
                                                        onClick={() => setSelectedSubNode(dep)}
                                                        className="w-full text-left p-3 rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 hover:border-brand-400 hover:shadow-md transition-all group flex items-start justify-between h-full"
                                                    >
                                                        <span className="text-xs font-bold text-slate-700 dark:text-slate-200 leading-tight">{dep.name}</span>
                                                        <ArrowUpRight size={14} className="text-slate-300 group-hover:text-brand-500 transition-colors shrink-0 ml-2 mt-0.5" />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* MODAL NIVEL 2: DETALLE DE SUB-DEPENDENCIA (POP-UP SOBRE POP-UP) */}
                    {selectedSubNode && (
                        <div 
                            className="fixed inset-0 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 animate-fade-in" 
                            style={{ zIndex: 60 }}
                            onClick={() => setSelectedSubNode(null)}
                        >
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl max-w-2xl w-full relative shadow-2xl border-2 border-brand-100 dark:border-slate-600 transform scale-100 transition-transform flex flex-col max-h-[85vh]" onClick={e => e.stopPropagation()}>
                                <div className="flex-none mb-4">
                                    <button className="absolute top-3 right-3 p-1 bg-gray-100 dark:bg-slate-800 rounded-full text-slate-400 hover:text-red-500 transition-colors" onClick={() => setSelectedSubNode(null)}>
                                        <X size={20} />
                                    </button>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/30 px-2 py-1 rounded">Funciones Específicas</span>
                                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-2 leading-tight pr-8 break-words">{selectedSubNode.name}</h3>
                                </div>
                                
                                <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                                        {selectedSubNode.desc}
                                    </p>
                                </div>

                                <div className="flex-none mt-4">
                                    <button 
                                        onClick={() => setSelectedSubNode(null)}
                                        className="w-full py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-sm rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                    >
                                        Volver
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* 5. ENFOQUES */}
            {activeTab === 'approaches' && (
                <div className="animate-fade-in">
                    <Card>
                        <div className="flex gap-2 mb-6 border-b border-gray-100 dark:border-slate-700 pb-4">
                            <button onClick={() => setEnfoqueSubTab('enfoques')} className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${enfoqueSubTab === 'enfoques' ? 'bg-brand-600 text-white' : 'bg-gray-100 dark:bg-slate-700 text-slate-600'}`}>Enfoques Transversales</button>
                            <button onClick={() => setEnfoqueSubTab('estrategias')} className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${enfoqueSubTab === 'estrategias' ? 'bg-brand-600 text-white' : 'bg-gray-100 dark:bg-slate-700 text-slate-600'}`}>Estrategias</button>
                        </div>
                        {enfoqueSubTab === 'enfoques' ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                                {[{n:'01', t:'Enfoque de Derechos', d:'Sitúa a las personas como titulares de derechos.'}, {n:'02', t:'Enfoque Territorial', d:'Ecosistema social, geográfico y cultural.'}, {n:'03', t:'Enfoque Diferencial', d:'Respuestas adaptadas a barreras específicas.'}, {n:'04', t:'Enfoque Étnico-Racial', d:'Protege la diversidad y supera el racismo.'}, {n:'05', t:'Enfoque de Género', d:'Elimina desigualdades de mujeres y LGBTIQ+.'}, {n:'06', t:'Enfoque Interseccional', d:'Reconoce múltiples ejes de discriminación.'}, {n:'07', t:'Justicia Ambiental', d:'Respuesta justa a la crisis climática.'}, {n:'08', t:'Curso de Vida', d:'Desarrollo humano como continuo.'}].map(item => (
                                    <div key={item.n} className="text-center p-2">
                                        <div className="w-12 h-12 rounded-full bg-brand-500 text-white font-bold text-lg flex items-center justify-center mx-auto mb-3 shadow-lg ring-4 ring-brand-50 dark:ring-brand-900">{item.n}</div>
                                        <h3 className="font-bold text-brand-700 dark:text-brand-400 text-sm mb-1">{item.t}</h3>
                                        <p className="text-xs text-slate-500">{item.d}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {['Alianzas Público-Populares', 'Iniciativas Productivas', 'Infraestructura para Cerrar Brechas', 'Espacios para la Juntanza', 'Cambio Cultural y Erradicación', 'Abordaje Psicosocial', 'Transmisión de Saberes', 'Ecosistema Institucional', 'Gobernanza Interna', 'Condiciones para Vida Digna', 'Restablecimiento de Derechos'].map((e, i) => (
                                    <div key={i} className="p-4 rounded-xl border border-gray-100 dark:border-slate-700 hover:border-brand-300 hover:shadow-md transition-all">
                                        <h3 className="font-bold text-slate-800 dark:text-white text-sm mb-1">{e}</h3>
                                        <p className="text-xs text-slate-500">Estrategia transversal para el cierre de brechas.</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                </div>
            )}

            {/* 6. PROGRAMAS */}
            {activeTab === 'programs' && (
                <div className="animate-fade-in">
                    <Card title="Portafolio Programático (24)">
                        <div className="flex flex-col md:flex-row gap-4 mb-6">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-3 text-slate-400" size={18} />
                                <input type="text" placeholder="Buscar por nombre, población..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 focus:ring-2 focus:ring-brand-500 outline-none text-sm text-slate-900 dark:text-white"/>
                            </div>
                            <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
                                {['Todo', 'Mujeres', 'Juventud', 'Pobreza', 'Diversidades', 'Étnicos', 'Saberes'].map(f => (
                                    <button key={f} onClick={() => setActiveFilter(f)} className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${activeFilter === f ? 'bg-brand-600 text-white border-brand-600' : 'bg-white dark:bg-slate-800 text-slate-600 border-gray-200 dark:border-slate-600 hover:bg-gray-50'}`}>{f}</button>
                                ))}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredPrograms.length > 0 ? filteredPrograms.map(p => (
                                <div key={p.id} className="border border-gray-200 dark:border-slate-700 rounded-xl p-4 bg-white dark:bg-slate-800 hover:border-brand-300 transition-all group">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-slate-800 dark:text-white">{p.nombre}</h3>
                                        <span className="text-[10px] uppercase font-bold bg-gray-100 dark:bg-slate-700 text-slate-500 px-2 py-1 rounded">{p.viceministerio}</span>
                                    </div>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{p.breve}</p>
                                    <details className="group/details">
                                        <summary className="text-xs font-bold text-brand-600 cursor-pointer flex items-center gap-1">Más información <ChevronDown size={12} className="group-open/details:rotate-180 transition-transform"/></summary>
                                        <div className="mt-3 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg text-xs space-y-2 animate-fade-in">
                                            <p><b>Población:</b> {p.poblacion}</p>
                                            <p><b>Dependencia:</b> {p.dependencia}</p>
                                            <p><b>Estrategia:</b> {p.estrategia}</p>
                                            <div className="flex flex-wrap gap-1 mt-1">{p.tags.split(',').map(t => (<span key={t} className="bg-white dark:bg-slate-600 px-1.5 py-0.5 rounded border border-gray-200 dark:border-slate-500 text-[10px] text-slate-500 dark:text-slate-300">#{t}</span>))}</div>
                                        </div>
                                    </details>
                                </div>
                            )) : (
                                <div className="col-span-2 text-center py-12 text-slate-400"><Info className="mx-auto mb-2 opacity-50" size={32} /><p>No se encontraron programas.</p></div>
                            )}
                        </div>
                    </Card>
                </div>
            )}

            {/* 7. EVALUACIÓN */}
            {activeTab === 'quiz' && (
                <div className="animate-fade-in">
                    {!isQuizLocked ? (
                        <Quiz 
                            questions={[
                                { id: 1, question: "¿Cuál ley creó el Ministerio de Igualdad y Equidad?", options: ["Ley 100", "Ley 2281 de 2023", "Ley 87 de 1993"], correctAnswer: 1 },
                                { id: 2, question: "¿Cuántos programas estratégicos conforman el portafolio actual?", options: ["10", "24", "32"], correctAnswer: 1 },
                                { id: 3, question: "¿Qué decreto define la estructura orgánica del Ministerio?", options: ["Decreto 1075 de 2023", "Decreto 1499", "Decreto 1600"], correctAnswer: 0 },
                                { id: 4, question: "¿Quién ejerce la tercera línea de defensa en el MIPG?", options: ["Planeación", "Control Interno", "Talento Humano"], correctAnswer: 1 },
                                { id: 5, question: "¿Cuál es el enfoque que protege la diversidad y supera el racismo?", options: ["Interseccional", "Étnico-Racial", "Territorial"], correctAnswer: 1 }
                            ]}
                            onComplete={onComplete}
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center p-12 text-center">
                            <div className="w-20 h-20 bg-gray-100 dark:bg-slate-700 text-gray-400 rounded-full flex items-center justify-center mb-6">
                                <Lock size={40} />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Evaluación Bloqueada</h2>
                            <p className="text-slate-600 dark:text-slate-400 max-w-md">
                                Debes completar el tiempo mínimo de estudio para acceder a la evaluación.
                            </p>
                            <div className="mt-6 bg-amber-50 dark:bg-amber-900/20 px-6 py-3 rounded-lg border border-amber-200 dark:border-amber-800">
                                <p className="text-amber-800 dark:text-amber-200 font-bold">
                                    Tiempo restante: {Math.ceil(timeLeft / 60)} minutos
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
        
        {/* Navigation Footer */}
        <div className="fixed bottom-6 left-0 right-0 flex justify-center z-20 pointer-events-none">
            <div className="flex gap-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md p-2 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 pointer-events-auto">
                <button 
                    onClick={handlePrev} 
                    disabled={currentSectionIndex <= 0}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                >
                    <ArrowLeft size={16} /> Anterior
                </button>
                <div className="w-px bg-gray-300 dark:bg-slate-600"></div>
                <button 
                    onClick={handleNext}
                    disabled={currentSectionIndex >= sections.length - 1}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/30 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                >
                    Siguiente <ArrowRight size={16} />
                </button>
            </div>
        </div>
    </div>
  );
};
