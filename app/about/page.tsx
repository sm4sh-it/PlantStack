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

  // Extract release date from changelog for current version if available
  const versionRegex = new RegExp(`##\\s*\\[${version}\\]\\s*-\\s*(\\d{4}-\\d{2}-\\d{2})`);
  const dateMatch = changelog.match(versionRegex) || changelog.match(/##\s*\[.*?\]\s*-\\s*(\d{4}-\\d{2}-\\d{2})/);
  const releaseDate = dateMatch ? dateMatch[1] : null;

  return (
    <div className="max-w-4xl mx-auto pb-24 px-4 pt-12">
      <div className="flex flex-col items-center justify-center text-center mb-12">
        <div className="p-3 rounded-full bg-brand-light dark:bg-brand-dark/30 text-brand mb-3 shadow-lg">
          <Leaf size={32} />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">PlantStack</h1>
        <p className="text-lg text-surface-foreground/70 mb-4">A minimalist, self-hosted Plant-Tracker.</p>
        <div className="bg-surface border border-border-hairline px-3.5 py-1 rounded-full font-mono text-xs font-bold text-brand shadow-xs inline-flex items-center gap-2">
          <span>Version {version}</span>
          {releaseDate && (
            <>
              <span className="text-text-muted/40">•</span>
              <span className="text-text-muted font-normal">{releaseDate}</span>
            </>
          )}
        </div>
      </div>

      <div className="bg-surface p-6 md:p-8 rounded-2xl md:rounded-3xl card-elevation border border-border-hairline">
        <div className="prose dark:prose-invert prose-brand max-w-none prose-p:text-[15px] prose-li:text-[15px] md:prose-sm">
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
