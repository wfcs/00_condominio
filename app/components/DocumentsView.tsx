
import React, { useState } from 'react';
import { User, Document, DocumentCategory } from '../types';

interface DocumentsViewProps {
    user: User;
    documents: Document[];
    setDocuments: React.Dispatch<React.SetStateAction<Document[]>>;
}

const DocumentsView: React.FC<DocumentsViewProps> = ({ user, documents, setDocuments }) => {
    const [filter, setFilter] = useState<DocumentCategory | 'Todos'>('Todos');
    const [search, setSearch] = useState('');
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Form states
    const [uploadTitle, setUploadTitle] = useState('');
    const [uploadCategory, setUploadCategory] = useState<DocumentCategory>('Outros');
    const [uploadDescription, setUploadDescription] = useState('');
    const [uploadFile, setUploadFile] = useState<File | null>(null);

    const categories: (DocumentCategory | 'Todos')[] = [
        'Todos',
        'Ata de Assembleia',
        'Balancete',
        'Contrato',
        'Regulamento',
        'Comprovante',
        'Outros'
    ];

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const maxSize = 10 * 1024 * 1024; // 10MB

            if (file.size > maxSize) {
                alert('Arquivo muito grande! Tamanho máximo: 10MB');
                return;
            }

            setUploadFile(file);
            if (!uploadTitle) {
                setUploadTitle(file.name.replace(/\.[^/.]+$/, ''));
            }
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!uploadFile) {
            alert('Selecione um arquivo');
            return;
        }

        setUploading(true);

        try {
            // Simular upload (em produção, usar Supabase Storage)
            const fakeUrl = URL.createObjectURL(uploadFile);

            const newDoc: Document = {
                id: `doc-${Date.now()}`,
                clientId: user.clientId,
                title: uploadTitle,
                category: uploadCategory,
                description: uploadDescription,
                fileUrl: fakeUrl,
                fileName: uploadFile.name,
                fileSize: uploadFile.size,
                uploadedBy: user.id,
                uploadedByName: user.name,
                uploadedAt: new Date(),
                tags: []
            };

            setDocuments([newDoc, ...documents]);

            // Reset form
            setUploadTitle('');
            setUploadCategory('Outros');
            setUploadDescription('');
            setUploadFile(null);
            setShowUploadModal(false);

        } catch (error) {
            alert('Erro ao fazer upload do documento');
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = (docId: string) => {
        if (window.confirm('Tem certeza que deseja excluir este documento?')) {
            setDocuments(documents.filter(d => d.id !== docId));
        }
    };

    const handleDownload = (doc: Document) => {
        const link = document.createElement('a');
        link.href = doc.fileUrl;
        link.download = doc.fileName;
        link.click();
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const getCategoryIcon = (category: DocumentCategory): string => {
        const icons: Record<DocumentCategory, string> = {
            'Ata de Assembleia': 'fa-file-contract',
            'Balancete': 'fa-file-invoice-dollar',
            'Contrato': 'fa-file-signature',
            'Regulamento': 'fa-book',
            'Comprovante': 'fa-receipt',
            'Outros': 'fa-file'
        };
        return icons[category];
    };

    const filteredDocs = documents
        .filter(d => filter === 'Todos' || d.category === filter)
        .filter(d =>
            d.title.toLowerCase().includes(search.toLowerCase()) ||
            d.description?.toLowerCase().includes(search.toLowerCase())
        );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-brand-1 dark:text-white tracking-tight">
                        📄 Gestão de Documentos
                    </h1>
                    <p className="text-slate-500 dark:text-brand-4 font-medium mt-1">
                        Armazene e organize documentos importantes do condomínio
                    </p>
                </div>
                <button
                    onClick={() => setShowUploadModal(true)}
                    className="bg-brand-1 dark:bg-brand-3 text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-2 transition-all flex items-center gap-2 shadow-lg shadow-brand-1/10"
                >
                    <i className="fa-solid fa-plus"></i>
                    Novo Documento
                </button>
            </div>

            {/* Search and Filters */}
            <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-slate-100 dark:border-white/10 shadow-sm space-y-4">
                <div className="relative">
                    <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar documentos..."
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-brand-3/20"
                    />
                </div>

                <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === cat
                                    ? 'bg-brand-1 dark:bg-brand-3 text-white shadow-md'
                                    : 'bg-white dark:bg-white/5 text-slate-600 dark:text-brand-4 border border-slate-200 dark:border-white/10 hover:border-brand-3'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Documents List */}
            <div className="space-y-3">
                {filteredDocs.length === 0 ? (
                    <div className="bg-white dark:bg-white/5 p-12 rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/10 text-center">
                        <i className="fa-solid fa-folder-open text-6xl text-slate-300 dark:text-slate-600 mb-4"></i>
                        <p className="text-slate-400 dark:text-slate-500 font-medium">
                            {search || filter !== 'Todos'
                                ? 'Nenhum documento encontrado com os filtros aplicados'
                                : 'Nenhum documento cadastrado ainda'}
                        </p>
                    </div>
                ) : (
                    filteredDocs.map(doc => (
                        <div
                            key={doc.id}
                            className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-slate-100 dark:border-white/10 shadow-sm hover:border-brand-4 dark:hover:border-brand-3 transition-all"
                        >
                            <div className="flex items-start gap-4">
                                {/* Icon */}
                                <div className="shrink-0 w-14 h-14 bg-brand-5 dark:bg-brand-2/20 text-brand-1 dark:text-brand-3 rounded-xl flex items-center justify-center">
                                    <i className={`fa-solid ${getCategoryIcon(doc.category)} text-2xl`}></i>
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg font-bold text-brand-1 dark:text-white truncate">
                                        {doc.title}
                                    </h3>
                                    <div className="flex flex-wrap items-center gap-2 mt-1 text-xs">
                                        <span className="px-2 py-1 bg-brand-5 dark:bg-brand-2/20 text-brand-2 dark:text-brand-4 rounded-lg font-bold">
                                            {doc.category}
                                        </span>
                                        <span className="text-slate-400">•</span>
                                        <span className="text-slate-500 dark:text-slate-400 font-medium">
                                            {formatFileSize(doc.fileSize)}
                                        </span>
                                        <span className="text-slate-400">•</span>
                                        <span className="text-slate-500 dark:text-slate-400 font-medium">
                                            {doc.fileName}
                                        </span>
                                    </div>
                                    {doc.description && (
                                        <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                                            {doc.description}
                                        </p>
                                    )}
                                    <div className="flex items-center gap-2 mt-3 text-xs text-slate-400 dark:text-slate-500">
                                        <i className="fa-solid fa-user"></i>
                                        <span>{doc.uploadedByName}</span>
                                        <span>•</span>
                                        <i className="fa-solid fa-calendar"></i>
                                        <span>{doc.uploadedAt.toLocaleDateString('pt-BR')}</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col gap-2">
                                    <button
                                        onClick={() => window.open(doc.fileUrl, '_blank')}
                                        className="px-4 py-2 bg-brand-1 dark:bg-brand-3 text-white rounded-lg text-sm font-bold hover:opacity-90 transition-opacity flex items-center gap-2"
                                    >
                                        <i className="fa-solid fa-eye"></i>
                                        Ver
                                    </button>
                                    <button
                                        onClick={() => handleDownload(doc)}
                                        className="px-4 py-2 bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-white rounded-lg text-sm font-bold hover:bg-slate-200 dark:hover:bg-white/20 transition-colors flex items-center gap-2"
                                    >
                                        <i className="fa-solid fa-download"></i>
                                        Baixar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(doc.id)}
                                        className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm font-bold hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors flex items-center gap-2"
                                    >
                                        <i className="fa-solid fa-trash"></i>
                                        Excluir
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-brand-1 dark:text-white">
                                    📤 Novo Documento
                                </h2>
                                <button
                                    onClick={() => setShowUploadModal(false)}
                                    className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-white hover:bg-slate-200 dark:hover:bg-white/20 transition-colors flex items-center justify-center"
                                >
                                    <i className="fa-solid fa-xmark"></i>
                                </button>
                            </div>

                            <form onSubmit={handleUpload} className="space-y-6">
                                {/* File Upload */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                        Arquivo *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            onChange={handleFileChange}
                                            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                                            className="hidden"
                                            id="file-upload"
                                            required
                                        />
                                        <label
                                            htmlFor="file-upload"
                                            className="flex items-center justify-center gap-3 p-8 border-2 border-dashed border-slate-300 dark:border-white/20 rounded-2xl cursor-pointer hover:border-brand-3 dark:hover:border-brand-3 transition-colors bg-slate-50 dark:bg-white/5"
                                        >
                                            <i className="fa-solid fa-cloud-arrow-up text-3xl text-brand-3"></i>
                                            <div className="text-center">
                                                <p className="font-bold text-brand-1 dark:text-white">
                                                    {uploadFile ? uploadFile.name : 'Clique para selecionar arquivo'}
                                                </p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                    PDF, DOC, XLS, Imagens (máx. 10MB)
                                                </p>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                        Título *
                                    </label>
                                    <input
                                        type="text"
                                        value={uploadTitle}
                                        onChange={(e) => setUploadTitle(e.target.value)}
                                        placeholder="Ex: Ata Assembleia Janeiro 2024"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-brand-3/20"
                                        required
                                    />
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                        Categoria *
                                    </label>
                                    <select
                                        value={uploadCategory}
                                        onChange={(e) => setUploadCategory(e.target.value as DocumentCategory)}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-brand-3/20"
                                        required
                                    >
                                        {categories.filter(c => c !== 'Todos').map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                        Descrição (opcional)
                                    </label>
                                    <textarea
                                        value={uploadDescription}
                                        onChange={(e) => setUploadDescription(e.target.value)}
                                        placeholder="Adicione uma descrição ou observações sobre o documento..."
                                        rows={3}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-brand-3/20 resize-none"
                                    />
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="submit"
                                        disabled={uploading}
                                        className="flex-1 bg-brand-1 dark:bg-brand-3 text-white py-3 rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {uploading ? (
                                            <>
                                                <i className="fa-solid fa-spinner fa-spin"></i>
                                                Enviando...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fa-solid fa-upload"></i>
                                                Enviar Documento
                                            </>
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowUploadModal(false)}
                                        className="px-6 py-3 bg-slate-100 dark:bg-white/10 rounded-xl font-bold text-slate-600 dark:text-white hover:bg-slate-200 dark:hover:bg-white/20 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DocumentsView;
