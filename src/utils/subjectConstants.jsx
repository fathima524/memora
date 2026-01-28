import React from 'react';
import {
    Stethoscope,
    HeartPulse,
    Dna,
    FlaskConical,
    Syringe,
    Microscope,
    ShieldAlert,
    Shield,
    Activity,
    Scissors,
    Baby,
    Eye,
    Thermometer,
    Brain,
    Database
} from 'lucide-react';

export const getSubjectIcon = (name) => {
    const n = name.toLowerCase();
    if (n.includes('anatomy')) return <Stethoscope size={24} />;
    if (n.includes('physiology')) return <HeartPulse size={24} />;
    if (n.includes('biochem')) return <Dna size={24} />;
    if (n.includes('pathology')) return <FlaskConical size={24} />;
    if (n.includes('pharmacol')) return <Syringe size={24} />;
    if (n.includes('microbiology')) return <Microscope size={24} />;
    if (n.includes('forensic')) return <ShieldAlert size={24} />;
    if (n.includes('community') || n.includes('psm')) return <Shield size={24} />;
    if (n.includes('internal medicine') || (n.includes('medicine') && !n.includes('forensic'))) return <Activity size={24} />;
    if (n.includes('surgery')) return <Scissors size={24} />;
    if (n.includes('pediatrics')) return <Baby size={24} />;
    if (n.includes('ophthal')) return <Eye size={24} />;
    if (n.includes('ent') || n.includes('oto')) return <Thermometer size={24} />;
    if (n.includes('obg') || n.includes('gyn') || n.includes('obstetrics')) return <Baby size={24} />;
    if (n.includes('ortho')) return <Activity size={24} />;
    if (n.includes('derma')) return <Activity size={24} />;
    if (n.includes('psychiatry')) return <Brain size={24} />;
    if (n.includes('neuro')) return <Brain size={24} />;
    if (n.includes('radio')) return <Database size={24} />;
    if (n.includes('anaesthesia')) return <Thermometer size={24} />;
    return <Database size={24} />;
};

export const getSubjectImage = (name) => {
    const n = name.toLowerCase();

    // Core Sciences
    if (n.includes('anatomy')) return 'https://images.unsplash.com/photo-1530210124550-912dc1381cb8?q=80&w=2070&auto=format&fit=crop';
    if (n.includes('physiology')) return 'https://images.unsplash.com/photo-1674702693637-330943cdf0a1?q=80&w=1073&auto=format&fit=crop';
    if (n.includes('biochem')) return 'https://images.unsplash.com/photo-1748261347768-a32434751a9a?q=80&w=687&auto=format&fit=crop';

    // Para-clinical
    if (n.includes('patho')) return 'https://images.unsplash.com/photo-1614308460927-5024ba2e1dcb?q=80&w=1170&auto=format&fit=crop';
    if (n.includes('pharm')) return 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=1000';
    if (n.includes('micro')) return 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?q=80&w=1332&auto=format&fit=crop';
    if (n.includes('foren')) return 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80&w=1000';

    // Clinical - Major
    if (n.includes('internal medicine') || (n.includes('medicine') && !n.includes('forensic') && !n.includes('community'))) return 'https://plus.unsplash.com/premium_photo-1661770160867-2c3a5092ec3b?q=80&w=1170&auto=format&fit=crop';
    if (n.includes('surg')) return 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=1000';
    if (n.includes('obg') || n.includes('gyn') || n.includes('obstetrics')) return 'https://plus.unsplash.com/premium_photo-1661606400554-a2055d50ee08?q=80&w=1169&auto=format&fit=crop';
    if (n.includes('ped')) return 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=1000';

    // Specialities
    if (n.includes('ophthal') || n.includes('eye')) return 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1000';
    if (n.includes('ent') || n.includes('oto')) return 'https://plus.unsplash.com/premium_photo-1673958772197-b490555f66c1?q=80&w=687&auto=format&fit=crop';
    if (n.includes('ortho')) return 'https://plus.unsplash.com/premium_photo-1726880466207-d85def51628f?q=80&w=1136&auto=format&fit=crop';
    if (n.includes('derm')) return 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=1000';
    if (n.includes('psych')) return 'https://images.unsplash.com/photo-1518331647614-7a1f04cd34cf?auto=format&fit=crop&q=80&w=1000';
    if (n.includes('radio')) return 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=1000';
    if (n.includes('anaes')) return 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=1000';
    if (n.includes('neuro')) return 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&q=80&w=1000';
    if (n.includes('community') || n.includes('psm')) return 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&q=80&w=1000';

    // Default medical/clinical background
    return 'https://plus.unsplash.com/premium_photo-1681996348432-1be4193201f1?q=80&w=1170&auto=format&fit=crop';
};
