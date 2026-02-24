import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
    label: string;
    value: string | number;
    icon: LucideIcon;
    delay?: number;
}

export function StatCard({ label, value, icon: Icon, delay = 0 }: StatCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            whileHover={{ scale: 1.05 }}
            className="relative overflow-hidden rounded-2xl p-6 shadow-lg transition-all duration-300 bg-gradient-to-r from-indigo-600 to-violet-600 text-white group cursor-default"
        >
            <div className="relative z-10 flex flex-col items-start">
                <p className="text-sm font-medium text-white/80 mb-1">{label}</p>
                <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
            </div>

            <div className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 opacity-70 group-hover:opacity-100 transition-opacity">
                <Icon className="w-6 h-6 text-white" />
            </div>

            {/* Decorative Glow */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
        </motion.div>
    );
}
