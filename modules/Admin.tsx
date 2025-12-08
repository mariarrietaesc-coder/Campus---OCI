
import React, { useState, useEffect } from 'react';
import { UserStore } from '../data/store';
import { User, ProgressMap } from '../types';
import { Card, Badge, MinistryLogo } from '../components/UI';
import { Users, UserPlus, Activity, Power, Search, BarChart2, X, Shield, Lock, Trash2, LogOut } from 'lucide-react';

export const AdminModule: React.FC<{ onLogout: () => void, currentUser: User }> = ({ onLogout, currentUser }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [viewingProgress, setViewingProgress] = useState<{user: User, data: ProgressMap} | null>(null);

    // Form State
    const [newName, setNewName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newRole, setNewRole] = useState('');
    const [newIsAdmin, setNewIsAdmin] = useState(false);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = () => {
        setUsers(UserStore.getUsers());
    };

    const handleToggleStatus = (user: User) => {
        if (user.email === currentUser.email) {
            alert("No puedes desactivar tu propia cuenta.");
            return;
        }
        const updated = { ...user, isActive: !user.isActive };
        UserStore.updateUser(updated);
        loadUsers();
    };

    const handleAddUser = (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const newUser: User = {
                id: Date.now().toString(),
                name: newName,
                email: newEmail,
                role: newRole,
                isActive: true,
                isAdmin: newIsAdmin
            };
            UserStore.addUser(newUser);
            loadUsers();
            setShowAddModal(false);
            setNewName(''); setNewEmail(''); setNewRole(''); setNewIsAdmin(false);
        } catch (error) {
            alert("Error al crear usuario: " + error);
        }
    };

    const handleViewProgress = (user: User) => {
        const progress = UserStore.getProgress(user.email);
        setViewingProgress({ user, data: progress });
    };

    const filteredUsers = users.filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate generic stats
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.isActive).length;

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900 font-sans text-slate-800 dark:text-slate-100 p-6 md:p-12">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div className="flex items-center gap-4">
                    <MinistryLogo variant="horizontal" />
                    <div className="h-8 w-px bg-slate-300 dark:bg-slate-700 mx-2 hidden md:block"></div>
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                            <Shield className="text-brand-600" /> Panel Administrativo
                        </h1>
                        <p className="text-sm text-slate-500">Gestión de Usuarios y Progreso</p>
                    </div>
                </div>
                <button onClick={onLogout} className="flex items-center gap-2 text-slate-500 hover:text-red-600 px-4 py-2 rounded-lg hover:bg-white transition-colors">
                    <LogOut size={18} /> Cerrar Sesión
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-blue-100 text-blue-600"><Users size={24} /></div>
                    <div>
                        <p className="text-sm text-slate-500 font-bold uppercase">Total Usuarios</p>
                        <p className="text-2xl font-black">{totalUsers}</p>
                    </div>
                </Card>
                <Card className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-green-100 text-green-600"><Activity size={24} /></div>
                    <div>
                        <p className="text-sm text-slate-500 font-bold uppercase">Usuarios Activos</p>
                        <p className="text-2xl font-black">{activeUsers}</p>
                    </div>
                </Card>
                <Card className="flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setShowAddModal(true)}>
                    <div className="p-3 rounded-full bg-brand-100 text-brand-600"><UserPlus size={24} /></div>
                    <div>
                        <p className="text-sm text-brand-700 font-bold uppercase">Acción Rápida</p>
                        <p className="text-lg font-bold">Agregar Usuario</p>
                    </div>
                </Card>
            </div>

            {/* User Management Table */}
            <Card title="Directorio de Funcionarios y Contratistas">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-3 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Buscar por nombre, correo o cargo..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-brand-500 outline-none"
                        />
                    </div>
                    <button 
                        onClick={() => setShowAddModal(true)}
                        className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors"
                    >
                        <UserPlus size={18} /> Nuevo Usuario
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-slate-700/50 border-b border-gray-200 dark:border-slate-700 text-slate-500 uppercase text-xs font-bold">
                                <th className="px-4 py-3 rounded-tl-lg">Usuario</th>
                                <th className="px-4 py-3">Rol / Cargo</th>
                                <th className="px-4 py-3">Estado</th>
                                <th className="px-4 py-3 text-right rounded-tr-lg">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                            {filteredUsers.map(user => (
                                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-4 py-3">
                                        <div>
                                            <p className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                                {user.name} 
                                                {user.isAdmin && <span title="Administrador"><Shield size={14} className="text-brand-500" /></span>}
                                            </p>
                                            <p className="text-xs text-slate-500">{user.email}</p>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{user.role}</td>
                                    <td className="px-4 py-3">
                                        <Badge type={user.isActive ? 'success' : 'warning'}>
                                            {user.isActive ? 'Activo' : 'Inactivo'}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button 
                                                onClick={() => handleViewProgress(user)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg tooltip"
                                                title="Ver Progreso"
                                            >
                                                <BarChart2 size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleToggleStatus(user)}
                                                className={`p-2 rounded-lg transition-colors ${user.isActive ? 'text-slate-400 hover:text-red-500 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'}`}
                                                title={user.isActive ? "Desactivar" : "Activar"}
                                            >
                                                <Power size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* ADD USER MODAL */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Registrar Nuevo Usuario</h3>
                            <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600"><X size={24}/></button>
                        </div>
                        <form onSubmit={handleAddUser} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nombre Completo</label>
                                <input required type="text" value={newName} onChange={e => setNewName(e.target.value)} className="w-full p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" placeholder="Ej. Pepito Pérez" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Correo Institucional</label>
                                <input required type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} className="w-full p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" placeholder="usuario@minigualdad.gov.co" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Cargo / Rol</label>
                                <input required type="text" value={newRole} onChange={e => setNewRole(e.target.value)} className="w-full p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" placeholder="Ej. Contratista OCI" />
                            </div>
                            <div className="flex items-center gap-2 pt-2">
                                <input type="checkbox" id="isAdmin" checked={newIsAdmin} onChange={e => setNewIsAdmin(e.target.checked)} className="w-4 h-4 text-brand-600 rounded" />
                                <label htmlFor="isAdmin" className="text-sm font-bold text-slate-700 dark:text-slate-300">Conceder permisos de Administrador</label>
                            </div>
                            <button type="submit" className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 rounded-xl mt-4">Guardar Usuario</button>
                        </form>
                    </div>
                </div>
            )}

            {/* VIEW PROGRESS MODAL */}
            {viewingProgress && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setViewingProgress(null)}>
                    <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-2xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                         <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-4">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{viewingProgress.user.name}</h3>
                                <p className="text-slate-500">{viewingProgress.user.role}</p>
                            </div>
                            <button onClick={() => setViewingProgress(null)} className="text-slate-400 hover:text-slate-600"><X size={24}/></button>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-4">
                            {['strategic', 'mipg', 'standards', 'forensic'].map((modId, idx) => {
                                const modData = viewingProgress.data[modId as any];
                                const isDone = modData?.completed;
                                const score = modData?.score || 0;
                                
                                return (
                                    <div key={modId} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${isDone ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                                                {idx + 1}
                                            </div>
                                            <span className="font-medium capitalize text-slate-700 dark:text-slate-200">
                                                {modId === 'strategic' ? 'Plataforma Estratégica' : 
                                                 modId === 'mipg' ? 'Modelo MIPG' : 
                                                 modId === 'standards' ? 'Normas Globales' : 'Auditoría Forense'}
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            {isDone ? (
                                                <Badge type="success">Completado ({score}%)</Badge>
                                            ) : (
                                                <span className="text-xs text-slate-400 font-bold uppercase">Pendiente</span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};