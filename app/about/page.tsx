import fs from 'fs';
import path from 'path';
import Markdown from 'react-markdown';
import { Leaf } from 'lucide-react';
import Link from 'next/link';

export default async function AboutPage() {
  // Read version from package.json
  const packagePath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const version = packageJson.version;

  // Read CHANGELOG.md
  const changelogPath = path.join(process.cwd(), 'CHANGELOG.md');
  let changelog = "No changelog found.";
  if (fs.existsSync(changelogPath)) {
    changelog = fs.readFileSync(changelogPath, 'utf8');
  }

  return (
    <div className="max-w-3xl mx-auto pb-24 px-4 pt-12">
      <div className="flex flex-col items-center justify-center text-center mb-12">
        <div className="p-3 rounded-full bg-brand-light dark:bg-brand-dark/30 text-brand mb-3 shadow-lg">
          <Leaf size={32} />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">PlantStack</h1>
        <p className="text-lg text-surface-foreground/70 mb-4">A minimalist, self-hosted Plant-Tracker.</p>
        <div className="bg-surface border border-black/10 dark:border-white/10 px-3 py-1 rounded-full font-mono text-xs font-bold text-brand shadow-sm">
          Version {version}
        </div>
      </div>

      <div className="bg-surface p-8 rounded-3xl shadow-sm border border-black/5 dark:border-white/5">
        <div className="prose dark:prose-invert prose-brand max-w-none">
          <Markdown>{changelog}</Markdown>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <Link href="/" className="text-surface-foreground/50 hover:text-brand underline font-medium transition-colors">
          &larr; Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
