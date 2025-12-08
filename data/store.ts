
import { User, ProgressMap } from '../types';

// --- DATA SEED (Lista Inicial de Usuarios) ---
// Aquí puedes agregar los correos reales de los contratistas y funcionarios.
const INITIAL_USERS: User[] = [
    {
        id: 'admin',
        name: 'Administrador OCI',
        email: 'admin@minigualdad.gov.co',
        role: 'Administrador del Sistema',
        isAdmin: true,
        isActive: true,
        password: 'admin' // En un app real, esto iría hasheado
    },
    {
        id: 'jefe',
        name: 'Raúl Eduardo González Garzón',
        email: 'jefe.oci@minigualdad.gov.co',
        role: 'Jefe Oficina de Control Interno',
        isAdmin: true,
        isActive: true
    },
    {
        id: 'func1',
        name: 'Funcionario Prueba',
        email: 'funcionario@minigualdad.gov.co',
        role: 'Auditor Senior',
        isAdmin: false,
        isActive: true
    },
    {
        id: 'cont1',
        name: 'Contratista Prueba',
        email: 'contratista@minigualdad.gov.co',
        role: 'Apoyo a la Supervisión',
        isAdmin: false,
        isActive: true
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
        if (!localStorage.getItem('oci_db_users')) {
            localStorage.setItem('oci_db_users', JSON.stringify(INITIAL_USERS));
        }
    },

    getUsers: (): User[] => {
        const data = localStorage.getItem('oci_db_users');
        return data ? JSON.parse(data) : INITIAL_USERS;
    },

    // Buscar usuario por correo para Login
    authenticate: (email: string): { success: boolean, user?: User, message?: string } => {
        const users = UserStore.getUsers();
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

        if (!user) {
            return { success: false, message: 'Este correo no está autorizado para acceder al Campus.' };
        }

        if (!user.isActive) {
            return { success: false, message: 'Su cuenta ha sido desactivada. Contacte al administrador.' };
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
