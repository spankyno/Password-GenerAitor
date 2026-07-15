import { useEffect, useState } from 'react';
import { Save, FolderOpen, Trash2, ShieldCheck } from 'lucide-react';
import type { PasswordOptions } from '@/types/password';
import { deleteProfile, listProfiles, saveProfile, type SavedProfile } from '@/services/storageService';
import { useToast } from '@/context/ToastContext';
import { useTranslation } from '@/context/LocaleContext';
import { cn } from '@/lib/utils';

interface ProfileManagerProps {
  currentOptions: PasswordOptions;
  onApplyProfile: (options: PasswordOptions) => void;
}

export function ProfileManager({ currentOptions, onApplyProfile }: ProfileManagerProps) {
  const [profiles, setProfiles] = useState<SavedProfile[]>([]);
  const [name, setName] = useState('');
  const { showToast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    setProfiles(listProfiles());
  }, []);

  function handleSave() {
    if (!name.trim()) {
      showToast(t('profilesNamePrompt'), 'info');
      return;
    }
    const profile = saveProfile(name, currentOptions);
    setProfiles((prev) => [...prev, profile]);
    setName('');
    showToast(`"${profile.name}" ${t('profilesSaved')}`);
  }

  function handleApply(profile: SavedProfile) {
    onApplyProfile(profile.options);
    showToast(`"${profile.name}" ${t('profilesApplied')}`);
  }

  function handleDelete(profile: SavedProfile) {
    deleteProfile(profile.id);
    setProfiles((prev) => prev.filter((p) => p.id !== profile.id));
  }

  return (
    <section
      className="flex flex-col gap-3 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-6"
      aria-labelledby="profiles-heading"
    >
      <h2 id="profiles-heading" className="text-sm font-semibold text-[var(--color-text-primary)]">
        {t('profilesHeading')}
      </h2>

      <p className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]">
        <ShieldCheck size={13} className="flex-shrink-0 text-[var(--color-success)]" />
        {t('profilesPrivacyNote')}
      </p>

      <div className="flex gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          placeholder={t('profilesNamePlaceholder')}
          className="flex-1 rounded-[var(--radius-control)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3 py-2 text-sm text-[var(--color-text-primary)] outline-none focus-visible:border-[var(--color-accent)]"
          aria-label={t('profilesNamePlaceholder')}
        />
        <button
          type="button"
          onClick={handleSave}
          className="flex items-center gap-1.5 rounded-[var(--radius-control)] bg-[var(--color-accent)] px-3 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          <Save size={15} /> {t('profilesSave')}
        </button>
      </div>

      {profiles.length === 0 ? (
        <p className="text-xs text-[var(--color-text-secondary)]">{t('profilesEmpty')}</p>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {profiles.map((profile) => (
            <li
              key={profile.id}
              className="flex items-center justify-between gap-2 rounded-[var(--radius-control)] border border-[var(--color-border)] px-3 py-2"
            >
              <span className="truncate text-sm text-[var(--color-text-primary)]">{profile.name}</span>
              <div className="flex flex-shrink-0 gap-1">
                <button
                  type="button"
                  onClick={() => handleApply(profile)}
                  aria-label={`${t('profilesApplied')}: ${profile.name}`}
                  className={cn(
                    'flex h-7 w-7 items-center justify-center rounded-md text-[var(--color-text-secondary)]',
                    'transition-colors hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-accent)]'
                  )}
                >
                  <FolderOpen size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(profile)}
                  aria-label={`Delete: ${profile.name}`}
                  className={cn(
                    'flex h-7 w-7 items-center justify-center rounded-md text-[var(--color-text-secondary)]',
                    'transition-colors hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-danger)]'
                  )}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
