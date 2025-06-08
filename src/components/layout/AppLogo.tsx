import { BrainCircuit } from 'lucide-react';
import Link from 'next/link';

export default function AppLogo() {
  return (
    <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/90 transition-colors">
      <BrainCircuit size={28} />
      <span className="text-xl font-semibold font-headline">StudySmarter</span>
    </Link>
  );
}
