import React from 'react';
import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-[#1E293B] bg-[#070B14]/80 py-8 px-4 text-center">
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center gap-2">
        <p className="text-sm font-medium text-slate-300 flex items-center justify-center gap-1.5 flex-wrap">
          <span>Made with</span>
          <Heart className="w-4 h-4 text-red-500 fill-red-500 inline-block animate-pulse" />
          <span>by</span>
          <span className="font-semibold text-purple-300 tracking-wide">
            Md.Rafiul Islam Akanda
          </span>
        </p>
        <p className="text-xs text-slate-500">
          Official University CGPA Calculator &bull; Standard 4.00 Grade Point Scale
        </p>
      </div>
    </footer>
  );
}
