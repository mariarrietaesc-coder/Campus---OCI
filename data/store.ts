
import { User, ProgressMap } from '../types';

const AUTHORIZED_USERS: User[] = [
    {
        id: '79283776',
        name: 'Raúl Eduardo González Garzón',
        email: 'rgonzalez@minigualdad.gov.co',
        role: 'Jefe Oficina de Control Interno',
        isActive: true,
        password: '79283776'
    },
    {
        id: '1026258878',
        name: 'María Isabel Arrieta Escobar',
        email: 'marrieta@minigualdad.gov.co',
        role: 'Equipo OCI',
        isActive: true,
        password: '1026258878'
    },
    {
        id: '1022326111',
        name: 'Diego Armando Perdomo Suárez',
        email: 'dperdomo@minigualdad.gov.co',
        role: 'Equipo OCI',
        isActive: true,
        password: '1022326111'
    },
    {
        id: '1077441909',
        name: 'Keymy Yulitza Murillo Mosquera',
        email: 'kmurillo@minigualdad.gov.co',
        role: 'Equipo OCI',
        isActive: true,
        password: '1077441909'
    },
    {
        id: '1010206067',
        name: 'Shannen Karime Quevedo Rivera',
        email: 'squevedo@minigualdad.gov.co',
        role: 'Equipo OCI',
        isActive: true,
        password: '1010206067'
    },
    {
        id: '1109387829',
        name: 'Camila Andrea Morales Viña',
        email: 'cmorales@minigualdad.gov.co',
        role: 'Equipo OCI',
        isActive: true,
        password: '1109387829'
    },
    {
        id: '1024490849',
        name: 'Angela María Roa Cajiao',
        email: 'aroa@minigualdad.gov.co',
        role: 'Equipo OCI',
        isActive: true,
        password: '1024490849'
    },
    {
        id: '1012378909',
        name: 'Cindy Katherine Herrera Ramos',
        email: 'ckherrera@minigualdad.gov.co',
        role: 'Equipo OCI',
        isActive: true,
        password: '1012378909'
    },
    {
        id: '1075288018',
        name: 'Yurany Stefany Galindo Fiero',
        email: 'ygalindo@minigualdad.gov.co',
        role: 'Equipo OCI',
        isActive: true,
        password: '1075288018'
    },
    {
        id: '51705761',
        name: 'Elsa Margoth Garzón Acosta',
        email: 'egarzon@minigualdad.gov.co',
        role: 'Equipo OCI',
        isActive: true,
        password: '51705761'
    },
    {
        id: '1032480739',
        name: 'Alexandra Rangel Shaw',
        email: 'arangel@minigualdad.gov.co',
        role: 'Equipo OCI',
        isActive: true,
        password: '1032480739'
    },
    {
        id: '1032391837',
        name: 'Jenny Patricia Arevalo Castiblanco',
        email: 'jarevalo@minigualdad.gov.co',
        role: 'Equipo OCI',
        isActive: true,
        password: '1032391837'
    },
    {
        id: '79789700',
        name: 'Julián Andrés Colmenares Morales',
        email: 'jacolmenares@minigualdad.gov.co',
        role: 'Equipo OCI',
        isActive: true,
        password: '79789700'
    },
    {
        id: '1016086531',
        name: 'Viviana Moreno Vargas',
        email: 'vmoreno@minigualdad.gov.co',
        role: 'Equipo OCI',
        isActive: true,
        password: '1016086531'
    },
    {
        id: '79649746',
        name: 'Basco Germán Ricuarte Guerra',
        email: 'bricaurte@minigualdad.gov.co',
        role: 'Equipo OCI',
        isActive: true,
        password: '79649746'
    }
];

const EMPTY_PROGRESS: ProgressMap = {
    dashboard: { completed: true, score: 0, timeSpentSeconds: 0 },
    strategic: { completed: false, score: 0, timeSpentSeconds: 0, minTimeSeconds: 60 }, 
    mipg: { completed: false, score: 0, timeSpentSeconds: 0, minTimeSeconds: 60 },
    competencies: { completed: false, score: 0, timeSpentSeconds: 0 },
    standards: { completed: false, score: 0, timeSpentSeconds: 0, minTimeSeconds: 60 },
    forensic: { completed: false, score: 0, timeSpentSeconds: 0, minTimeSeconds: 60 },
    tools: { completed: true, score: 0, timeSpentSeconds: 0 },
};

export const UserStore = {
    init: async () => {
        return Promise.resolve();
    },

    authenticate: async (email: string, password?: string): Promise<{ success: boolean, user?: User, message?: string }> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        const user = AUTHORIZED_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (!user) {
            return { success: false, message: 'Correo no autorizado para ingresar.' };
        }
        if (password && user.password !== password) {
            return { success: false, message: 'Contraseña incorrecta.' };
        }
        return { success: true, user };
    },

    getProgress: (email: string): ProgressMap => {
        try {
            const key = `oci_progress_${email}`;
            const stored = localStorage.getItem(key);
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (e) {
            console.error("Error reading progress", e);
        }
        return EMPTY_PROGRESS;
    },

    saveProgress: async (email: string, progress: ProgressMap) => {
        try {
            const key = `oci_progress_${email}`;
            localStorage.setItem(key, JSON.stringify(progress));
        } catch (e) {
            console.error("Error saving progress", e);
        }
    },

    getUsers: (): User[] => {
        return [...AUTHORIZED_USERS];
    },

    updateUser: (user: User) => {
        const index = AUTHORIZED_USERS.findIndex(u => u.id === user.id);
        if (index !== -1) {
            AUTHORIZED_USERS[index] = user;
        }
    },

    addUser: (user: User) => {
        if (AUTHORIZED_USERS.some(u => u.email === user.email)) {
            throw new Error("El usuario ya existe.");
        }
        AUTHORIZED_USERS.push(user);
    }
};
