
import React from 'react';

interface GaugeChartProps {
    percentage: number; // 0-100
    label?: string;
    subtitle?: string;
}

const GaugeChart: React.FC<GaugeChartProps> = ({
    percentage,
    label = 'Aderência de Pagamento',
    subtitle = 'Taxa Condominial'
}) => {
    // Garantir que percentage está entre 0 e 100
    const value = Math.min(Math.max(percentage, 0), 100);

    // Calcular rotação do ponteiro (de -90deg a 90deg)
    const rotation = 0 + (value * 1.8);

    // Determinar cor baseada na porcentagem
    const getColor = () => {
        if (value >= 90) return { bg: 'bg-emerald-500', text: 'text-emerald-600', ring: 'ring-emerald-500/20' };
        if (value >= 60) return { bg: 'bg-yellow-500', text: 'text-yellow-600', ring: 'ring-yellow-500/20' };
        return { bg: 'bg-red-500', text: 'text-red-600', ring: 'ring-red-500/20' };
    };

    const colors = getColor();

    return (
        <div className="bg-white dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/10 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50 dark:border-white/10 bg-white dark:bg-transparent">
                <h3 className="font-bold text-brand-1 dark:text-white flex items-center gap-2">
                    <i className="fa-solid fa-chart-simple text-brand-3"></i>
                    {label}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>
            </div>

            <div className="p-8">
                {/* Gauge Container */}
                <div className="relative w-full aspect-square max-w-[280px] mx-auto">
                    {/* Background Arc */}
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
                        {/* Background track */}
                        <circle
                            cx="100"
                            cy="100"
                            r="85"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="12"
                            strokeDasharray="267 267"
                            strokeLinecap="round"
                            className="text-slate-100 dark:text-white/10"
                        />

                        {/* Progress arc */}
                        <circle
                            cx="100"
                            cy="100"
                            r="85"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="12"
                            strokeDasharray={`${(value / 100) * 267} 267`}
                            strokeLinecap="round"
                            className={`${colors.text} transition-all duration-1000 ease-out`}
                            style={{
                                filter: 'drop-shadow(0 0 8px currentColor)',
                                opacity: 0.9
                            }}
                        />
                    </svg>

                    {/* Center Content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-center">
                            <div className={`text-5xl font-black ${colors.text} mb-1`}>
                                {value}%
                            </div>
                            <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                                Pagaram
                            </div>
                        </div>
                    </div>

                    {/* Needle/Pointer */}
                    <div
                        className="absolute top-1/2 left-1/2 w-1 h-20 origin-bottom transition-transform duration-1000 ease-out"
                        style={{
                            transform: `translate(-50%, -100%) rotate(${rotation}deg)`,
                        }}
                    >
                        <div className={`w-full h-full ${colors.bg} rounded-full shadow-lg`}></div>
                        <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 ${colors.bg} rounded-full ring-4 ${colors.ring}`}></div>
                    </div>
                </div>

                {/* Legend */}
                <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                    <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-xl">
                        <div className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-tight">Baixa</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">{'< 60%'}</div>
                    </div>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-xl">
                        <div className="text-xs font-bold text-yellow-600 dark:text-yellow-400 uppercase tracking-tight">Média</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">60-89%</div>
                    </div>
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-xl">
                        <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-tight">Alta</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">≥ 90%</div>
                    </div>
                </div>

                {/* Stats */}
                <div className="mt-6 p-4 bg-slate-50 dark:bg-white/5 rounded-2xl">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400 font-medium">Status Atual:</span>
                        <span className={`font-bold ${colors.text}`}>
                            {value >= 90 ? '✅ Excelente' : value >= 60 ? '⚠️ Atenção' : '❌ Crítico'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GaugeChart;
