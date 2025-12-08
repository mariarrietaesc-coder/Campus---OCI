
import { User, ProgressMap } from '../types';

// --- DATA SEED (Lista Real de Usuarios - OCI MinIgualdad) ---
// La contraseña inicial por defecto es el número de identificación.

const INITIAL_USERS: User[] = [
    // LÍDERES / ADMINISTRADORES
    {
        id: '79283776',
        name: 'Raúl Eduardo González Garzón',
        email: 'rgonzalez@minigualdad.gov.co',
        role: 'Jefe Oficina de Control Interno',
        isAdmin: true,
        isActive: true,
        password: '79283776'
    },
    {
        id: '1026258878',
        name: 'María Isabel Arrieta Escobar',
        email: 'marrieta@minigualdad.gov.co',
        role: 'Equipo OCI',
        isAdmin: true, // Asumo que tú también necesitas acceso admin para pruebas
        isActive: true,
        password: '1026258878'
    },
    // EQUIPO / FUNCIONARIOS / CONTRATISTAS
    {
        id: '1022326111',
        name: 'Diego Armando Perdomo Suárez',
        email: 'dperdomo@minigualdad.gov.co',
        role: 'Equipo OCI',
        isAdmin: false,
        isActive: true,
        password: '1022326111'
    },
    {
        id: '1077441909',
        name: 'Keymy Yulitza Murillo Mosquera',
        email: 'kmurillo@minigualdad.gov.co',
        role: 'Equipo OCI',
        isAdmin: false,
        isActive: true,
        password: '1077441909'
    },
    {
        id: '1010206067',
        name: 'Shannen Karime Quevedo Rivera',
        email: 'squevedo@minigualdad.gov.co',
        role: 'Equipo OCI',
        isAdmin: false,
        isActive: true,
        password: '1010206067'
    },
    {
        id: '1109387829',
        name: 'Camila Andrea Morales Viña',
        email: 'cmorales@minigualdad.gov.co',
        role: 'Equipo OCI',
        isAdmin: false,
        isActive: true,
        password: '1109387829'
    },
    {
        id: '1024490849',
        name: 'Angela María Roa Cajiao',
        email: 'aroa@minigualdad.gov.co',
        role: 'Equipo OCI',
        isAdmin: false,
        isActive: true,
        password: '1024490849'
    },
    {
        id: '1012378909',
        name: 'Cindy Katherine Herrera Ramos',
        email: 'ckherrera@minigualdad.gov.co',
        role: 'Equipo OCI',
        isAdmin: false,
        isActive: true,
        password: '1012378909'
    },
    {
        id: '1075288018',
        name: 'Yurany Stefany Galindo Fiero',
        email: 'ygalindo@minigualdad.gov.co',
        role: 'Equipo OCI',
        isAdmin: false,
        isActive: true,
        password: '1075288018'
    },
    {
        id: '51705761',
        name: 'Elsa Margoth Garzón Acosta',
        email: 'egarzon@minigualdad.gov.co',
        role: 'Equipo OCI',
        isAdmin: false,
        isActive: true,
        password: '51705761'
    },
    {
        id: '1032480739',
        name: 'Alexandra Rangel Shaw',
        email: 'arangel@minigualdad.gov.co',
        role: 'Equipo OCI',
        isAdmin: false,
        isActive: true,
        password: '1032480739'
    },
    {
        id: '1032391837',
        name: 'Jenny Patricia Arevalo Castiblanco',
        email: 'jarevalo@minigualdad.gov.co',
        role: 'Equipo OCI',
        isAdmin: false,
        isActive: true,
        password: '1032391837'
    },
    {
        id: '79789700',
        name: 'Julián Andrés Colmenares Morales',
        email: 'jacolmenares@minigualdad.gov.co',
        role: 'Equipo OCI',
        isAdmin: false,
        isActive: true,
        password: '79789700'
    },
    {
        id: '1016086531',
        name: 'Viviana Moreno Vargas',
        email: 'vmoreno@minigualdad.gov.co',
        role: 'Equipo OCI',
        isAdmin: false,
        isActive: true,
        password: '1016086531'
    },
    {
        id: '79649746',
        name: 'Basco Germán Ricuarte Guerra',
        email: 'bricaurte@minigualdad.gov.co',
        role: 'Equipo OCI',
        isAdmin: false,
        isActive: true,
        password: '79649746'
    }
];

const EMPTY_PROGRESS: ProgressMap = {
    dashboard: { completed: true, score: 0 },
    strategic: { completed: false, score: 0 },
    mipg: { completed: false, score: 0 },
    competencies: { completed: false, score: 0 },
    standards: { completed: false, score: 0 },
    forensic: { completed: false, score: 0 },
    library: { completed: true, score: 0 },
    assistant: { completed: true, score: 0 },
    tools: { completed: true, score: 0 },
};

// --- STORE LOGIC ---

export const UserStore = {
    // Inicializa la "Base de Datos" en LocalStorage si no existe
    init: () => {
        // En desarrollo/producción simple, siempre recargamos la lista base para asegurar que los nuevos usuarios existan
        // Pero intentamos preservar los datos si ya existen (progreso)
        const storedUsers = localStorage.getItem('oci_db_users');
        if (!storedUsers) {
            localStorage.setItem('oci_db_users', JSON.stringify(INITIAL_USERS));
        } else {
            // Fusión simple: Si agregamos usuarios en el código, asegurarnos de que estén en el LS
            // Esto es un "soft migration" muy básico
            const currentLSUsers: User[] = JSON.parse(storedUsers);
            let needsUpdate = false;
            
            INITIAL_USERS.forEach(initUser => {
                if (!currentLSUsers.find(u => u.email === initUser.email)) {
                    currentLSUsers.push(initUser);
                    needsUpdate = true;
                }
            });

            if (needsUpdate) {
                localStorage.setItem('oci_db_users', JSON.stringify(currentLSUsers));
            }
        }
    },

    getUsers: (): User[] => {
        const data = localStorage.getItem('oci_db_users');
        return data ? JSON.parse(data) : INITIAL_USERS;
    },

    // Buscar usuario por correo y contraseña para Login
    authenticate: (email: string, password?: string): { success: boolean, user?: User, message?: string } => {
        const users = UserStore.getUsers();
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

        if (!user) {
            return { success: false, message: 'Correo no registrado en el Campus.' };
        }

        if (!user.isActive) {
            return { success: false, message: 'Cuenta desactivada. Contacte al administrador.' };
        }

        // Validación de contraseña (que es el número de identificación por defecto)
        // Se hace una comparación simple ya que no estamos encriptando en este prototipo sin backend
        if (password && user.password !== password) {
            return { success: false, message: 'Contraseña incorrecta. Verifique su número de identificación.' };
        }

        return { success: true, user };
    },

    addUser: (newUser: User) => {
        const users = UserStore.getUsers();
        if (users.find(u => u.email === newUser.email)) {
            throw new Error("El usuario ya existe");
        }
        users.push(newUser);
        localStorage.setItem('oci_db_users', JSON.stringify(users));
    },

    updateUser: (updatedUser: User) => {
        const users = UserStore.getUsers();
        const index = users.findIndex(u => u.id === updatedUser.id);
        if (index !== -1) {
            users[index] = updatedUser;
            localStorage.setItem('oci_db_users', JSON.stringify(users));
        }
    },

    // Obtener progreso de un usuario específico
    getProgress: (email: string): ProgressMap => {
        const key = `oci_progress_${email}`;
        const stored = localStorage.getItem(key); // Usamos localStorage para persistencia real
        return stored ? JSON.parse(stored) : EMPTY_PROGRESS;
    },

    // Guardar progreso (llamado desde la App principal)
    saveProgress: (email: string, progress: ProgressMap) => {
        const key = `oci_progress_${email}`;
        localStorage.setItem(key, JSON.stringify(progress));
    }
};
