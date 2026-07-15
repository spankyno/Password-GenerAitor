import { describe, it, expect } from 'vitest';
import { QUICK_PRESETS } from './presets';
import { buildPassword } from './passwordBuilder';
import { buildPronounceablePassword } from './pronounceable';

describe('QUICK_PRESETS', () => {
  it('cada preset produce una contraseña generable sin errores', () => {
    for (const preset of QUICK_PRESETS) {
      const result = preset.options.pronounceable
        ? buildPronounceablePassword({ targetLength: preset.options.length })
        : buildPassword({
            length: preset.options.length,
            charset: preset.options.charset,
            exclusions: preset.options.exclusions,
            minimums: preset.options.minimums,
          });
      expect(result.password.length).toBeGreaterThan(0);
    }
  });

  it('tiene ids únicos', () => {
    const ids = QUICK_PRESETS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('incluye los presets esperados por el spec', () => {
    const ids = QUICK_PRESETS.map((p) => p.id);
    expect(ids).toEqual(
      expect.arrayContaining(['max-security', 'general-use', 'wifi', 'banking', 'development', 'passphrase'])
    );
  });

  it('el preset "passphrase" usa el modo pronunciable', () => {
    const passphrase = QUICK_PRESETS.find((p) => p.id === 'passphrase')!;
    expect(passphrase.options.pronounceable).toBe(true);
  });
});
