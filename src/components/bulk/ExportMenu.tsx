import { FileJson, FileSpreadsheet, FileText } from 'lucide-react';
import type { GeneratedPassword } from '@/types/password';
import { downloadExport, type ExportFormat } from '@/services/exportService';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/context/LocaleContext';

interface ExportMenuProps {
  items: GeneratedPassword[];
}

const FORMATS: Array<{ id: ExportFormat; label: string; icon: React.ReactNode }> = [
  { id: 'csv', label: 'CSV', icon: <FileSpreadsheet size={15} /> },
  { id: 'txt', label: 'TXT', icon: <FileText size={15} /> },
  { id: 'json', label: 'JSON', icon: <FileJson size={15} /> },
];

export function ExportMenu({ items }: ExportMenuProps) {
  const disabled = items.length === 0;
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-[var(--color-text-secondary)]">{t('bulkExportLabel')}</span>
      {FORMATS.map((format) => (
        <button
          key={format.id}
          type="button"
          disabled={disabled}
          onClick={() => downloadExport(items, format.id)}
          className={cn(
            'flex items-center gap-1.5 rounded-full border border-[var(--color-border)] px-3 py-1.5 text-xs font-medium',
            'text-[var(--color-text-secondary)] transition-colors',
            disabled
              ? 'cursor-not-allowed opacity-40'
              : 'hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-text-primary)]'
          )}
        >
          {format.icon}
          {format.label}
        </button>
      ))}
    </div>
  );
}
