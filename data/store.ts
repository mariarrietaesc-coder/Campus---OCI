 import { User, ProgressMap } from '../types';

  const AUTHORIZED_USERS: User[] = [
      {
          id: 'demo',
          name: 'Usuario Demo',
          email: 'demo@campus-oci.com',
          role: 'Visitante',
          isActive: true,
          password: 'demo1234'
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

      authenticate: async (
          email: string,
          password?: string
      ): Promise<{ success: boolean; user?: User; message?: string }> => {
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
              console.error('Error reading progress', e);
          }
          return EMPTY_PROGRESS;
      },

      saveProgress: async (email: string, progress: ProgressMap) => {
          try {
              const key = `oci_progress_${email}`;
              localStorage.setItem(key, JSON.stringify(progress));
          } catch (e) {
              console.error('Error saving progress', e);
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
              throw new Error('El usuario ya existe.');
          }
          AUTHORIZED_USERS.push(user);
      }
  };
